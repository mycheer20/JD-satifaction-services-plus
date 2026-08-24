import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { getSessionUser, isDesignEditor } from "@/features/auth/session";

export const DESIGN_PREVIEW_COOKIE = "design_preview";

export type DesignPreviewMode = "published" | "draft";

/** Lit le mode aperçu (brouillon réservé aux éditeurs design authentifiés). */
export const getDesignPreviewMode = cache(async (): Promise<DesignPreviewMode> => {
  const cookieStore = await cookies();
  if (cookieStore.get(DESIGN_PREVIEW_COOKIE)?.value !== "draft") {
    return "published";
  }

  const user = await getSessionUser();
  if (!user || !isDesignEditor(user)) {
    return "published";
  }

  return "draft";
});

export async function isDesignPreviewActive(): Promise<boolean> {
  return (await getDesignPreviewMode()) === "draft";
}

export async function getDesignPreviewOptions(): Promise<{ previewDraft: boolean }> {
  const mode = await getDesignPreviewMode();
  return { previewDraft: mode === "draft" };
}
