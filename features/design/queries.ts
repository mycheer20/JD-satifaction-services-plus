import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_HERO_CONFIG, DEFAULT_PLACEMENT_IMAGE, DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/design/about-defaults";
import { ABOUT_PAGE_SECTIONS, type AboutSectionId } from "@/lib/design/about-sections";
import { normalizeThemeTokens, themeTokensEqual } from "@/lib/design/theme-css";
import { DEFAULT_MOTION_SETTINGS, MOTION_PLACEMENT } from "@/lib/design/motion-defaults";
import { normalizeMotionSettings, motionSettingsEqual } from "@/lib/design/motion-css";
import { sectionViewDiffers } from "@/lib/design/editor-diff";
import { getDesignPreviewMode, getDesignPreviewOptions } from "@/lib/design/preview";
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
  ResolvedAboutSection,
  SectionEditorView,
  AboutSectionConfig,
  MotionSettings,
  DesignPublicationSnapshot,
  DesignPendingModule,
  DesignPublicationSummary,
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

export async function getPublishedFamilyCovers(options?: {
  previewDraft?: boolean;
}): Promise<Map<string, ResolvedPlacementMedia>> {
  const map = new Map<string, ResolvedPlacementMedia>();
  const familyPlacements = DESIGN_PLACEMENTS.filter((p) => p.familySlug);

  await Promise.all(
    familyPlacements.map(async (p) => {
      if (!p.familySlug) return;
      const media = await resolvePlacementMedia(p.id, options);
      if (media) map.set(p.familySlug, media);
    }),
  );

  return map;
}

function mergeAboutSectionContent(sectionId: AboutSectionId, config?: AboutSectionConfig | null) {
  const defaults = DEFAULT_ABOUT_CONTENT[sectionId];
  return {
    id: sectionId,
    title: config?.title?.trim() || defaults.title,
    subtitle: config?.subtitle?.trim() || defaults.subtitle,
    body: config?.body?.trim() || defaults.body,
    items: config?.items?.length ? config.items : defaults.items,
  };
}

async function resolveAboutSection(
  sectionId: AboutSectionId,
  options?: { previewDraft?: boolean },
): Promise<ResolvedAboutSection> {
  const def = ABOUT_PAGE_SECTIONS.find((section) => section.id === sectionId)!;
  const status: DesignPublishStatus = options?.previewDraft ? "draft" : "published";

  const supabase = await createSupabaseServerClient();
  const { data: sectionRow } = await supabase
    .from("design_section_configs")
    .select("*")
    .eq("placement", def.placement)
    .eq("status", status)
    .maybeSingle();

  const [published, media] = await Promise.all([
    options?.previewDraft
      ? Promise.resolve(sectionRow)
      : getPublishedSectionConfig(def.placement),
    def.supportsImage
      ? resolvePlacementMedia(def.placement, options)
      : Promise.resolve(null),
  ]);

  const configSource = options?.previewDraft ? sectionRow : published;
  const config = configSource?.config as AboutSectionConfig | undefined;
  const merged = mergeAboutSectionContent(sectionId, config);
  const imageConfig = { ...DEFAULT_PLACEMENT_IMAGE, ...config } as AboutSectionConfig;

  return {
    ...merged,
    placement: def.placement,
    imageUrl: media?.imageUrl ?? media?.slides?.[0]?.publicUrl,
    altText: media?.altText ?? media?.slides?.[0]?.altText,
    overlayOpacity:
      media?.overlayOpacity ?? imageConfig.overlayOpacity ?? DEFAULT_PLACEMENT_IMAGE.overlayOpacity!,
    imagePosition: media?.imagePosition ?? imageConfig.imagePosition ?? "center",
    hasPublishedOverride: Boolean(
      configSource && (media || configSource.config),
    ),
  };
}

export const getAboutSectionEditorStates = cache(async () => {
  const entries = await Promise.all(
    ABOUT_PAGE_SECTIONS.map(async (section) => {
      const [draft, published] = await Promise.all([
        loadSectionEditorView(section.placement, "draft"),
        loadSectionEditorView(section.placement, "published"),
      ]);
      return {
        section,
        draft,
        published,
        hasPublishedOverride: Boolean(published?.slides.length || published?.config),
      };
    }),
  );
  return entries;
});

export async function getPublishedAboutPageData(options?: {
  previewDraft?: boolean;
}): Promise<{
  sections: ResolvedAboutSection[];
  gallery: ResolvedGalleryItem[];
}> {
  const [sections, gallery] = await Promise.all([
    Promise.all(
      ABOUT_PAGE_SECTIONS.map((section) => resolveAboutSection(section.id, options)),
    ),
    getGalleryItemsForStorefront(options),
  ]);

  return { sections, gallery };
}

export type GalleryEditorItem = {
  id: string;
  mediaId: string;
  category: ResolvedGalleryItem["category"];
  title: string | null;
  description: string | null;
  position: number;
  status: DesignPublishStatus;
  isActive: boolean;
  media: DesignMediaRow | null;
};

export const getGalleryEditorItems = cache(async (): Promise<GalleryEditorItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("design_gallery_items")
    .select("*")
    .order("status")
    .order("position");

  const items = rows ?? [];
  const mediaMap = await loadMediaMap(items.map((row) => row.media_id));

  return items.map((row) => ({
    id: row.id,
    mediaId: row.media_id,
    category: row.category as ResolvedGalleryItem["category"],
    title: row.title,
    description: row.description,
    position: row.position,
    status: row.status as DesignPublishStatus,
    isActive: row.is_active,
    media: mediaMap.get(row.media_id) ?? null,
  }));
});

export async function getPublishedGalleryItemsByCategory(
  category?: string,
  options?: { previewDraft?: boolean },
): Promise<ResolvedGalleryItem[]> {
  const items = await getGalleryItemsForStorefront(options);
  if (!category || category === "all") return items;
  return items.filter((item) => item.category === category);
}

export async function getGalleryItemsForStorefront(options?: {
  previewDraft?: boolean;
}): Promise<ResolvedGalleryItem[]> {
  if (!options?.previewDraft) {
    return getPublishedGalleryItems();
  }

  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase
    .from("design_gallery_items")
    .select("*")
    .eq("is_active", true)
    .in("status", ["published", "draft"])
    .order("status")
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
}

export type MotionSettingsSource = "default" | "published" | "draft";

export type ResolvedMotionSettings = {
  settings: MotionSettings;
  source: MotionSettingsSource;
  hasPublishedOverride: boolean;
};

export const getPublishedMotionSettingsState = cache(async (): Promise<ResolvedMotionSettings> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("design_section_configs")
    .select("config")
    .eq("placement", MOTION_PLACEMENT)
    .eq("status", "published")
    .maybeSingle();

  if (!data?.config || typeof data.config !== "object") {
    return {
      settings: DEFAULT_MOTION_SETTINGS,
      source: "default",
      hasPublishedOverride: false,
    };
  }

  const settings = normalizeMotionSettings(data.config as Partial<MotionSettings>);
  const hasPublishedOverride = !motionSettingsEqual(settings, DEFAULT_MOTION_SETTINGS);

  return {
    settings,
    source: "published",
    hasPublishedOverride,
  };
});

export const getDraftMotionSettings = cache(async (): Promise<MotionSettings> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("design_section_configs")
    .select("config")
    .eq("placement", MOTION_PLACEMENT)
    .eq("status", "draft")
    .maybeSingle();

  if (!data?.config || typeof data.config !== "object") {
    return DEFAULT_MOTION_SETTINGS;
  }

  return normalizeMotionSettings(data.config as Partial<MotionSettings>);
});

export async function getStorefrontThemeState(): Promise<ResolvedThemeTokens> {
  const previewDraft = (await getDesignPreviewMode()) === "draft";
  if (!previewDraft) {
    return getPublishedThemeTokensState();
  }

  const tokens = await getDraftThemeTokens();
  return {
    tokens,
    source: "draft",
    hasPublishedOverride: true,
  };
}

export async function getStorefrontMotionSettingsState(): Promise<ResolvedMotionSettings> {
  const previewDraft = (await getDesignPreviewMode()) === "draft";
  if (!previewDraft) {
    return getPublishedMotionSettingsState();
  }

  const settings = await getDraftMotionSettings();
  return {
    settings,
    source: "draft",
    hasPublishedOverride: true,
  };
}

