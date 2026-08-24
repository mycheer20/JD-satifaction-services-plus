import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_HERO_CONFIG,
  DEFAULT_PLACEMENT_IMAGE,
  DEFAULT_THEME_TOKENS,
} from "@/lib/design/defaults";
import { normalizeThemeTokens, themeTokensEqual } from "@/lib/design/theme-css";
import { isValidPlacement, DESIGN_PLACEMENTS } from "@/lib/design/placements";
import type { SlideTransition } from "@/lib/design/placements";
import type {
  DesignThemeTokens,
  DesignMediaKindFilter,
  HeroSectionConfig,
  PlacementImageConfig,
  ResolvedGalleryItem,
  ResolvedPlacementMedia,
  ResolvedSlide,
  SectionEditorView,
} from "@/types/design";
import type {
  DesignMediaRow,
  DesignPublishStatus,
  DesignSectionConfigRow,
  DesignSlideRow,
} from "@/types/database";

type LoadStatus = DesignPublishStatus | "preview-draft";

export type ThemeTokensSource = "default" | "published" | "draft";

export type ResolvedThemeTokens = {
  tokens: DesignThemeTokens;
  source: ThemeTokensSource;
  hasPublishedOverride: boolean;
};

export const getPublishedThemeTokensState = cache(async (): Promise<ResolvedThemeTokens> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("design_theme_tokens")
    .select("tokens")
    .eq("status", "published")
    .maybeSingle();

  if (!data?.tokens || typeof data.tokens !== "object") {
    return {
      tokens: DEFAULT_THEME_TOKENS,
      source: "default",
      hasPublishedOverride: false,
    };
  }

  const tokens = normalizeThemeTokens(data.tokens as Partial<DesignThemeTokens>);
  const hasPublishedOverride = !themeTokensEqual(tokens, DEFAULT_THEME_TOKENS);

  return {
    tokens,
    source: "published",
    hasPublishedOverride,
  };
});

export const getDraftThemeTokens = cache(async (): Promise<DesignThemeTokens> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("design_theme_tokens")
    .select("tokens")
    .eq("status", "draft")
    .maybeSingle();

  if (!data?.tokens || typeof data.tokens !== "object") {
    return DEFAULT_THEME_TOKENS;
  }

  return normalizeThemeTokens(data.tokens as Partial<DesignThemeTokens>);
});

export const getPublishedSectionConfig = cache(
  async (placement: string): Promise<DesignSectionConfigRow | null> => {
    if (!isValidPlacement(placement)) return null;

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("design_section_configs")
      .select("*")
      .eq("placement", placement)
      .eq("status", "published")
      .maybeSingle();

    return data ?? null;
  },
);

export const getThemeTokens = cache(
  async (status: LoadStatus = "published"): Promise<DesignThemeTokens> => {
    if (status === "preview-draft") {
      return getDraftThemeTokens();
    }

    const state = await getPublishedThemeTokensState();
    return state.tokens;
  },
);

async function loadMediaMap(ids: string[]): Promise<Map<string, DesignMediaRow>> {
  const map = new Map<string, DesignMediaRow>();
  if (ids.length === 0) return map;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("design_media").select("*").in("id", ids);

  for (const row of data ?? []) {
    map.set(row.id, row);
  }
  return map;
}

export async function resolvePlacementMedia(
  placement: string,
  options?: { previewDraft?: boolean },
): Promise<ResolvedPlacementMedia | null> {
  if (!isValidPlacement(placement)) return null;

  const status: DesignPublishStatus = options?.previewDraft ? "draft" : "published";
  const supabase = await createSupabaseServerClient();

  const { data: section } = await supabase
    .from("design_section_configs")
    .select("*")
    .eq("placement", placement)
    .eq("status", status)
    .maybeSingle();

  if (!section) return null;

  const config = (section.config ?? {}) as HeroSectionConfig | PlacementImageConfig;
  const heroConfig = { ...DEFAULT_HERO_CONFIG, ...config } as HeroSectionConfig;

  if (placement === "home.hero" && heroConfig.mode === "gradient") {
    return null;
  }

  const { data: slides } = await supabase
    .from("design_slides")
    .select("*")
    .eq("section_config_id", section.id)
    .eq("is_active", true)
    .order("position");

  const slideRows = (slides ?? []) as DesignSlideRow[];
  if (slideRows.length === 0) return null;

  const mediaMap = await loadMediaMap(slideRows.map((s) => s.media_id));
  const activeSlides = slideRows
    .map((slide) => ({ slide, media: mediaMap.get(slide.media_id) }))
    .filter((entry): entry is { slide: DesignSlideRow; media: DesignMediaRow } =>
      Boolean(entry.media?.is_active),
    );

  if (activeSlides.length === 0) return null;

  if (activeSlides.length > 1 || heroConfig.mode === "slider") {
    const resolvedSlides: ResolvedSlide[] = activeSlides.map(({ slide, media }) => ({
      id: slide.id,
      publicUrl: media.public_url,
      altText: slide.alt_text?.trim() || media.alt_text?.trim() || media.display_name,
      durationMs: slide.duration_ms,
      transition: slide.transition as ResolvedSlide["transition"],
      overlayOpacity: Number(slide.overlay_opacity),
      imagePosition: slide.image_position,
    }));

    return {
      placement,
      mode: "slider",
      overlayOpacity: heroConfig.overlayOpacity ?? DEFAULT_HERO_CONFIG.overlayOpacity!,
      imagePosition: heroConfig.imagePosition ?? "center",
      slides: resolvedSlides,
      config: heroConfig,
    };
  }

  const { slide, media } = activeSlides[0]!;
  const imageConfig = { ...DEFAULT_PLACEMENT_IMAGE, ...config } as PlacementImageConfig;

  return {
    placement,
    mode: "image",
    imageUrl: media.public_url,
    altText: slide.alt_text?.trim() || media.alt_text?.trim() || media.display_name,
    overlayOpacity: Number(slide.overlay_opacity ?? imageConfig.overlayOpacity ?? 0.4),
    imagePosition: slide.image_position ?? imageConfig.imagePosition ?? "center",
    config: imageConfig,
  };
}

