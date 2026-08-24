"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import { publishAllGalleryDrafts } from "@/features/design/actions/gallery";
import { publishSectionDraftIfExists } from "@/features/design/actions/sections";
import {
  buildDesignPublicationSnapshot,
  getDraftMotionSettings,
  getDraftThemeTokens,
} from "@/features/design/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MOTION_PLACEMENT } from "@/lib/design/motion-defaults";
import { normalizeMotionSettings } from "@/lib/design/motion-css";
import { normalizeThemeTokens } from "@/lib/design/theme-css";
import { DESIGN_PLACEMENTS } from "@/lib/design/placements";
import type { DesignThemeTokens, MotionSettings } from "@/types/design";
import type { Json } from "@/types/database";

export type PublicationActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const publicationActionInitial: PublicationActionState = { status: "idle" };

const STOREFRONT_PATHS = ["/", "/a-propos", "/galerie"] as const;
const DESIGN_PATHS = [
  "/design",
  "/design/publication",
  "/design/apparence",
  "/design/animations",
  "/design/accueil",
  "/design/a-propos",
  "/design/galerie",
] as const;

function revalidateAllDesign() {
  revalidatePath("/", "layout");
  for (const path of STOREFRONT_PATHS) revalidatePath(path);
  for (const path of DESIGN_PATHS) revalidatePath(path);
}

async function upsertThemeRow(
  status: "draft" | "published",
  tokens: DesignThemeTokens,
  userId: string,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("design_theme_tokens").upsert(
    {
      status,
      tokens,
      updated_by: userId,
    },
    { onConflict: "status" },
  );
  if (error) throw new Error(error.message);
}

async function upsertMotionRow(
  status: "draft" | "published",
  settings: MotionSettings,
  userId: string,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("design_section_configs").upsert(
    {
      placement: MOTION_PLACEMENT,
      status,
      config: settings as unknown as Json,
      updated_by: userId,
      ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
    },
    { onConflict: "placement,status" },
  );
  if (error) throw new Error(error.message);
}

async function recordPublication(userId: string, notes: string | null) {
  const snapshot = await buildDesignPublicationSnapshot();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("design_publications").insert({
    published_by: userId,
    notes,
    snapshot: snapshot as unknown as Json,
    published_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/** Publie tous les brouillons design et enregistre un snapshot historique. */
export async function publishAllDesign(
  _previous: PublicationActionState,
  formData: FormData,
): Promise<PublicationActionState> {
  try {
    const user = await assertDesignEditor();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const theme = normalizeThemeTokens(await getDraftThemeTokens());
    await upsertThemeRow("draft", theme, user.id);
    await upsertThemeRow("published", theme, user.id);

    const motion = normalizeMotionSettings(await getDraftMotionSettings());
    await upsertMotionRow("draft", motion, user.id);
    await upsertMotionRow("published", motion, user.id);

    let sectionsPublished = 0;
    for (const placement of DESIGN_PLACEMENTS) {
      if (placement.id === "site.motion" || placement.id === "home.families") continue;
      const published = await publishSectionDraftIfExists(placement.id, user.id);
      if (published) sectionsPublished += 1;
    }

    const galleryResult = await publishAllGalleryDrafts(publicationActionInitial);
    if (galleryResult.status === "error") {
      return galleryResult;
    }

    const galleryPublished =
      galleryResult.status === "success" &&
      galleryResult.message !== "Aucun brouillon à publier.";

    await recordPublication(user.id, notes);
    revalidateAllDesign();

    const parts = [
      "Apparence",
      "Animations",
      sectionsPublished > 0
        ? `${sectionsPublished} section${sectionsPublished > 1 ? "s" : ""}`
        : null,
      galleryPublished ? "Galerie" : null,
    ].filter(Boolean);

    return {
      status: "success",
      message:
        parts.length > 0
          ? `Publication réussie : ${parts.join(", ")}.`
          : "Publication enregistrée — aucun brouillon en attente.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication globale impossible.",
    };
  }
}
