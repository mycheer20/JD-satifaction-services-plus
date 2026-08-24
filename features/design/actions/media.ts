"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import { DESIGN_BUCKET } from "@/lib/design/placements";
import {
  assertSafeStoragePath,
  buildDesignStoragePath,
  safeDisplayName,
  toMediaUploadResult,
  validateDesignMediaUpload,
} from "@/lib/design/media-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MediaUploadResult } from "@/types/design";

export type DesignMediaUploadState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; media: MediaUploadResult };

/**
 * Upload sécurisé vers la bibliothèque média Design.
 * Vérification rôle côté serveur + RLS Supabase.
 */
export async function uploadDesignMedia(
  _previous: DesignMediaUploadState,
  formData: FormData,
): Promise<DesignMediaUploadState> {
  try {
    const user = await assertDesignEditor();

    const file = formData.get("file");
    const altText = String(formData.get("alt_text") ?? "").trim();
    const displayNameRaw = String(formData.get("display_name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim() || null;

    if (!(file instanceof File)) {
      return { status: "error", message: "Aucun fichier sélectionné." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = validateDesignMediaUpload(file, buffer);
    if (!validation.ok) {
      return { status: "error", message: validation.error.message };
    }

    const { detected, width, height } = validation.data;
    const uploadBuffer = validation.data.buffer;
    const storagePath = buildDesignStoragePath(detected.extension);
    assertSafeStoragePath(storagePath);

    const admin = createSupabaseAdminClient();
    const { error: uploadError } = await admin.storage
      .from(DESIGN_BUCKET)
      .upload(storagePath, uploadBuffer, {
        contentType: detected.mime,
        upsert: false,
        cacheControl: "public, max-age=31536000, immutable",
      });

    if (uploadError) {
      return { status: "error", message: uploadError.message };
    }

    const { data: urlData } = admin.storage.from(DESIGN_BUCKET).getPublicUrl(storagePath);
    const displayName = displayNameRaw || safeDisplayName(file.name);

    const supabase = await createSupabaseServerClient();
    const { data: row, error: insertError } = await supabase
      .from("design_media")
      .insert({
        bucket_id: DESIGN_BUCKET,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
        display_name: displayName,
        description,
        alt_text: altText || null,
        mime_type: detected.mime,
        extension: detected.extension,
        media_kind: detected.mediaKind,
        width,
        height,
        size_bytes: uploadBuffer.length,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (insertError || !row) {
      await admin.storage.from(DESIGN_BUCKET).remove([storagePath]);
      return { status: "error", message: insertError?.message ?? "Enregistrement impossible." };
    }

    revalidatePath("/design");

    return {
      status: "success",
      media: toMediaUploadResult({
        mediaId: row.id,
        publicUrl: urlData.publicUrl,
        storagePath,
        detected,
        width,
        height,
        sizeBytes: uploadBuffer.length,
      }),
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Échec de l'upload.",
    };
  }
}

/** Suppression sécurisée — chemin validé, fichier Storage + métadonnées. */
export async function deleteDesignMedia(mediaId: string): Promise<void> {
  await assertDesignEditor();

  const supabase = await createSupabaseServerClient();
  const { data: media } = await supabase
    .from("design_media")
    .select("storage_path")
    .eq("id", mediaId)
    .maybeSingle();

  if (!media?.storage_path) {
    throw new Error("Média introuvable.");
  }

  assertSafeStoragePath(media.storage_path);

  const admin = createSupabaseAdminClient();
  await admin.storage.from(DESIGN_BUCKET).remove([media.storage_path]);
  await supabase.from("design_media").delete().eq("id", mediaId);

  revalidatePath("/design");
}
