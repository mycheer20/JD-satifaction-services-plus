import { describe, expect, it } from "vitest";
import { DEFAULT_MOTION_SETTINGS } from "@/lib/design/motion-defaults";
import {
  buildMotionStylesheet,
  motionSettingsEqual,
  motionSettingsToCssVariables,
  motionSettingsToDataAttributes,
  normalizeMotionSettings,
} from "@/lib/design/motion-css";
import { parseMotionSettingsForm } from "@/lib/design/motion-validation";

describe("motion-css", () => {
  it("retourne les defaults quand la config est absente", () => {
    expect(normalizeMotionSettings(null)).toEqual(DEFAULT_MOTION_SETTINGS);
    expect(normalizeMotionSettings(undefined)).toEqual(DEFAULT_MOTION_SETTINGS);
    expect(normalizeMotionSettings({})).toEqual(DEFAULT_MOTION_SETTINGS);
  });

  it("désactive les interactions quand enabled=false", () => {
    const vars = motionSettingsToCssVariables(
      normalizeMotionSettings({ enabled: false, cardHover: true }),
    );
    expect(vars["--motion-enabled"]).toBe("0");
    expect(vars["--motion-card-hover"]).toBe("0");
    expect(vars["--motion-scroll-reveal"]).toBe("0");
  });

  it("adapte l'intensité expressive", () => {
    const vars = motionSettingsToCssVariables(
      normalizeMotionSettings({ intensity: "expressive" }),
    );
    expect(vars["--motion-hover-scale"]).toBe("1.05");
    expect(vars["--motion-duration-slow"]).toBe("650ms");
  });

  it("génère des attributs data-motion cohérents", () => {
    expect(motionSettingsToDataAttributes(DEFAULT_MOTION_SETTINGS)).toEqual({
      "data-motion": "on",
      "data-motion-intensity": "normal",
      "data-motion-scroll-reveal": "on",
    });

    expect(
      motionSettingsToDataAttributes({ ...DEFAULT_MOTION_SETTINGS, enabled: false }),
    ).toEqual({
      "data-motion": "off",
      "data-motion-intensity": "normal",
      "data-motion-scroll-reveal": "off",
    });
  });

  it("produit une feuille CSS valide", () => {
    const css = buildMotionStylesheet(DEFAULT_MOTION_SETTINGS);
    expect(css).toContain(":root {");
    expect(css).toContain("--motion-duration: 300ms;");
  });

  it("compare deux configs identiques", () => {
    expect(motionSettingsEqual(DEFAULT_MOTION_SETTINGS, { ...DEFAULT_MOTION_SETTINGS })).toBe(
      true,
    );
    expect(
      motionSettingsEqual(DEFAULT_MOTION_SETTINGS, {
        ...DEFAULT_MOTION_SETTINGS,
        scrollReveal: false,
      }),
    ).toBe(false);
  });
});

describe("motion-validation", () => {
  it("parse un formulaire complet", () => {
    const form = new FormData();
    form.set("enabled", "1");
    form.set("intensity", "subtle");
    form.set("cardHover", "1");
    form.set("heroTransitions", "0");
    form.set("galleryHover", "1");
    form.set("familyHover", "1");
    form.set("scrollReveal", "1");

    const parsed = parseMotionSettingsForm(form);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.intensity).toBe("subtle");
      expect(parsed.data.heroTransitions).toBe(false);
    }
  });

  it("rejette une intensité invalide", () => {
    const form = new FormData();
    form.set("enabled", "1");
    form.set("intensity", "wild");
    form.set("cardHover", "1");
    form.set("heroTransitions", "1");
    form.set("galleryHover", "1");
    form.set("familyHover", "1");
    form.set("scrollReveal", "1");

    expect(parseMotionSettingsForm(form).success).toBe(false);
  });
});
