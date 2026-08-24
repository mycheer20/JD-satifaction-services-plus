"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
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
import type {
  DesignMediaMetadataState,
  DesignMediaUploadState,
} from "@/features/design/actions/states";
import type { MediaUploadResult } from "@/types/design";

const DESIGN_PATHS = ["/design", "/design/mediatheque"] as const;

function revalidateDesignMediaPaths() {
  for (const path of DESIGN_PATHS) {
    revalidatePath(path);
  }
}

const metadataSchema = z.object({
  media_id: z.string().uuid(),
  display_name: z.string().trim().min(1, "Le nom d'affichage est requis.").max(160),
  alt_text: z.string().trim().max(500).optional(),
  description: z.string().trim().max(1000).optional(),
});

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

    revalidateDesignMediaPaths();

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

export async function updateDesignMediaMetadata(
  _previous: DesignMediaMetadataState,
  formData: FormData,
): Promise<DesignMediaMetadataState> {
  try {
    await assertDesignEditor();

    const parsed = metadataSchema.safeParse({
      media_id: formData.get("media_id"),
      display_name: formData.get("display_name"),
      alt_text: String(formData.get("alt_text") ?? "").trim() || undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("design_media")
      .update({
        display_name: parsed.data.display_name,
        alt_text: parsed.data.alt_text ?? null,
        description: parsed.data.description ?? null,
      })
      .eq("id", parsed.data.media_id);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateDesignMediaPaths();
    return { status: "success", message: "Métadonnées enregistrées." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Mise à jour impossible.",
    };
  }
}

export async function setDesignMediaActive(
  mediaId: string,
  isActive: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await assertDesignEditor();

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("design_media")
      .update({ is_active: isActive })
      .eq("id", mediaId);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidateDesignMediaPaths();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}

/** Suppression sécurisée — chemin validé, fichier Storage + métadonnées. */
export async function deleteDesignMedia(
  mediaId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await assertDesignEditor();

    const supabase = await createSupabaseServerClient();
    const { data: media } = await supabase
      .from("design_media")
      .select("storage_path")
      .eq("id", mediaId)
      .maybeSingle();

    if (!media?.storage_path) {
      return { ok: false, message: "Média introuvable." };
    }

    assertSafeStoragePath(media.storage_path);

    const admin = createSupabaseAdminClient();
    const { error: deleteRowError } = await supabase
      .from("design_media")
      .delete()
      .eq("id", mediaId);

    if (deleteRowError) {
      if (deleteRowError.code === "23503") {
        return {
          ok: false,
          message:
            "Ce média est utilisé par une section ou la galerie. Désactivez-le ou retirez-le des contenus avant suppression.",
        };
      }
      return { ok: false, message: deleteRowError.message };
    }

    await admin.storage.from(DESIGN_BUCKET).remove([media.storage_path]);
    revalidateDesignMediaPaths();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Suppression impossible.",
    };
  }
}
