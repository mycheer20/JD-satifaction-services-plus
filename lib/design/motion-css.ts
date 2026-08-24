import { DEFAULT_MOTION_SETTINGS } from "@/lib/design/motion-defaults";
import type { MotionIntensity, MotionSettings } from "@/types/design";

const INTENSITY_PRESETS: Record<
  MotionIntensity,
  {
    durationFast: string;
    duration: string;
    durationSlow: string;
    hoverTranslate: string;
    hoverScale: string;
    revealDistance: string;
  }
> = {
  subtle: {
    durationFast: "150ms",
    duration: "220ms",
    durationSlow: "380ms",
    hoverTranslate: "-0.125rem",
    hoverScale: "1.02",
    revealDistance: "0.625rem",
  },
  normal: {
    durationFast: "200ms",
    duration: "300ms",
    durationSlow: "500ms",
    hoverTranslate: "-0.25rem",
    hoverScale: "1.03",
    revealDistance: "1rem",
  },
  expressive: {
    durationFast: "240ms",
    duration: "420ms",
    durationSlow: "650ms",
    hoverTranslate: "-0.375rem",
    hoverScale: "1.05",
    revealDistance: "1.25rem",
  },
};

export function normalizeMotionSettings(
  partial: Partial<MotionSettings> | null | undefined,
): MotionSettings {
  return {
    ...DEFAULT_MOTION_SETTINGS,
    ...(partial ?? {}),
    intensity: partial?.intensity ?? DEFAULT_MOTION_SETTINGS.intensity,
  };
}

export function motionSettingsEqual(a: MotionSettings, b: MotionSettings): boolean {
  return (Object.keys(DEFAULT_MOTION_SETTINGS) as (keyof MotionSettings)[]).every(
    (key) => a[key] === b[key],
  );
}

export type MotionCssVariables = Record<string, string>;

export function motionSettingsToCssVariables(settings: MotionSettings): MotionCssVariables {
  const preset = INTENSITY_PRESETS[settings.intensity];
  const on = settings.enabled ? "1" : "0";

  return {
    "--motion-enabled": on,
    "--motion-duration-fast": preset.durationFast,
    "--motion-duration": preset.duration,
    "--motion-duration-slow": preset.durationSlow,
    "--motion-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "--motion-hover-translate": preset.hoverTranslate,
    "--motion-hover-scale": preset.hoverScale,
    "--motion-reveal-distance": preset.revealDistance,
    "--motion-card-hover": settings.enabled && settings.cardHover ? "1" : "0",
    "--motion-family-hover": settings.enabled && settings.familyHover ? "1" : "0",
    "--motion-gallery-hover": settings.enabled && settings.galleryHover ? "1" : "0",
    "--motion-hero-transitions": settings.enabled && settings.heroTransitions ? "1" : "0",
    "--motion-scroll-reveal": settings.enabled && settings.scrollReveal ? "1" : "0",
  };
}

export function buildMotionStylesheet(
  settings: MotionSettings,
  scope: ":root" | string = ":root",
): string {
  const normalized = normalizeMotionSettings(settings);
  const vars = motionSettingsToCssVariables(normalized);
  const declarations = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${scope} {\n${declarations}\n}`;
}

export function motionSettingsToDataAttributes(settings: MotionSettings): Record<string, string> {
  const normalized = normalizeMotionSettings(settings);
  return {
    "data-motion": normalized.enabled ? "on" : "off",
    "data-motion-intensity": normalized.intensity,
    "data-motion-scroll-reveal": normalized.enabled && normalized.scrollReveal ? "on" : "off",
  };
}
