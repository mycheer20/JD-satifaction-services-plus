/**
 * États initiaux des server actions Design.
 * Fichier séparé : les modules "use server" ne peuvent exporter que des async functions.
 */

export type SectionActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const sectionActionInitial: SectionActionState = { status: "idle" };

export type GalleryActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const galleryActionInitial: GalleryActionState = { status: "idle" };

export type MotionActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const motionActionInitial: MotionActionState = { status: "idle" };

export type ThemeTokensActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const themeTokensInitialState: ThemeTokensActionState = { status: "idle" };

export type PublicationActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export const publicationActionInitial: PublicationActionState = { status: "idle" };

export type DesignMediaUploadState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; media: import("@/types/design").MediaUploadResult };

export type DesignMediaMetadataState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };
