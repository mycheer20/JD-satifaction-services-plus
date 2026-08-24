/**
 * Conversion des tokens Design → variables CSS du site.
 * Les valeurs par défaut restent dans globals.css ; cette couche ne s'applique
 * que lorsqu'une configuration publiée existe en base.
 */

import { DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import type { DesignThemeTokens } from "@/types/design";

type Rgb = { r: number; g: number; b: number };

const SHADOW_VALUES: Record<NonNullable<DesignThemeTokens["shadow"]>, string> = {
  none: "none",
  sm: "0 1px 2px rgb(10 22 40 / 0.05)",
  md: "0 4px 16px rgb(10 22 40 / 0.08)",
  lg: "0 12px 40px rgb(10 22 40 / 0.12)",
};

function expandHex(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return h;
}

function parseHex(hex: string): Rgb {
  const full = expandHex(hex);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(a: string, b: string, weight: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return toHex({
    r: ca.r * (1 - weight) + cb.r * weight,
    g: ca.g * (1 - weight) + cb.g * weight,
    b: ca.b * (1 - weight) + cb.b * weight,
  });
}

function darken(hex: string, amount: number): string {
  return mixHex(hex, "#000000", amount);
}

function lighten(hex: string, amount: number): string {
  return mixHex(hex, "#ffffff", amount);
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastForeground(hex: string): string {
  return relativeLuminance(hex) > 0.45 ? "#0a1628" : "#ffffff";
}

function rgbAlpha(hex: string, alpha: number): string {
  const { r, g, b } = parseHex(hex);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

export function normalizeThemeTokens(
  partial: Partial<DesignThemeTokens> | null | undefined,
): DesignThemeTokens {
  return {
    ...DEFAULT_THEME_TOKENS,
    ...(partial ?? {}),
    borderRadius: partial?.borderRadius ?? DEFAULT_THEME_TOKENS.borderRadius,
    shadow: partial?.shadow ?? DEFAULT_THEME_TOKENS.shadow,
  };
}

export function themeTokensEqual(a: DesignThemeTokens, b: DesignThemeTokens): boolean {
  return (Object.keys(DEFAULT_THEME_TOKENS) as (keyof DesignThemeTokens)[]).every(
    (key) => a[key] === b[key],
  );
}

export type ThemeCssVariables = Record<string, string>;

/** Mappe les tokens vers les variables CSS utilisées par globals.css et les composants. */
export function themeTokensToCssVariables(tokens: DesignThemeTokens): ThemeCssVariables {
  const primary = tokens.primary;
  const secondary = tokens.secondary;
  const accent = tokens.accent || primary;
  const shadowKey = tokens.shadow ?? "md";

  return {
    "--color-brand-600": primary,
    "--color-brand-700": darken(primary, 0.12),
    "--color-brand-800": secondary,
    "--color-brand-500": lighten(primary, 0.08),
    "--color-brand-400": lighten(primary, 0.22),
    "--color-brand-200": lighten(primary, 0.72),
    "--color-brand-100": lighten(primary, 0.82),
    "--color-brand-50": lighten(primary, 0.9),

    "--color-background": tokens.background,
    "--color-foreground": tokens.text,
    "--color-muted": tokens.textMuted,
    "--color-border": tokens.border,
    "--color-surface": tokens.surface,
    "--color-surface-muted": tokens.surfaceMuted,

    "--color-success": tokens.success,
    "--color-warning": tokens.warning,
    "--color-danger": tokens.danger,

    "--radius-md": tokens.borderRadius ?? "0.75rem",

    "--shadow-sm": SHADOW_VALUES.sm,
    "--shadow-md": SHADOW_VALUES[shadowKey === "none" ? "none" : shadowKey] ?? SHADOW_VALUES.md,
    "--shadow-lg": SHADOW_VALUES.lg,

    "--accent": accent,
    "--accent-hover": darken(accent, 0.12),
    "--accent-soft": lighten(accent, 0.85),
    "--accent-foreground": contrastForeground(accent),

    "--hero-from": secondary,
    "--hero-via": primary,
    "--hero-to": darken(secondary, 0.08),
    "--hero-foreground": contrastForeground(secondary),
    "--hero-muted":
      contrastForeground(secondary) === "#ffffff"
        ? "rgb(255 255 255 / 0.82)"
        : rgbAlpha(tokens.textMuted, 0.92),

    "--family-glow": rgbAlpha(accent, 0.35),
    "--ring-color": rgbAlpha(accent, 0.25),
  };
}

export function buildThemeStylesheet(
  tokens: DesignThemeTokens,
  scope: ":root" | string = ":root",
): string {
  const vars = themeTokensToCssVariables(normalizeThemeTokens(tokens));
  const declarations = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${scope} {\n${declarations}\n}`;
}
