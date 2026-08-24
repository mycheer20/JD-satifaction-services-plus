import type { MotionSettings } from "@/types/design";

/** Animations codées par défaut — utilisées tant qu'aucune config publiée n'existe. */
export const DEFAULT_MOTION_SETTINGS: MotionSettings = {
  enabled: true,
  intensity: "normal",
  cardHover: true,
  heroTransitions: true,
  galleryHover: true,
  familyHover: true,
  scrollReveal: true,
};

export const MOTION_PLACEMENT = "site.motion" as const;
