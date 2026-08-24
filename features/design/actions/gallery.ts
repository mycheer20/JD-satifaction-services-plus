"use server";

import { revalidatePath } from "next/cache";
import { assertDesignEditor } from "@/features/design/guards";
import {
  parseGalleryItemPayload,
  parseGalleryItemUpdatePayload,
  validateGalleryItemForPublish,
} from "@/lib/design/gallery-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { galleryActionInitial, type GalleryActionState } from "@/features/design/actions/states";

const GALLERY_PATHS = ["/galerie", "/a-propos", "/design/galerie"] as const;

function revalidateGalleryPaths() {
  for (const path of GALLERY_PATHS) {
    revalidatePath(path);
  }
}

async function nextGalleryPosition(status: "draft" | "published") {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("design_gallery_items")
    .select("position")
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.position ?? -1) + 1;
}

async function getMediaAltText(mediaId: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("design_media").select("alt_text").eq("id", mediaId).maybeSingle();
  return data?.alt_text ?? null;
}

export async function addGalleryItemDraft(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    const user = await assertDesignEditor();
    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { status: "error", message: "Données invalides." };
    }

    const parsed = parseGalleryItemPayload(JSON.parse(raw));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const payload = parsed.data;
    const position = payload.position ?? (await nextGalleryPosition("draft"));

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("design_gallery_items").insert({
      media_id: payload.mediaId,
      category: payload.category,
      title: payload.title?.trim() || null,
      description: payload.description?.trim() || null,
      position,
      status: "draft",
      is_active: true,
      created_by: user.id,
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateGalleryPaths();
    return { status: "success", message: "Photo ajoutée en brouillon à la galerie." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Ajout impossible.",
    };
  }
}

export async function updateGalleryItemDraft(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const raw = formData.get("payload");
    if (typeof raw !== "string") {
      return { status: "error", message: "Données invalides." };
    }

    const parsed = parseGalleryItemUpdatePayload(JSON.parse(raw));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { status: "error", message: first?.message ?? "Données invalides." };
    }

    const payload = parsed.data;
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("design_gallery_items")
      .update({
        category: payload.category,
        title: payload.title?.trim() || null,
        description: payload.description?.trim() || null,
        ...(payload.position !== undefined ? { position: payload.position } : {}),
        ...(payload.mediaId ? { media_id: payload.mediaId } : {}),
      })
      .eq("id", payload.itemId);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateGalleryPaths();
    return { status: "success", message: "Élément de galerie mis à jour." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Mise à jour impossible.",
    };
  }
}

export async function publishGalleryItem(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const itemId = String(formData.get("itemId") ?? "");
    if (!itemId) return { status: "error", message: "Élément introuvable." };

    if (formData.get("payload")) {
      const saveResult = await updateGalleryItemDraft(galleryActionInitial, formData);
      if (saveResult.status === "error") return saveResult;
    }

    const supabase = await createSupabaseServerClient();
    const { data: item } = await supabase
      .from("design_gallery_items")
      .select("title, media_id")
      .eq("id", itemId)
      .maybeSingle();

    if (!item) return { status: "error", message: "Élément introuvable." };

    const mediaAlt = await getMediaAltText(item.media_id);
    const validationError = validateGalleryItemForPublish({
      mediaAltText: mediaAlt,
      title: item.title,
    });
    if (validationError) return { status: "error", message: validationError };

    const position = await nextGalleryPosition("published");
    const { error } = await supabase
      .from("design_gallery_items")
      .update({ status: "published", position, is_active: true })
      .eq("id", itemId);

    if (error) return { status: "error", message: error.message };

    revalidateGalleryPaths();
    return { status: "success", message: "Photo publiée dans la galerie publique." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication impossible.",
    };
  }
}

