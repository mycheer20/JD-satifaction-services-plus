"use client";

import { useActionState, useMemo, useState } from "react";
import {
  clearAboutSectionDraft,
  publishAboutSection,
  saveAboutSectionDraft,
  sectionActionInitial,
} from "@/features/design/actions/sections";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/design/about-defaults";
import type { AboutSectionDef } from "@/lib/design/about-sections";
import type { DesignMediaRow } from "@/types/database";
import type {
  AboutHighlightItem,
  AboutSectionConfig,
  SectionEditorView,
} from "@/types/design";
import { MediaPicker } from "@/components/design/media-picker";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FormField, Select, TextArea, TextInput } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

type AboutEditorEntry = {
  section: AboutSectionDef;
  draft: SectionEditorView | null;
  published: SectionEditorView | null;
  hasPublishedOverride: boolean;
};

type AboutSectionState = {
  mediaId: string | null;
  altText: string;
  title: string;
  subtitle: string;
  body: string;
  items: AboutHighlightItem[];
  overlayOpacity: number;
  imagePosition: string;
  media: DesignMediaRow | null;
};

function buildState(entry: AboutEditorEntry): AboutSectionState {
  const defaults = DEFAULT_ABOUT_CONTENT[entry.section.id];
  const draftConfig = (entry.draft?.config ?? {}) as AboutSectionConfig;
  const slide = entry.draft?.slides[0];

  return {
    mediaId: slide?.mediaId ?? null,
    altText: slide?.altText ?? "",
    title: draftConfig.title?.trim() || defaults.title,
    subtitle: draftConfig.subtitle?.trim() || defaults.subtitle || "",
    body: draftConfig.body?.trim() || defaults.body || "",
    items: draftConfig.items?.length ? draftConfig.items : defaults.items ?? [],
    overlayOpacity: slide?.overlayOpacity ?? draftConfig.overlayOpacity ?? 0.45,
    imagePosition: slide?.imagePosition ?? draftConfig.imagePosition ?? "center",
    media: slide?.media ?? null,
  };
}

