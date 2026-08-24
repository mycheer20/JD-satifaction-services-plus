"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import {
  parseAboutSectionPayload,
  parseFamilyCoverPayload,
  parseHeroDraftPayload,
  validateAboutSectionForPublish,
  validateFamilyCoverForPublish,
  validateHeroForPublish,
  type AboutSectionPayload,
  type FamilyCoverPayload,
} from "@/lib/design/section-validation";
import { isAboutPlacement } from "@/lib/design/about-sections";
import { isValidPlacement, type DesignPlacementId } from "@/lib/design/placements";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AboutSectionConfig, HeroSectionConfig, PlacementImageConfig } from "@/types/design";
import type { HeroDraftPayload } from "@/lib/design/section-validation";
import type { DesignSlideRow, Json } from "@/types/database";

const REVALIDATE_PATHS = ["/", "/design/accueil"] as const;
const ABOUT_REVALIDATE_PATHS = ["/a-propos", "/design/a-propos"] as const;

function revalidateHomeDesign() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

function revalidateAboutDesign() {
  for (const path of ABOUT_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

export type SectionActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const sectionActionInitial: SectionActionState = { status: "idle" };

async function upsertDraftSection(placement: string, config: Json, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("design_section_configs")
    .upsert(
      {
        placement,
        status: "draft" as const,
        config,
        updated_by: userId,
      },
      { onConflict: "placement,status" },
    )
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Impossible d'enregistrer le brouillon.");
  return data.id;
}

async function replaceSectionSlides(sectionConfigId: string, slides: HeroDraftPayload["slides"]) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("design_slides").delete().eq("section_config_id", sectionConfigId);

  if (slides.length === 0) return;

  const rows = slides.map((slide, index) => ({
    section_config_id: sectionConfigId,
    media_id: slide.mediaId,
    position: slide.position ?? index,
    duration_ms: slide.durationMs ?? 6000,
    transition: slide.transition ?? "fade",
    overlay_opacity: slide.overlayOpacity ?? 0.45,
    image_position: slide.imagePosition ?? "center",
    alt_text: slide.altText.trim() || " ",
    is_active: true,
  }));

  const { error } = await supabase.from("design_slides").insert(rows);
  if (error) throw new Error(error.message);
}

async function publishSection(placement: string, userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: draft } = await supabase
    .from("design_section_configs")
    .select("*")
    .eq("placement", placement)
    .eq("status", "draft")
    .maybeSingle();

  if (!draft) {
    throw new Error("Aucun brouillon à publier pour cet emplacement.");
  }

  const { data: draftSlides } = await supabase
    .from("design_slides")
    .select("*")
    .eq("section_config_id", draft.id)
    .eq("is_active", true)
    .order("position");

  const { data: published, error: publishError } = await supabase
    .from("design_section_configs")
    .upsert(
      {
        placement,
        status: "published" as const,
        config: draft.config,
        published_at: new Date().toISOString(),
        updated_by: userId,
      },
      { onConflict: "placement,status" },
    )
    .select("id")
    .single();

  if (publishError || !published) {
    throw new Error(publishError?.message ?? "Publication impossible.");
  }

  await supabase.from("design_slides").delete().eq("section_config_id", published.id);

  const slides = (draftSlides ?? []) as DesignSlideRow[];
  if (slides.length > 0) {
    const { error: slideError } = await supabase.from("design_slides").insert(
      slides.map((slide) => ({
        section_config_id: published.id,
        media_id: slide.media_id,
        position: slide.position,
        duration_ms: slide.duration_ms,
        transition: slide.transition,
        overlay_opacity: slide.overlay_opacity,
        image_position: slide.image_position,
        alt_text: slide.alt_text,
        is_active: slide.is_active,
      })),
    );
    if (slideError) throw new Error(slideError.message);
  }

  revalidateHomeDesign();
}

export async function saveHeroDraft(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { status: "error", message: "Données invalides." };
    }

    const parsed = parseHeroDraftPayload(JSON.parse(raw));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const payload = parsed.data;
    const sectionId = await upsertDraftSection("home.hero", payload.config as Json, user.id);

    const slides =
      payload.config.mode === "gradient"
        ? []
        : payload.slides.map((slide, index) => ({ ...slide, position: index }));

    await replaceSectionSlides(sectionId, slides);
    revalidatePath("/design/accueil");

    return { status: "success", message: "Brouillon hero enregistré." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Enregistrement impossible.",
    };
  }
}

export async function publishHeroSection(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const raw = formData.get("payload");

    if (typeof raw === "string" && raw.trim()) {
      const saveResult = await saveHeroDraft(sectionActionInitial, formData);
      if (saveResult.status === "error") return saveResult;

      const parsed = parseHeroDraftPayload(JSON.parse(raw));
      if (parsed.success) {
        const validationError = validateHeroForPublish(parsed.data);
        if (validationError) return { status: "error", message: validationError };
      }
    } else {
      const supabase = await createSupabaseServerClient();
      const { data: draft } = await supabase
        .from("design_section_configs")
        .select("config")
        .eq("placement", "home.hero")
        .eq("status", "draft")
        .maybeSingle();

      const config = draft?.config as HeroSectionConfig | undefined;
      if (config && config.mode !== "gradient") {
        return {
          status: "error",
          message: "Enregistrez un brouillon hero valide avant publication.",
        };
      }
    }

    await publishSection("home.hero", user.id);
    return { status: "success", message: "Hero publié sur la page d'accueil." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication impossible.",
    };
  }
}

