"use client";

import { useActionState, useMemo, useState } from "react";
import {
  publishHeroSection,
  saveHeroDraft,
  sectionActionInitial,
} from "@/features/design/actions/sections";
import { DEFAULT_HERO_CONFIG } from "@/lib/design/defaults";
import { SLIDE_TRANSITIONS } from "@/lib/design/placements";
import type { DesignMediaRow } from "@/types/database";
import type { EditorSlideView, HeroSectionConfig, SectionEditorView } from "@/types/design";
import { MediaPicker } from "@/components/design/media-picker";
import { MediaThumbnail } from "@/components/design/media-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CheckboxField, FormField, Select, TextInput } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

type SlideDraft = {
  mediaId: string;
  altText: string;
  position: number;
  durationMs: number;
  transition: (typeof SLIDE_TRANSITIONS)[number];
  overlayOpacity: number;
  imagePosition: string;
  media: DesignMediaRow | null;
};

type HomeHeroEditorProps = {
  draft: SectionEditorView | null;
  published: SectionEditorView | null;
  hasPublishedOverride: boolean;
  mediaLibrary: DesignMediaRow[];
};

function toSlideDraft(slide: EditorSlideView): SlideDraft {
  return {
    mediaId: slide.mediaId,
    altText: slide.altText,
    position: slide.position,
    durationMs: slide.durationMs,
    transition: slide.transition,
    overlayOpacity: slide.overlayOpacity,
    imagePosition: slide.imagePosition,
    media: slide.media,
  };
}

function emptySlide(): SlideDraft {
  return {
    mediaId: "",
    altText: "",
    position: 0,
    durationMs: DEFAULT_HERO_CONFIG.defaultDurationMs ?? 6000,
    transition: DEFAULT_HERO_CONFIG.defaultTransition ?? "fade",
    overlayOpacity: DEFAULT_HERO_CONFIG.overlayOpacity ?? 0.45,
    imagePosition: DEFAULT_HERO_CONFIG.imagePosition ?? "center",
    media: null,
  };
}

function buildInitialState(draft: SectionEditorView | null) {
  const config = {
    ...DEFAULT_HERO_CONFIG,
    ...(draft?.config as HeroSectionConfig),
  } as HeroSectionConfig;

  const slides =
    draft?.slides.length && config.mode !== "gradient"
      ? draft.slides.map(toSlideDraft)
      : config.mode === "slider"
        ? [emptySlide(), { ...emptySlide(), position: 1 }]
        : config.mode === "image"
          ? [emptySlide()]
          : [];

  return { config, slides };
}