export const getDesignPendingModules = cache(async (): Promise<DesignPendingModule[]> => {
  const supabase = await createSupabaseServerClient();

  const [
    draftTheme,
    publishedThemeState,
    draftMotion,
    publishedMotionState,
    heroState,
    familyStates,
    aboutStates,
    galleryDrafts,
  ] = await Promise.all([
    getDraftThemeTokens(),
    getPublishedThemeTokensState(),
    getDraftMotionSettings(),
    getPublishedMotionSettingsState(),
    getHeroSectionEditorState(),
    getFamilyPlacementEditorStates(),
    getAboutSectionEditorStates(),
    supabase
      .from("design_gallery_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft")
      .eq("is_active", true),
  ]);

  const themePending = !themeTokensEqual(draftTheme, publishedThemeState.tokens);
  const motionPending = !motionSettingsEqual(draftMotion, publishedMotionState.settings);
  const heroPending = sectionViewDiffers(heroState.draft, heroState.published);
  const familiesPending = familyStates.filter((entry) =>
    sectionViewDiffers(entry.draft, entry.published),
  ).length;
  const aboutPending = aboutStates.filter((entry) =>
    sectionViewDiffers(entry.draft, entry.published),
  ).length;
  const galleryPending = galleryDrafts.count ?? 0;

  return [
    {
      id: "theme",
      label: "Apparence & couleurs",
      href: "/design/apparence",
      pending: themePending,
      detail: themePending ? "Tokens modifiés" : undefined,
    },
    {
      id: "motion",
      label: "Animations",
      href: "/design/animations",
      pending: motionPending,
      detail: motionPending ? "Paramètres modifiés" : undefined,
    },
    {
      id: "home",
      label: "Page d'accueil",
      href: "/design/accueil",
      pending: heroPending || familiesPending > 0,
      detail:
        heroPending && familiesPending > 0
          ? "Hero + familles"
          : heroPending
            ? "Hero modifié"
            : familiesPending > 0
              ? `${familiesPending} couverture${familiesPending > 1 ? "s" : ""}`
              : undefined,
    },
    {
      id: "about",
      label: "Page À propos",
      href: "/design/a-propos",
      pending: aboutPending > 0,
      detail: aboutPending > 0 ? `${aboutPending} section${aboutPending > 1 ? "s" : ""}` : undefined,
    },
    {
      id: "gallery",
      label: "Galerie entreprise",
      href: "/design/galerie",
      pending: galleryPending > 0,
      detail: galleryPending > 0 ? `${galleryPending} photo${galleryPending > 1 ? "s" : ""}` : undefined,
    },
  ];
});

export async function buildDesignPublicationSnapshot(): Promise<DesignPublicationSnapshot> {
  const supabase = await createSupabaseServerClient();
  const [theme, motion, sectionPlacements, galleryPublished, galleryDraft] = await Promise.all([
    getDraftThemeTokens(),
    getDraftMotionSettings(),
    DESIGN_PLACEMENTS.filter((p) => p.id !== "site.motion"),
    supabase
      .from("design_gallery_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_active", true),
    supabase
      .from("design_gallery_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft")
      .eq("is_active", true),
  ]);

  const sections = await Promise.all(
    sectionPlacements.map(async (placement) => {
      const view = await loadSectionEditorView(placement.id, "draft");
      return {
        placement: placement.id,
        slideCount: view?.slides.length ?? 0,
      };
    }),
  );

  return {
    version: 1,
    publishedAt: new Date().toISOString(),
    theme,
    motion,
    sections,
    gallery: {
      publishedCount: galleryPublished.count ?? 0,
      draftCount: galleryDraft.count ?? 0,
    },
  };
}

export const getDesignPublicationHistory = cache(
  async (limit = 8): Promise<DesignPublicationSummary[]> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("design_publications")
      .select("id, published_at, notes, published_by")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (!data?.length) return [];

    const userIds = [...new Set(data.map((row) => row.published_by).filter(Boolean))] as string[];
    const nameMap = new Map<string, string>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, full_name")
        .in("id", userIds);

      for (const profile of profiles ?? []) {
        if (profile.full_name) nameMap.set(profile.id, profile.full_name);
      }
    }

    return data.map((row) => ({
      id: row.id,
      publishedAt: row.published_at,
      notes: row.notes,
      publishedByLabel: row.published_by ? nameMap.get(row.published_by) ?? null : null,
    }));
  },
);

export { getDesignPreviewMode, getDesignPreviewOptions };