export async function saveFamilyCoverDraft(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "");
    if (!isValidPlacement(placement) || !placement.startsWith("home.family.")) {
      return { status: "error", message: "Emplacement famille invalide." };
    }

    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { status: "error", message: "Données invalides." };
    }

    const parsed = parseFamilyCoverPayload(JSON.parse(raw));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const payload = parsed.data;
    const imageConfig: PlacementImageConfig = {
      overlayOpacity: payload.overlayOpacity ?? 0.4,
      imagePosition: payload.imagePosition ?? "center",
      hoverScale: payload.hoverScale ?? 1.03,
      enableHover: payload.enableHover ?? true,
    };

    const sectionId = await upsertDraftSection(placement, imageConfig as Json, user.id);

    if (payload.mediaId) {
      await replaceSectionSlides(sectionId, [
        {
          mediaId: payload.mediaId,
          altText: payload.altText?.trim() || " ",
          position: 0,
          overlayOpacity: payload.overlayOpacity,
          imagePosition: payload.imagePosition,
        },
      ]);
    } else {
      await replaceSectionSlides(sectionId, []);
    }

    revalidatePath("/design/accueil");
    return { status: "success", message: "Couverture famille enregistrée en brouillon." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Enregistrement impossible.",
    };
  }
}

export async function publishFamilyCover(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "") as DesignPlacementId;
    if (!isValidPlacement(placement) || !placement.startsWith("home.family.")) {
      return { status: "error", message: "Emplacement famille invalide." };
    }

    const saveResult = await saveFamilyCoverDraft(sectionActionInitial, formData);
    if (saveResult.status === "error") return saveResult;

    const raw = formData.get("payload");
    if (typeof raw === "string" && raw.trim()) {
      const parsed = parseFamilyCoverPayload(JSON.parse(raw));
      if (parsed.success) {
        const validationError = validateFamilyCoverForPublish(parsed.data);
        if (validationError) return { status: "error", message: validationError };
      }
    }

    await publishSection(placement, user.id);
    return { status: "success", message: "Couverture famille publiée." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication impossible.",
    };
  }
}

export async function clearFamilyCoverDraft(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "");
    if (!isValidPlacement(placement) || !placement.startsWith("home.family.")) {
      return { status: "error", message: "Emplacement invalide." };
    }

    const empty = new FormData();
    empty.set("placement", placement);
    empty.set(
      "payload",
      JSON.stringify({
        mediaId: null,
        altText: "",
        overlayOpacity: 0.4,
        imagePosition: "center",
      } satisfies FamilyCoverPayload),
    );

    await saveFamilyCoverDraft(sectionActionInitial, empty);
    return { status: "success", message: "Brouillon réinitialisé — gradient par défaut." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Réinitialisation impossible.",
    };
  }
}

export async function saveAboutSectionDraft(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "");
    if (!isValidPlacement(placement) || !isAboutPlacement(placement)) {
      return { status: "error", message: "Emplacement À propos invalide." };
    }

    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { status: "error", message: "Données invalides." };
    }

    const parsed = parseAboutSectionPayload(JSON.parse(raw));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const payload = parsed.data;
    const sectionConfig: AboutSectionConfig = {
      title: payload.title,
      subtitle: payload.subtitle,
      body: payload.body,
      items: payload.items,
      overlayOpacity: payload.overlayOpacity ?? 0.45,
      imagePosition: payload.imagePosition ?? "center",
    };

    const sectionId = await upsertDraftSection(placement, sectionConfig as Json, user.id);

    if (payload.mediaId) {
      await replaceSectionSlides(sectionId, [
        {
          mediaId: payload.mediaId,
          altText: payload.altText?.trim() || " ",
          position: 0,
          overlayOpacity: payload.overlayOpacity,
          imagePosition: payload.imagePosition,
        },
      ]);
    } else {
      await replaceSectionSlides(sectionId, []);
    }

    revalidatePath("/design/a-propos");
    return { status: "success", message: "Section enregistrée en brouillon." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Enregistrement impossible.",
    };
  }
}

export async function publishAboutSection(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    const user = await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "") as DesignPlacementId;
    if (!isValidPlacement(placement) || !isAboutPlacement(placement)) {
      return { status: "error", message: "Emplacement À propos invalide." };
    }

    const saveResult = await saveAboutSectionDraft(sectionActionInitial, formData);
    if (saveResult.status === "error") return saveResult;

    const raw = formData.get("payload");
    if (typeof raw === "string" && raw.trim()) {
      const parsed = parseAboutSectionPayload(JSON.parse(raw));
      if (parsed.success) {
        const validationError = validateAboutSectionForPublish(parsed.data);
        if (validationError) return { status: "error", message: validationError };
      }
    }

    await publishSection(placement, user.id);
    revalidateAboutDesign();
    return { status: "success", message: "Section publiée sur la page À propos." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication impossible.",
    };
  }
}

export async function clearAboutSectionDraft(
  _previous: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  try {
    await assertDesignEditor();
    const placement = String(formData.get("placement") ?? "");
    if (!isValidPlacement(placement) || !isAboutPlacement(placement)) {
      return { status: "error", message: "Emplacement invalide." };
    }

    const empty = new FormData();
    empty.set("placement", placement);
    empty.set(
      "payload",
      JSON.stringify({
        mediaId: null,
        altText: "",
        overlayOpacity: 0.45,
        imagePosition: "center",
      } satisfies AboutSectionPayload),
    );

    await saveAboutSectionDraft(sectionActionInitial, empty);
    return { status: "success", message: "Brouillon réinitialisé — contenu par défaut." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Réinitialisation impossible.",
    };
  }
}

/** Publie un emplacement si un brouillon existe. Retourne false si aucun brouillon. */
export async function publishSectionDraftIfExists(
  placement: string,
  userId: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: draft } = await supabase
    .from("design_section_configs")
    .select("id")
    .eq("placement", placement)
    .eq("status", "draft")
    .maybeSingle();

  if (!draft) return false;

  await publishSection(placement, userId);
  return true;
}