export function HomeHeroEditor({
  draft,
  published,
  hasPublishedOverride,
  mediaLibrary,
}: HomeHeroEditorProps) {
  const initial = useMemo(() => buildInitialState(draft), [draft]);
  const [config, setConfig] = useState<HeroSectionConfig>(initial.config);
  const [slides, setSlides] = useState<SlideDraft[]>(initial.slides);

  const [saveState, saveAction, savePending] = useActionState(
    saveHeroDraft,
    sectionActionInitial,
  );
  const [publishState, publishAction, publishPending] = useActionState(
    publishHeroSection,
    sectionActionInitial,
  );

  const isBusy = savePending || publishPending;
  const feedback = [saveState, publishState].find(
    (state) => state.status === "error" || state.status === "success",
  );

  const publishedMode = (published?.config as HeroSectionConfig | undefined)?.mode ?? "gradient";
  const publishedSlideCount = published?.slides.length ?? 0;

  function updateConfig(patch: Partial<HeroSectionConfig>) {
    setConfig((current) => {
      const next = { ...current, ...patch };
      if (patch.mode === "gradient") {
        setSlides([]);
      } else if (patch.mode === "image") {
        setSlides((currentSlides) =>
          currentSlides.length === 1 ? currentSlides : [{ ...emptySlide(), ...(currentSlides[0] ?? {}) }],
        );
      } else if (patch.mode === "slider") {
        setSlides((currentSlides) =>
          currentSlides.length >= 2
            ? currentSlides
            : [
                currentSlides[0] ?? emptySlide(),
                currentSlides[1] ?? { ...emptySlide(), position: 1 },
              ],
        );
      }
      return next;
    });
  }

  function updateSlide(index: number, patch: Partial<SlideDraft>) {
    setSlides((current) =>
      current.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch, position: slideIndex } : slide,
      ),
    );
  }

  function selectSlideMedia(index: number, media: DesignMediaRow | null) {
    if (!media) {
      updateSlide(index, { mediaId: "", media: null });
      return;
    }
    updateSlide(index, {
      mediaId: media.id,
      media,
      altText: slides[index]?.altText.trim() ? slides[index]!.altText : media.alt_text?.trim() ?? "",
    });
  }

  function addSlide() {
    setSlides((current) => [...current, { ...emptySlide(), position: current.length }]);
  }

  function removeSlide(index: number) {
    setSlides((current) =>
      current.filter((_, slideIndex) => slideIndex !== index).map((slide, slideIndex) => ({
        ...slide,
        position: slideIndex,
      })),
    );
  }

  function buildPayload() {
    return JSON.stringify({
      config,
      slides: slides
        .filter((slide) => slide.mediaId)
        .map((slide, index) => ({
          mediaId: slide.mediaId,
          altText: slide.altText,
          position: index,
          durationMs: slide.durationMs,
          transition: slide.transition,
          overlayOpacity: slide.overlayOpacity,
          imagePosition: slide.imagePosition,
        })),
    });
  }

  function hiddenPayloadInput() {
    return <input type="hidden" name="payload" value={buildPayload()} />;
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <div
          role="status"
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <Card padding="md" tone="muted">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[color:var(--color-foreground)]">
              État hero publié
            </p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              {hasPublishedOverride
                ? publishedMode === "gradient"
                  ? "Gradient codé publié — le hero par défaut du site est actif."
                  : `Mode ${publishedMode} publié${publishedSlideCount ? ` (${publishedSlideCount} visuel${publishedSlideCount > 1 ? "s" : ""})` : ""}.`
                : "Aucune publication hero : les visiteurs voient le gradient par défaut."}
            </p>
          </div>
          <Badge tone={hasPublishedOverride && publishedMode !== "gradient" ? "success" : "neutral"}>
            {hasPublishedOverride && publishedMode !== "gradient" ? "Personnalisé" : "Défaut actif"}
          </Badge>
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader
          title="Mode d'affichage"
          description="Gradient = design codé actuel. Image ou slider = visuels depuis la bibliothèque média."
          className="mb-6"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["gradient", "Gradient par défaut", "Aucune image — fallback robuste"],
              ["image", "Image fixe", "Une seule photo de fond"],
              ["slider", "Slider", "2 slides minimum à la publication"],
            ] as const
          ).map(([mode, label, hint]) => (
            <button
              key={mode}
              type="button"
              onClick={() => updateConfig({ mode })}
              className={`rounded-2xl border p-4 text-left transition ${
                config.mode === mode
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] ring-2 ring-[color:var(--ring-color)]"
                  : "border-[color:var(--color-border)] hover:border-[color:var(--accent)]/40"
              }`}
            >
              <p className="text-sm font-bold">{label}</p>
              <p className="mt-1 text-xs text-muted">{hint}</p>
            </button>
          ))}
        </div>
      </Card>

      {config.mode === "slider" ? (
        <Card padding="lg">
          <CardHeader title="Comportement slider" className="mb-6" />
          <div className="grid gap-5 sm:grid-cols-2">
            <CheckboxField
              label="Lecture automatique"
              description="Avance les slides après la durée définie"
              checked={config.autoplay !== false}
              onChange={(event) => updateConfig({ autoplay: event.target.checked })}
            />
            <CheckboxField
              label="Pause au survol"
              description="Stoppe l'autoplay quand la souris est sur le hero"
              checked={config.pauseOnHover !== false}
              onChange={(event) => updateConfig({ pauseOnHover: event.target.checked })}
            />
            <CheckboxField
              label="Boucle infinie"
              checked={config.loop !== false}
              onChange={(event) => updateConfig({ loop: event.target.checked })}
            />
            <FormField label="Durée par défaut (ms)" htmlFor="hero-default-duration">
              <TextInput
                id="hero-default-duration"
                type="number"
                min={2000}
                max={30000}
                step={500}
                value={config.defaultDurationMs ?? 6000}
                onChange={(event) =>
                  updateConfig({ defaultDurationMs: Number(event.target.value) || 6000 })
                }
              />
            </FormField>
            <FormField label="Transition par défaut" htmlFor="hero-default-transition">
              <Select
                id="hero-default-transition"
                value={config.defaultTransition ?? "fade"}
                onChange={(event) =>
                  updateConfig({
                    defaultTransition: event.target.value as HeroSectionConfig["defaultTransition"],
                  })
                }
              >
                {SLIDE_TRANSITIONS.map((transition) => (
                  <option key={transition} value={transition}>
                    {transition}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </Card>
      ) : null}

      {config.mode !== "gradient" ? (
        <Card padding="lg">
          <CardHeader
            title={config.mode === "slider" ? "Slides du hero" : "Image du hero"}
            description="Sélectionnez un média et renseignez le texte alternatif avant publication."
            className="mb-6"
            action={
              config.mode === "slider" ? (
                <Button type="button" variant="secondary" size="sm" onClick={addSlide}>
                  Ajouter une slide
                </Button>
              ) : null
            }
          />

          <div className="space-y-8">
            {slides.map((slide, index) => (
              <div
                key={`slide-${index}`}
                className="rounded-2xl border border-[color:var(--color-border)] p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold">
                    {config.mode === "slider" ? `Slide ${index + 1}` : "Visuel principal"}
                  </p>
                  {config.mode === "slider" && slides.length > 2 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlide(index)}
                    >
                      Retirer
                    </Button>
                  ) : null}
                </div>

                {slide.media ? (
                  <div className="relative mb-4 aspect-[21/9] max-w-md overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
                    <MediaThumbnail media={slide.media} sizes="400px" />
                  </div>
                ) : null}

                <MediaPicker
                  items={mediaLibrary}
                  value={slide.mediaId || null}
                  onSelect={(media) => selectSlideMedia(index, media)}
                  className="mb-5"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Texte alternatif" htmlFor={`slide-alt-${index}`} required>
                    <TextInput
                      id={`slide-alt-${index}`}
                      value={slide.altText}
                      onChange={(event) => updateSlide(index, { altText: event.target.value })}
                      placeholder="Description accessible de l'image"
                    />
                  </FormField>
                  <FormField label="Position image" htmlFor={`slide-position-${index}`}>
                    <Select
                      id={`slide-position-${index}`}
                      value={slide.imagePosition}
                      onChange={(event) => updateSlide(index, { imagePosition: event.target.value })}
                    >
                      <option value="center">Centre</option>
                      <option value="top">Haut</option>
                      <option value="bottom">Bas</option>
                      <option value="left">Gauche</option>
                      <option value="right">Droite</option>
                    </Select>
                  </FormField>
                  <FormField label="Opacité overlay" htmlFor={`slide-overlay-${index}`}>
                    <TextInput
                      id={`slide-overlay-${index}`}
                      type="number"
                      min={0}
                      max={0.85}
                      step={0.05}
                      value={slide.overlayOpacity}
                      onChange={(event) =>
                        updateSlide(index, { overlayOpacity: Number(event.target.value) || 0 })
                      }
                    />
                  </FormField>
                  {config.mode === "slider" ? (
                    <>
                      <FormField label="Durée (ms)" htmlFor={`slide-duration-${index}`}>
                        <TextInput
                          id={`slide-duration-${index}`}
                          type="number"
                          min={2000}
                          max={30000}
                          step={500}
                          value={slide.durationMs}
                          onChange={(event) =>
                            updateSlide(index, { durationMs: Number(event.target.value) || 6000 })
                          }
                        />
                      </FormField>
                      <FormField label="Transition" htmlFor={`slide-transition-${index}`}>
                        <Select
                          id={`slide-transition-${index}`}
                          value={slide.transition}
                          onChange={(event) =>
                            updateSlide(index, {
                              transition: event.target.value as SlideDraft["transition"],
                            })
                          }
                        >
                          {SLIDE_TRANSITIONS.map((transition) => (
                            <option key={transition} value={transition}>
                              {transition}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card padding="md" tone="elevated">
        <CardHeader
          title="Actions hero"
          description="Brouillon visible uniquement ici. Publication = mise à jour immédiate de la page d'accueil."
          className="mb-4"
        />
        <div className="flex flex-wrap gap-3">
          <form action={saveAction}>
            {hiddenPayloadInput()}
            <Button type="submit" variant="secondary" disabled={isBusy}>
              {savePending ? "Enregistrement…" : "Enregistrer brouillon"}
            </Button>
          </form>
          <form action={publishAction}>
            {hiddenPayloadInput()}
            <Button type="submit" variant="primary" disabled={isBusy}>
              {publishPending ? "Publication…" : "Publier le hero"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
