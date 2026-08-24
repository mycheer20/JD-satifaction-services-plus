"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import { DEFAULT_MOTION_SETTINGS, MOTION_PLACEMENT } from "@/lib/design/motion-defaults";
import { normalizeMotionSettings } from "@/lib/design/motion-css";
import { parseMotionSettingsForm } from "@/lib/design/motion-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MotionSettings } from "@/types/design";
import type { Json } from "@/types/database";

export type MotionActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const motionActionInitial: MotionActionState = { status: "idle" };

async function upsertMotionRow(status: "draft" | "published", settings: MotionSettings, userId: string) {
  const supabase = await createSupabaseServerClient();
  const payload = {
    placement: MOTION_PLACEMENT,
    status,
    config: settings as unknown as Json,
    updated_by: userId,
    ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
  };

  const { error } = await supabase
    .from("design_section_configs")
    .upsert(payload, { onConflict: "placement,status" });

  if (error) throw new Error(error.message);
}

export async function saveMotionDraft(
  _previous: MotionActionState,
  formData: FormData,
): Promise<MotionActionState> {
  try {
    const user = await assertDesignEditor();
    const parsed = parseMotionSettingsForm(formData);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const settings = normalizeMotionSettings(parsed.data);
    await upsertMotionRow("draft", settings, user.id);

    revalidatePath("/design/animations");
    return { status: "success", message: "Brouillon enregistré." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de l'enregistrement.",
    };
  }
}

export async function publishMotionSettings(
  _previous: MotionActionState,
  formData: FormData,
): Promise<MotionActionState> {
  try {
    const user = await assertDesignEditor();

    let settings: MotionSettings;

    if (formData.get("use_current_form") === "1") {
      const parsed = parseMotionSettingsForm(formData);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return { status: "error", message: first?.message ?? "Données invalides." };
      }
      settings = normalizeMotionSettings(parsed.data);
    } else {
      const supabase = await createSupabaseServerClient();
      const { data: draft } = await supabase
        .from("design_section_configs")
        .select("config")
        .eq("placement", MOTION_PLACEMENT)
        .eq("status", "draft")
        .maybeSingle();

      settings = normalizeMotionSettings(
        draft?.config && typeof draft.config === "object"
          ? (draft.config as Partial<MotionSettings>)
          : DEFAULT_MOTION_SETTINGS,
      );
    }

    await upsertMotionRow("draft", settings, user.id);
    await upsertMotionRow("published", settings, user.id);

    revalidatePath("/", "layout");
    revalidatePath("/design/animations");

    return { status: "success", message: "Animations publiées sur le site." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de la publication.",
    };
  }
}

export async function resetMotionDraft(
  _previous: MotionActionState,
  _formData: FormData,
): Promise<MotionActionState> {
  try {
    const user = await assertDesignEditor();
    await upsertMotionRow("draft", DEFAULT_MOTION_SETTINGS, user.id);

    revalidatePath("/design/animations");
    return { status: "success", message: "Brouillon réinitialisé aux valeurs par défaut." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de la réinitialisation.",
    };
  }
}