export async function unpublishGalleryItem(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const itemId = String(formData.get("itemId") ?? "");
    if (!itemId) return { status: "error", message: "Élément introuvable." };

    const position = await nextGalleryPosition("draft");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("design_gallery_items")
      .update({ status: "draft", position })
      .eq("id", itemId);

    if (error) return { status: "error", message: error.message };

    revalidateGalleryPaths();
    return { status: "success", message: "Photo retirée de la galerie publique." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Action impossible.",
    };
  }
}

export async function toggleGalleryItemActive(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const itemId = String(formData.get("itemId") ?? "");
    const isActive = formData.get("isActive") === "1";
    if (!itemId) return { status: "error", message: "Élément introuvable." };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("design_gallery_items")
      .update({ is_active: isActive })
      .eq("id", itemId);

    if (error) return { status: "error", message: error.message };

    revalidateGalleryPaths();
    return {
      status: "success",
      message: isActive ? "Photo réactivée." : "Photo désactivée.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Action impossible.",
    };
  }
}

export async function deleteGalleryItem(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const itemId = String(formData.get("itemId") ?? "");
    if (!itemId) return { status: "error", message: "Élément introuvable." };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("design_gallery_items").delete().eq("id", itemId);

    if (error) return { status: "error", message: error.message };

    revalidateGalleryPaths();
    return { status: "success", message: "Photo retirée de la galerie." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Suppression impossible.",
    };
  }
}

export async function moveGalleryItem(
  _previous: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const itemId = String(formData.get("itemId") ?? "");
    const direction = String(formData.get("direction") ?? "");
    if (!itemId || (direction !== "up" && direction !== "down")) {
      return { status: "error", message: "Action invalide." };
    }

    const supabase = await createSupabaseServerClient();
    const { data: current } = await supabase
      .from("design_gallery_items")
      .select("id, position, status")
      .eq("id", itemId)
      .maybeSingle();

    if (!current) return { status: "error", message: "Élément introuvable." };

    const neighborQuery =
      direction === "up"
        ? supabase
            .from("design_gallery_items")
            .select("id, position")
            .eq("status", current.status)
            .lt("position", current.position)
            .order("position", { ascending: false })
            .limit(1)
        : supabase
            .from("design_gallery_items")
            .select("id, position")
            .eq("status", current.status)
            .gt("position", current.position)
            .order("position", { ascending: true })
            .limit(1);

    const { data: neighbors } = await neighborQuery;

    const neighbor = neighbors?.[0];
    if (!neighbor) {
      return { status: "success", message: "Ordre inchangé." };
    }

    await supabase.from("design_gallery_items").update({ position: neighbor.position }).eq("id", current.id);
    await supabase.from("design_gallery_items").update({ position: current.position }).eq("id", neighbor.id);

    revalidateGalleryPaths();
    return { status: "success", message: "Ordre mis à jour." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Réorganisation impossible.",
    };
  }
}

export async function publishAllGalleryDrafts(
  _previous: GalleryActionState,
): Promise<GalleryActionState> {
  try {
    await assertDesignEditor();
    const supabase = await createSupabaseServerClient();
    const { data: drafts } = await supabase
      .from("design_gallery_items")
      .select("id, title, media_id")
      .eq("status", "draft")
      .eq("is_active", true)
      .order("position");

    const rows = drafts ?? [];
    if (rows.length === 0) {
      return { status: "success", message: "Aucun brouillon à publier." };
    }

    let published = 0;
    for (const row of rows) {
      const mediaAlt = await getMediaAltText(row.media_id);
      if (validateGalleryItemForPublish({ mediaAltText: mediaAlt, title: row.title })) {
        continue;
      }
      const position = await nextGalleryPosition("published");
      const { error } = await supabase
        .from("design_gallery_items")
        .update({ status: "published", position })
        .eq("id", row.id);
      if (!error) published += 1;
    }

    revalidateGalleryPaths();
    return {
      status: "success",
      message:
        published > 0
          ? `${published} photo${published > 1 ? "s" : ""} publiée${published > 1 ? "s" : ""}.`
          : "Aucune photo publiable : titre ou alt text manquant.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Publication impossible.",
    };
  }
}
