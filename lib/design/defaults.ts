/**
 * Design par défaut — utilisé quand aucune config publiée n'existe en DB.
 * Reprend les valeurs de app/globals.css sans images hardcodées.
 */

import type { DesignThemeTokens, HeroSectionConfig, PlacementImageConfig } from "@/types/design";

export const DEFAULT_THEME_TOKENS: DesignThemeTokens = {
  primary: "#2563eb",
  secondary: "#0f2744",
  accent: "#2563eb",
  background: "#fafbfd",
  surface: "#ffffff",
  surfaceMuted: "#f1f5f9",
  text: "#0a1628",
  textMuted: "#64748b",
  border: "#e2e8f0",
  success: "#16a34a",
  warning: "#ca8a04",
  danger: "#dc2626",
  borderRadius: "0.75rem",
  shadow: "md",
};

export const DEFAULT_HERO_CONFIG: HeroSectionConfig = {
  mode: "gradient",
  autoplay: false,
  pauseOnHover: true,
  loop: true,
  defaultDurationMs: 6000,
  defaultTransition: "fade",
  overlayOpacity: 0.45,
  imagePosition: "center",
};

export const DEFAULT_PLACEMENT_IMAGE: PlacementImageConfig = {
  overlayOpacity: 0.4,
  imagePosition: "center",
  hoverScale: 1.03,
  enableHover: true,
};

/** Config vide = le composant garde son rendu codé actuel (gradient hero, family-card, etc.). */
export function defaultSectionConfig(_placement: string): Record<string, unknown> {
  return {};
}
