/**
 * Types partagés du système Design du site.
 * Les Row Supabase sont dans types/database.ts.
 */

import type { DesignGalleryCategoryId, SlideTransition } from "@/lib/design/placements";
import type { DesignMediaRow } from "@/types/database";

export type DesignPublishStatus = "draft" | "published";

export type DesignThemeTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  borderRadius?: string;
  shadow?: "sm" | "md" | "lg" | "none";
};

export type HeroSectionConfig = {
  mode: "gradient" | "image" | "slider";
  autoplay?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  defaultDurationMs?: number;
  defaultTransition?: SlideTransition;
  overlayOpacity?: number;
  imagePosition?: string;
};

export type PlacementImageConfig = {
  overlayOpacity?: number;
  imagePosition?: string;
  hoverScale?: number;
  enableHover?: boolean;
};

export type AboutHighlightItem = {
  title: string;
  description: string;
  icon?: string;
};

export type AboutSectionConfig = PlacementImageConfig & {
  title?: string;
  subtitle?: string;
  body?: string;
  items?: AboutHighlightItem[];
};

export type AboutSectionContent = {
  title: string;
  subtitle?: string;
  body?: string;
  items?: AboutHighlightItem[];
};

export type ResolvedAboutSection = {
  id: string;
  placement: string;
  title: string;
  subtitle?: string;
  body?: string;
  items?: AboutHighlightItem[];
  imageUrl?: string;
  altText?: string;
  overlayOpacity: number;
  imagePosition: string;
  hasPublishedOverride: boolean;
};

export type ResolvedSlide = {
  id: string;
  publicUrl: string;
  altText: string;
  durationMs: number;
  transition: SlideTransition;
  overlayOpacity: number;
  imagePosition: string;
};

export type ResolvedPlacementMedia = {
  placement: string;
  mode: "gradient" | "image" | "slider";
  imageUrl?: string;
  altText?: string;
  overlayOpacity: number;
  imagePosition: string;
  slides?: ResolvedSlide[];
  config: HeroSectionConfig | PlacementImageConfig;
};

export type ResolvedGalleryItem = {
  id: string;
  publicUrl: string;
  altText: string;
  title: string | null;
  description: string | null;
  category: DesignGalleryCategoryId;
};

export type MediaUploadResult = {
  mediaId: string;
  publicUrl: string;
  storagePath: string;
  mimeType: string;
  extension: string;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  mediaKind: "image" | "svg" | "animated";
};

export type DesignMediaKindFilter = "all" | "image" | "svg" | "animated";

export type EditorSlideView = {
  id: string;
  mediaId: string;
  altText: string;
  position: number;
  durationMs: number;
  transition: SlideTransition;
  overlayOpacity: number;
  imagePosition: string;
  media: DesignMediaRow | null;
};

export type SectionEditorView = {
  placement: string;
  config: HeroSectionConfig | PlacementImageConfig | AboutSectionConfig;
  slides: EditorSlideView[];
  publishedAt: string | null;
};