function AboutSectionCard({
  entry,
  mediaLibrary,
}: {
  entry: AboutEditorEntry;
  mediaLibrary: DesignMediaRow[];
}) {
  const [state, setState] = useState<AboutSectionState>(() => buildState(entry));
  const [saveState, saveAction, savePending] = useActionState(
    saveAboutSectionDraft,
    sectionActionInitial,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishAboutSection,
    sectionActionInitial,
  );
  const [clearState, clearAction, clearPending] = useActionState(
    clearAboutSectionDraft,
    sectionActionInitial,
  );

  const isBusy = savePending || publishPending || clearPending;
  const feedback = [saveState, publishState, clearState].find(
    (item) => item.status === "error" || item.status === "success",
  );

  function buildPayload() {
    return JSON.stringify({
      mediaId: state.mediaId,
      altText: state.altText,
      title: state.title,
      subtitle: state.subtitle || undefined,
      body: state.body || undefined,
      items: entry.section.supportsItems ? state.items : undefined,
      overlayOpacity: state.overlayOpacity,
      imagePosition: state.imagePosition,
    });
  }

  function updateItem(index: number, patch: Partial<AboutHighlightItem>) {
    setState((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  return (
    <Card padding="lg" id={entry.section.id}>
      <CardHeader
        title={entry.section.label}
        description={entry.section.description}
        action={
          <Badge tone={entry.hasPublishedOverride ? "success" : "neutral"}>
            {entry.hasPublishedOverride ? "Publié" : "Défaut actif"}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Titre" htmlFor={`about-title-${entry.section.id}`}>
          <TextInput
            id={`about-title-${entry.section.id}`}
            value={state.title}
            onChange={(event) => setState((current) => ({ ...current, title: event.target.value }))}
          />
        </FormField>
        {(entry.section.id === "hero" || entry.section.id === "cta") && (
          <FormField label="Sous-titre" htmlFor={`about-subtitle-${entry.section.id}`}>
            <TextInput
              id={`about-subtitle-${entry.section.id}`}
              value={state.subtitle}
              onChange={(event) =>
                setState((current) => ({ ...current, subtitle: event.target.value }))
              }
            />
          </FormField>
        )}
      </div>

      {entry.section.multilineBody ? (
        <FormField label="Contenu" htmlFor={`about-body-${entry.section.id}`} className="mt-4">
          <TextArea
            id={`about-body-${entry.section.id}`}
            value={state.body}
            onChange={(event) => setState((current) => ({ ...current, body: event.target.value }))}
            rows={6}
          />
        </FormField>
      ) : entry.section.id === "hero" || entry.section.id === "cta" ? (
        <FormField label="Texte d'intro" htmlFor={`about-body-${entry.section.id}`} className="mt-4">
          <TextArea
            id={`about-body-${entry.section.id}`}
            value={state.body}
            onChange={(event) => setState((current) => ({ ...current, body: event.target.value }))}
            rows={3}
          />
        </FormField>
      ) : null}

      {entry.section.supportsItems ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-bold text-[color:var(--color-foreground)]">Cartes</p>
          {state.items.map((item, index) => (
            <div
              key={`${entry.section.id}-item-${index}`}
              className="rounded-xl border border-[color:var(--color-border)] p-4"
            >
              <div className="grid gap-3 sm:grid-cols-[4rem_1fr]">
                <FormField label="Icône" htmlFor={`about-icon-${entry.section.id}-${index}`}>
                  <TextInput
                    id={`about-icon-${entry.section.id}-${index}`}
                    value={item.icon ?? ""}
                    onChange={(event) => updateItem(index, { icon: event.target.value })}
                    maxLength={8}
                  />
                </FormField>
                <FormField label="Titre" htmlFor={`about-item-title-${entry.section.id}-${index}`}>
                  <TextInput
                    id={`about-item-title-${entry.section.id}-${index}`}
                    value={item.title}
                    onChange={(event) => updateItem(index, { title: event.target.value })}
                  />
                </FormField>
              </div>
              <FormField
                label="Description"
                htmlFor={`about-item-desc-${entry.section.id}-${index}`}
                className="mt-3"
              >
                <TextArea
                  id={`about-item-desc-${entry.section.id}-${index}`}
                  value={item.description}
                  onChange={(event) => updateItem(index, { description: event.target.value })}
                  rows={3}
                />
              </FormField>
            </div>
          ))}
        </div>
      ) : null}

      {entry.section.supportsImage ? (
        <div className="mt-6 space-y-4">
          {state.media ? (
            <div className="relative aspect-[21/9] max-w-lg overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
              <MediaThumbnail media={state.media} sizes="480px" />
            </div>
          ) : null}
          <MediaPicker
            items={mediaLibrary}
            value={state.mediaId}
            onSelect={(media) => {
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
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Texte alternatif" htmlFor={`about-alt-${entry.section.id}`}>
              <TextInput
                id={`about-alt-${entry.section.id}`}
                value={state.altText}
                onChange={(event) =>
                  setState((current) => ({ ...current, altText: event.target.value }))
                }
              />
            </FormField>
            <FormField label="Opacité overlay" htmlFor={`about-overlay-${entry.section.id}`}>
              <TextInput
                id={`about-overlay-${entry.section.id}`}
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
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <form action={saveAction}>
          <input type="hidden" name="placement" value={entry.section.placement} />
          <input type="hidden" name="payload" value={buildPayload()} />
          <Button type="submit" variant="secondary" size="sm" disabled={isBusy}>
            {savePending ? "…" : "Brouillon"}
          </Button>
        </form>
        <form action={publishAction}>
          <input type="hidden" name="placement" value={entry.section.placement} />
          <input type="hidden" name="payload" value={buildPayload()} />
          <Button type="submit" variant="primary" size="sm" disabled={isBusy}>
            {publishPending ? "…" : "Publier"}
          </Button>
        </form>
        <form action={clearAction}>
          <input type="hidden" name="placement" value={entry.section.placement} />
          <Button type="submit" variant="outline" size="sm" disabled={isBusy}>
            Réinitialiser
          </Button>
        </form>
      </div>
    </Card>
  );
}

export function AboutSectionsEditor({
  entries,
  mediaLibrary,
}: {
  entries: AboutEditorEntry[];
  mediaLibrary: DesignMediaRow[];
}) {
  const sorted = useMemo(() => entries, [entries]);

  return (
    <div className="space-y-6">
      {sorted.map((entry) => (
        <AboutSectionCard key={entry.section.id} entry={entry} mediaLibrary={mediaLibrary} />
      ))}
    </div>
  );
}
