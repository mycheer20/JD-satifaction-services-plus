"use client";

import { useActionState, useMemo, useState } from "react";
import {
  addGalleryItemDraft,
  deleteGalleryItem,
  galleryActionInitial,
  moveGalleryItem,
  publishAllGalleryDrafts,
  publishGalleryItem,
  toggleGalleryItemActive,
  unpublishGalleryItem,
  updateGalleryItemDraft,
} from "@/features/design/actions/gallery";
import type { GalleryEditorItem } from "@/features/design/queries";
import { DESIGN_GALLERY_CATEGORIES } from "@/lib/design/placements";
import { galleryCategoryLabel } from "@/lib/design/gallery-utils";
import type { DesignMediaRow } from "@/types/database";
import type { DesignGalleryCategoryId } from "@/lib/design/placements";
import { MediaPicker } from "@/components/design/media-picker";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FormField, Select, TextArea, TextInput } from "@/components/ui/field";

type GalleryManagerProps = {
  items: GalleryEditorItem[];
  mediaLibrary: DesignMediaRow[];
};

function GalleryItemEditor({
  item,
  mediaLibrary,
}: {
  item: GalleryEditorItem;
  mediaLibrary: DesignMediaRow[];
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.description ?? "");
  const [category, setCategory] = useState<DesignGalleryCategoryId>(item.category);
  const [mediaId, setMediaId] = useState<string | null>(item.mediaId);
  const [media, setMedia] = useState<DesignMediaRow | null>(item.media);

  const [saveState, saveAction, savePending] = useActionState(
    updateGalleryItemDraft,
    galleryActionInitial,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishGalleryItem,
    galleryActionInitial,
  );
  const [unpublishState, unpublishAction, unpublishPending] = useActionState(
    unpublishGalleryItem,
    galleryActionInitial,
  );
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleGalleryItemActive,
    galleryActionInitial,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteGalleryItem,
    galleryActionInitial,
  );
  const [moveUpState, moveUpAction, moveUpPending] = useActionState(
    moveGalleryItem,
    galleryActionInitial,
  );
  const [moveDownState, moveDownAction, moveDownPending] = useActionState(
    moveGalleryItem,
    galleryActionInitial,
  );

  const isBusy =
    savePending ||
    publishPending ||
    unpublishPending ||
    togglePending ||
    deletePending ||
    moveUpPending ||
    moveDownPending;

  const feedback = [saveState, publishState, unpublishState, toggleState, deleteState, moveUpState, moveDownState].find(
    (state) => state.status === "error" || state.status === "success",
  );

  function buildPayload() {
    return JSON.stringify({
      itemId: item.id,
      category,
      title,
      description,
      mediaId: mediaId ?? undefined,
    });
  }

  return (
    <Card padding="md" tone={item.status === "published" ? "elevated" : "muted"}>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
          {media ? <MediaThumbnail media={media} sizes="240px" /> : null}
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={item.status === "published" ? "success" : "neutral"}>
              {item.status === "published" ? "Publié" : "Brouillon"}
            </Badge>
            <Badge tone="neutral">{galleryCategoryLabel(category)}</Badge>
            {!item.isActive ? <Badge tone="warning">Désactivé</Badge> : null}
            <span className="text-xs text-muted">Position {item.position + 1}</span>
          </div>

          {feedback ? (
            <div
              role="status"
              className={`rounded-xl border px-3 py-2 text-sm ${
                feedback.status === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Titre public" htmlFor={`gallery-title-${item.id}`}>
              <TextInput
                id={`gallery-title-${item.id}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Requis à la publication si le média n'a pas d'alt text"
              />
            </FormField>
            <FormField label="Catégorie" htmlFor={`gallery-category-${item.id}`}>
              <Select
                id={`gallery-category-${item.id}`}
                value={category}
                onChange={(event) => setCategory(event.target.value as DesignGalleryCategoryId)}
              >
                {DESIGN_GALLERY_CATEGORIES.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Description" htmlFor={`gallery-description-${item.id}`}>
            <TextArea
              id={`gallery-description-${item.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </FormField>

          <MediaPicker
            items={mediaLibrary}
            value={mediaId}
            onSelect={(selected) => {
              if (!selected) {
                setMediaId(null);
                setMedia(null);
                return;
              }
              setMediaId(selected.id);
              setMedia(selected);
              if (!title.trim()) setTitle(selected.alt_text?.trim() ?? selected.display_name);
            }}
          />

          <div className="flex flex-wrap gap-2">
            <form action={saveAction}>
              <input type="hidden" name="payload" value={buildPayload()} />
              <Button type="submit" variant="secondary" size="sm" disabled={isBusy}>
                Enregistrer
              </Button>
            </form>
            {item.status === "draft" ? (
              <form action={publishAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="payload" value={buildPayload()} />
                <Button type="submit" variant="primary" size="sm" disabled={isBusy}>
                  Publier
                </Button>
              </form>
            ) : (
              <form action={unpublishAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <Button type="submit" variant="outline" size="sm" disabled={isBusy}>
                  Dépublier
                </Button>
              </form>
            )}
            <form action={toggleAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="isActive" value={item.isActive ? "0" : "1"} />
              <Button type="submit" variant="ghost" size="sm" disabled={isBusy}>
                {item.isActive ? "Désactiver" : "Réactiver"}
              </Button>
            </form>
            <form action={moveUpAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="direction" value="up" />
              <Button type="submit" variant="ghost" size="sm" disabled={isBusy}>
                ↑
              </Button>
            </form>
            <form action={moveDownAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="direction" value="down" />
              <Button type="submit" variant="ghost" size="sm" disabled={isBusy}>
                ↓
              </Button>
            </form>
            <form action={deleteAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <Button type="submit" variant="danger" size="sm" disabled={isBusy}>
                Supprimer
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GalleryManager({ items, mediaLibrary }: GalleryManagerProps) {
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [category, setCategory] = useState<DesignGalleryCategoryId>("entreprise");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [addState, addAction, addPending] = useActionState(addGalleryItemDraft, galleryActionInitial);
  const [bulkState, bulkAction, bulkPending] = useActionState(
    publishAllGalleryDrafts,
    galleryActionInitial,
  );

  const draftCount = useMemo(() => items.filter((item) => item.status === "draft").length, [items]);
  const publishedCount = useMemo(
    () => items.filter((item) => item.status === "published" && item.isActive).length,
    [items],
  );

  const addFeedback = [addState, bulkState].find(
    (state) => state.status === "error" || state.status === "success",
  );

  const selectedMedia = mediaLibrary.find((media) => media.id === selectedMediaId) ?? null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card padding="md" tone="muted">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Brouillons</p>
          <p className="mt-2 text-2xl font-black">{draftCount}</p>
        </Card>
        <Card padding="md" tone="muted">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Publiées actives</p>
          <p className="mt-2 text-2xl font-black">{publishedCount}</p>
        </Card>
      </div>

      <Card padding="lg">
        <CardHeader
          title="Ajouter une photo"
          description="Choisissez un média de la bibliothèque, renseignez la catégorie et enregistrez en brouillon."
          className="mb-5"
        />

        {addFeedback ? (
          <div
            role="status"
            className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
              addFeedback.status === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {addFeedback.message}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Catégorie" htmlFor="new-gallery-category">
            <Select
              id="new-gallery-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as DesignGalleryCategoryId)}
            >
              {DESIGN_GALLERY_CATEGORIES.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Titre" htmlFor="new-gallery-title">
            <TextInput
              id="new-gallery-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="new-gallery-description" className="mt-4">
          <TextArea
            id="new-gallery-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </FormField>

        <div className="mt-5">
          <MediaPicker
            items={mediaLibrary}
            value={selectedMediaId}
            onSelect={(media) => {
              setSelectedMediaId(media?.id ?? null);
              if (media && !title.trim()) {
                setTitle(media.alt_text?.trim() ?? media.display_name);
              }
            }}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <form action={addAction}>
            <input
              type="hidden"
              name="payload"
              value={JSON.stringify({
                mediaId: selectedMediaId,
                category,
                title,
                description,
              })}
            />
            <Button type="submit" variant="primary" disabled={addPending || !selectedMediaId}>
              {addPending ? "Ajout…" : "Ajouter en brouillon"}
            </Button>
          </form>
          <form action={bulkAction}>
            <Button type="submit" variant="secondary" disabled={bulkPending || draftCount === 0}>
              {bulkPending ? "Publication…" : "Publier tous les brouillons valides"}
            </Button>
          </form>
        </div>

        {selectedMedia ? (
          <p className="mt-3 text-xs text-muted">
            Média sélectionné : {selectedMedia.display_name}
            {!selectedMedia.alt_text?.trim() ? " — pensez à renseigner un titre ou un alt text média avant publication." : ""}
          </p>
        ) : null}
      </Card>

      <div className="space-y-4">
        <CardHeader
          title="Photos de la galerie"
          description="Réorganisez, publiez ou retirez les éléments. Seuls les éléments publiés et actifs sont visibles sur /galerie et /a-propos."
        />
        {items.length === 0 ? (
          <Card padding="md" tone="muted">
            <p className="text-sm text-muted">Aucune photo dans la galerie pour le moment.</p>
          </Card>
        ) : (
          items.map((item) => (
            <GalleryItemEditor key={item.id} item={item} mediaLibrary={mediaLibrary} />
          ))
        )}
      </div>
    </div>
  );
}
