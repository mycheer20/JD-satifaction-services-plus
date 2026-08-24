"use client";

import { useActionState, useMemo, useState } from "react";
import {
  clearFamilyCoverDraft,
  publishFamilyCover,
  saveFamilyCoverDraft,
} from "@/features/design/actions/sections";
import { sectionActionInitial } from "@/features/design/actions/states";
import { DEFAULT_PLACEMENT_IMAGE } from "@/lib/design/defaults";
import type { DesignPlacement } from "@/lib/design/placements";
import { getFamilyVisual, isFamilySlug } from "@/lib/theme/families";
import type { DesignMediaRow } from "@/types/database";
import type { PlacementImageConfig, SectionEditorView } from "@/types/design";
import { MediaPicker } from "@/components/design/media-picker";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CheckboxField, FormField, Select, TextInput } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

type FamilyEntry = {
  placement: DesignPlacement;
  draft: SectionEditorView | null;
  published: SectionEditorView | null;
  hasPublishedImage: boolean;
};

type FamilyCoverState = {
  mediaId: string | null;
  altText: string;
  overlayOpacity: number;
  imagePosition: string;
  hoverScale: number;
  enableHover: boolean;
  media: DesignMediaRow | null;
};

type FamilyCoversEditorProps = {
  entries: FamilyEntry[];
  mediaLibrary: DesignMediaRow[];
};

function buildFamilyState(entry: FamilyEntry): FamilyCoverState {
  const slide = entry.draft?.slides[0];
  const config = {
    ...DEFAULT_PLACEMENT_IMAGE,
    ...(entry.draft?.config as PlacementImageConfig),
  } as PlacementImageConfig;

  return {
    mediaId: slide?.mediaId ?? null,
    altText: slide?.altText ?? "",
    overlayOpacity: slide?.overlayOpacity ?? config.overlayOpacity ?? 0.4,
    imagePosition: slide?.imagePosition ?? config.imagePosition ?? "center",
    hoverScale: config.hoverScale ?? 1.03,
    enableHover: config.enableHover !== false,
    media: slide?.media ?? null,
  };
}

