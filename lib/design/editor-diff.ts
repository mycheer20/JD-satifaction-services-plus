import type { SectionEditorView } from "@/types/design";

/** Compare brouillon vs publié pour détecter des changements en attente. */
export function sectionViewDiffers(
  draft: SectionEditorView | null,
  published: SectionEditorView | null,
): boolean {
  if (!draft) return false;
  if (!published) return Boolean(draft.slides.length || Object.keys(draft.config).length);

  return (
    JSON.stringify(draft.config) !== JSON.stringify(published.config) ||
    JSON.stringify(
      draft.slides.map((slide) => ({
        mediaId: slide.mediaId,
        position: slide.position,
        altText: slide.altText,
      })),
    ) !==
      JSON.stringify(
        published.slides.map((slide) => ({
          mediaId: slide.mediaId,
          position: slide.position,
          altText: slide.altText,
        })),
      )
  );
}