export const getPublishedGalleryItems = cache(async (): Promise<ResolvedGalleryItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase
    .from("design_gallery_items")
    .select("*")
    .eq("status", "published")
    .eq("is_active", true)
    .order("position");

  const rows = items ?? [];
  const mediaMap = await loadMediaMap(rows.map((r) => r.media_id));

  return rows
    .map((row) => {
      const media = mediaMap.get(row.media_id);
      if (!media?.is_active) return null;
      return {
        id: row.id,
        publicUrl: media.public_url,
        altText: media.alt_text?.trim() || row.title?.trim() || media.display_name,
        title: row.title,
        description: row.description,
        category: row.category as ResolvedGalleryItem["category"],
      };
    })
    .filter((item): item is ResolvedGalleryItem => item !== null);
});

export type DesignMediaLibraryOptions = {
  kind?: DesignMediaKindFilter;
  search?: string;
  includeInactive?: boolean;
};

export const getDesignMediaLibrary = cache(
  async (options?: DesignMediaLibraryOptions): Promise<DesignMediaRow[]> => {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("design_media")
      .select("*")
      .order("created_at", { ascending: false });

    if (!options?.includeInactive) {
      query = query.eq("is_active", true);
    }

    const kind = options?.kind ?? "all";
    if (kind !== "all") {
      query = query.eq("media_kind", kind);
    }

    const search = options?.search?.trim().replace(/[%_]/g, "");
    if (search) {
      query = query.or(
        `display_name.ilike.%${search}%,alt_text.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    const { data } = await query;
    return data ?? [];
  },
);

export const getDesignMediaById = cache(
  async (mediaId: string): Promise<DesignMediaRow | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("design_media").select("*").eq("id", mediaId).maybeSingle();
    return data ?? null;
  },
);

async function loadSectionEditorView(
  placement: string,
  status: DesignPublishStatus,
): Promise<SectionEditorView | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section } = await supabase
    .from("design_section_configs")
    .select("*")
    .eq("placement", placement)
    .eq("status", status)
    .maybeSingle();

  if (!section) return null;

  const { data: slides } = await supabase
    .from("design_slides")
    .select("*")
    .eq("section_config_id", section.id)
    .order("position");

  const slideRows = (slides ?? []) as DesignSlideRow[];
  const mediaMap = await loadMediaMap(slideRows.map((s) => s.media_id));

  return {
    placement,
    config: (section.config ?? {}) as HeroSectionConfig | PlacementImageConfig,
    slides: slideRows.map((slide) => ({
      id: slide.id,
      mediaId: slide.media_id,
      altText: slide.alt_text?.trim() ?? "",
      position: slide.position,
      durationMs: slide.duration_ms,
      transition: slide.transition as SlideTransition,
      overlayOpacity: Number(slide.overlay_opacity),
      imagePosition: slide.image_position,
      media: mediaMap.get(slide.media_id) ?? null,
    })),
    publishedAt: section.published_at,
  };
}

export const getHeroSectionEditorState = cache(async () => {
  const [draft, published] = await Promise.all([
    loadSectionEditorView("home.hero", "draft"),
    loadSectionEditorView("home.hero", "published"),
  ]);

  return {
    draft,
    published,
    hasPublishedOverride: Boolean(published?.slides.length || published?.config),
  };
});

export const getFamilyPlacementEditorStates = cache(async () => {
  const familyPlacements = DESIGN_PLACEMENTS.filter((p) => p.id.startsWith("home.family."));
  const entries = await Promise.all(
    familyPlacements.map(async (placement) => {
      const [draft, published] = await Promise.all([
        loadSectionEditorView(placement.id, "draft"),
        loadSectionEditorView(placement.id, "published"),
      ]);
      return {
        placement,
        draft,
        published,
        hasPublishedImage: Boolean(published?.slides.length),
      };
    }),
  );
  return entries;
});

export async function getPublishedFamilyCovers(): Promise<Map<string, ResolvedPlacementMedia>> {
  const map = new Map<string, ResolvedPlacementMedia>();
  const familyPlacements = DESIGN_PLACEMENTS.filter((p) => p.familySlug);

  await Promise.all(
    familyPlacements.map(async (p) => {
      if (!p.familySlug) return;
      const media = await resolvePlacementMedia(p.id);
      if (media) map.set(p.familySlug, media);
    }),
  );

  return map;
}