function FamilyCoverCard({
  entry,
  mediaLibrary,
}: {
  entry: FamilyEntry;
  mediaLibrary: DesignMediaRow[];
}) {
  const [state, setState] = useState<FamilyCoverState>(() => buildFamilyState(entry));
  const [saveState, saveAction, savePending] = useActionState(
    saveFamilyCoverDraft,
    sectionActionInitial,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishFamilyCover,
    sectionActionInitial,
  );
  const [clearState, clearAction, clearPending] = useActionState(
    clearFamilyCoverDraft,
    sectionActionInitial,
  );

  const isBusy = savePending || publishPending || clearPending;
  const feedback = [saveState, publishState, clearState].find(
    (item) => item.status === "error" || item.status === "success",
  );

  const slug = entry.placement.familySlug;
  const visual = slug && isFamilySlug(slug) ? getFamilyVisual(slug) : null;

  function buildPayload() {
    return JSON.stringify({
      mediaId: state.mediaId,
      altText: state.altText,
      overlayOpacity: state.overlayOpacity,
      imagePosition: state.imagePosition,
      hoverScale: state.hoverScale,
      enableHover: state.enableHover,
    });
  }

  function selectMedia(media: DesignMediaRow | null) {
    if (!media) {
      setState((current) => ({ ...current, mediaId: null, media: null }));
      return;
    }
    setState((current) => ({
      ...current,
      mediaId: media.id,
      media,
      altText: current.altText.trim() ? current.altText : media.alt_text?.trim() ?? "",
    }));
  }

  return (
    <Card padding="lg">
      <CardHeader
        title={`${visual?.icon ? `${visual.icon} ` : ""}${entry.placement.label.replace("Accueil — ", "")}`}
        description={entry.placement.description}
        action={
          <Badge tone={entry.hasPublishedImage ? "success" : "neutral"}>
            {entry.hasPublishedImage ? "Image publiée" : "Gradient défaut"}
          </Badge>
        }
        className="mb-5"
      />

      {feedback ? (
        <div
          role="status"
          className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
            feedback.status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {state.media ? (
        <div className="relative mb-4 aspect-[4/1] max-w-lg overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
          <MediaThumbnail media={state.media} sizes="480px" />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: state.overlayOpacity }}
            aria-hidden
          />
        </div>
      ) : (
        <div
          className={`mb-4 flex h-24 max-w-lg items-end rounded-xl p-4 text-white ${visual?.gradient ?? "hero-brand"}`}
        >
          <p className="text-xs font-semibold opacity-90">Aperçu gradient par défaut</p>
        </div>
      )}

      <MediaPicker
        items={mediaLibrary}
        value={state.mediaId}
        onSelect={selectMedia}
        className="mb-5"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Texte alternatif" htmlFor={`family-alt-${entry.placement.id}`}>
          <TextInput
            id={`family-alt-${entry.placement.id}`}
            value={state.altText}
            onChange={(event) => setState((current) => ({ ...current, altText: event.target.value }))}
            placeholder="Requis à la publication si une image est choisie"
          />
        </FormField>
        <FormField label="Position image" htmlFor={`family-position-${entry.placement.id}`}>
          <Select
            id={`family-position-${entry.placement.id}`}
            value={state.imagePosition}
            onChange={(event) =>
              setState((current) => ({ ...current, imagePosition: event.target.value }))
            }
          >
            <option value="center">Centre</option>
            <option value="top">Haut</option>
            <option value="bottom">Bas</option>
          </Select>
        </FormField>
        <FormField label="Opacité overlay" htmlFor={`family-overlay-${entry.placement.id}`}>
          <TextInput
            id={`family-overlay-${entry.placement.id}`}
            type="number"
            min={0}
            max={0.85}
            step={0.05}
            value={state.overlayOpacity}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                overlayOpacity: Number(event.target.value) || 0,
              }))
            }
          />
        </FormField>
        <FormField label="Zoom au survol" htmlFor={`family-hover-${entry.placement.id}`}>
          <TextInput
            id={`family-hover-${entry.placement.id}`}
            type="number"
            min={1}
            max={1.15}
            step={0.01}
            value={state.hoverScale}
            disabled={!state.enableHover}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                hoverScale: Number(event.target.value) || 1.03,
              }))
            }
          />
        </FormField>
        <CheckboxField
          label="Activer l'effet hover"
          checked={state.enableHover}
          onChange={(event) =>
            setState((current) => ({ ...current, enableHover: event.target.checked }))
          }
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <form action={saveAction}>
          <input type="hidden" name="placement" value={entry.placement.id} />
          <input type="hidden" name="payload" value={buildPayload()} />
          <Button type="submit" variant="secondary" size="sm" disabled={isBusy}>
            {savePending ? "…" : "Brouillon"}
          </Button>
        </form>
        <form action={publishAction}>
          <input type="hidden" name="placement" value={entry.placement.id} />
          <input type="hidden" name="payload" value={buildPayload()} />
          <Button type="submit" variant="primary" size="sm" disabled={isBusy}>
            {publishPending ? "…" : "Publier"}
          </Button>
        </form>
        <form action={clearAction}>
          <input type="hidden" name="placement" value={entry.placement.id} />
          <Button type="submit" variant="outline" size="sm" disabled={isBusy}>
            Réinitialiser
          </Button>
        </form>
      </div>
    </Card>
  );
}

export function FamilyCoversEditor({ entries, mediaLibrary }: FamilyCoversEditorProps) {
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.placement.label.localeCompare(b.placement.label, "fr")),
    [entries],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {sortedEntries.map((entry) => (
        <FamilyCoverCard key={entry.placement.id} entry={entry} mediaLibrary={mediaLibrary} />
      ))}
    </div>
  );
}
