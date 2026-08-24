"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import { DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import { normalizeThemeTokens } from "@/lib/design/theme-css";
import { parseThemeTokensForm } from "@/lib/design/theme-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { themeTokensInitialState, type ThemeTokensActionState } from "@/features/design/actions/states";
import type { DesignThemeTokens } from "@/types/design";

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

/** Enregistre le brouillon des tokens (sans publier). */
export async function saveThemeTokensDraft(
  _previous: ThemeTokensActionState,
  formData: FormData,
): Promise<ThemeTokensActionState> {
  try {
    const user = await assertDesignEditor();
    const parsed = parseThemeTokensForm(formData);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const tokens = normalizeThemeTokens(parsed.data);
    await upsertThemeRow("draft", tokens, user.id);

    revalidatePath("/design/apparence");
    return { status: "success", message: "Brouillon enregistré." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de l'enregistrement.",
    };
  }
}

/** Publie les tokens (depuis le formulaire ou le brouillon existant). */
export async function publishThemeTokens(
  _previous: ThemeTokensActionState,
  formData: FormData,
): Promise<ThemeTokensActionState> {
  try {
    const user = await assertDesignEditor();

    let tokens: DesignThemeTokens;

    if (formData.get("use_current_form") === "1") {
      const parsed = parseThemeTokensForm(formData);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return { status: "error", message: first?.message ?? "Données invalides." };
      }
      tokens = normalizeThemeTokens(parsed.data);
    } else {
      const supabase = await createSupabaseServerClient();
      const { data: draft } = await supabase
        .from("design_theme_tokens")
        .select("tokens")
        .eq("status", "draft")
        .maybeSingle();

      tokens = normalizeThemeTokens(
        draft?.tokens && typeof draft.tokens === "object"
          ? (draft.tokens as Partial<DesignThemeTokens>)
          : DEFAULT_THEME_TOKENS,
      );
    }

    await upsertThemeRow("draft", tokens, user.id);
    await upsertThemeRow("published", tokens, user.id);

    revalidatePath("/", "layout");
    revalidatePath("/design/apparence");

    return { status: "success", message: "Apparence publiée sur le site." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de la publication.",
    };
  }
}

/** Réinitialise le brouillon aux valeurs codées par défaut. */
export async function resetThemeTokensDraft(
  _previous: ThemeTokensActionState,
  _formData: FormData,
): Promise<ThemeTokensActionState> {
  try {
    const user = await assertDesignEditor();
    await upsertThemeRow("draft", DEFAULT_THEME_TOKENS, user.id);

    revalidatePath("/design/apparence");
    return { status: "success", message: "Brouillon réinitialisé aux valeurs par défaut." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de la réinitialisation.",
    };
  }
}
