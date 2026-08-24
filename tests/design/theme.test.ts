import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import {
  buildThemeStylesheet,
  normalizeThemeTokens,
  themeTokensEqual,
  themeTokensToCssVariables,
} from "@/lib/design/theme-css";
import { parseThemeTokensForm } from "@/lib/design/theme-validation";

describe("theme-css — fallback", () => {
  it("retourne les defaults si config absente ou partielle", () => {
    expect(normalizeThemeTokens(null)).toEqual(DEFAULT_THEME_TOKENS);
    expect(normalizeThemeTokens({ primary: "#111111" }).primary).toBe("#111111");
    expect(normalizeThemeTokens({ primary: "#111111" }).secondary).toBe(
      DEFAULT_THEME_TOKENS.secondary,
    );
  });

  it("conserve borderRadius et shadow par défaut si omis", () => {
    const tokens = normalizeThemeTokens({ primary: "#111111", secondary: "#222222" });
    expect(tokens.borderRadius).toBe(DEFAULT_THEME_TOKENS.borderRadius);
    expect(tokens.shadow).toBe(DEFAULT_THEME_TOKENS.shadow);
  });

  it("mappe les tokens vers des variables CSS", () => {
    const vars = themeTokensToCssVariables(DEFAULT_THEME_TOKENS);
    expect(vars["--color-brand-600"]).toBe(DEFAULT_THEME_TOKENS.primary);
    expect(vars["--color-background"]).toBe(DEFAULT_THEME_TOKENS.background);
  });

  it("génère une feuille CSS injectable", () => {
    const css = buildThemeStylesheet(DEFAULT_THEME_TOKENS);
    expect(css.startsWith(":root {")).toBe(true);
    expect(css).toContain("--accent:");
  });

  it("détecte les différences entre deux jeux de tokens", () => {
    expect(themeTokensEqual(DEFAULT_THEME_TOKENS, { ...DEFAULT_THEME_TOKENS })).toBe(true);
    expect(
      themeTokensEqual(DEFAULT_THEME_TOKENS, {
        ...DEFAULT_THEME_TOKENS,
        accent: "#ff0000",
      }),
    ).toBe(false);
  });
});

describe("theme-validation", () => {
  it("accepte un formulaire valide", () => {
    const form = new FormData();
    for (const [key, value] of Object.entries(DEFAULT_THEME_TOKENS)) {
      if (value !== undefined) form.set(key, String(value));
    }

    const parsed = parseThemeTokensForm(form);
    expect(parsed.success).toBe(true);
  });

  it("rejette une couleur invalide", () => {
    const form = new FormData();
    form.set("primary", "bleu");
    form.set("secondary", "#0f2744");
    form.set("accent", "#2563eb");
    form.set("background", "#fafbfd");
    form.set("surface", "#ffffff");
    form.set("surfaceMuted", "#f1f5f9");
    form.set("text", "#0a1628");
    form.set("textMuted", "#64748b");
    form.set("border", "#e2e8f0");
    form.set("success", "#16a34a");
    form.set("warning", "#ca8a04");
    form.set("danger", "#dc2626");

    expect(parseThemeTokensForm(form).success).toBe(false);
  });
});
