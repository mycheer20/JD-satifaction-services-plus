import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DESIGN_NAV, DESIGN_NAV_ACCENTS } from "@/lib/design/nav";
import {
  DESIGN_PLACEMENTS,
  getPlacement,
  isValidPlacement,
  placementSupports,
} from "@/lib/design/placements";
import { DEFAULT_MOTION_SETTINGS, MOTION_PLACEMENT } from "@/lib/design/motion-defaults";
import { DEFAULT_THEME_TOKENS } from "@/lib/design/defaults";
import { normalizeMotionSettings } from "@/lib/design/motion-css";
import { normalizeThemeTokens } from "@/lib/design/theme-css";

const ROOT = process.cwd();

function pagePathFromHref(href: string): string {
  if (href === "/design") return join(ROOT, "app/design/page.tsx");
  return join(ROOT, "app", href.slice(1), "page.tsx");
}

describe("placements & nav — intégrité CMS", () => {
  it("registre site.motion pour les animations globales", () => {
    expect(isValidPlacement(MOTION_PLACEMENT)).toBe(true);
    expect(getPlacement(MOTION_PLACEMENT)?.capabilities).toContain("animation");
  });

  it("home.hero supporte slider et animation", () => {
    expect(placementSupports("home.hero", "slider")).toBe(true);
    expect(placementSupports("home.hero", "animation")).toBe(true);
    expect(placementSupports("home.hero", "tokens")).toBe(false);
  });

  it("chaque placement a un id unique", () => {
    const ids = DESIGN_PLACEMENTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque entrée nav a une page design correspondante", () => {
    for (const section of DESIGN_NAV) {
      for (const item of section.items) {
        if (item.disabled) continue;
        expect(existsSync(pagePathFromHref(item.href)), `${item.href} manquant`).toBe(true);
        if (item.accent) {
          expect(DESIGN_NAV_ACCENTS[item.accent]).toBeDefined();
        }
      }
    }
  });

  it("animations a un accent fuchsia distinct", () => {
    const animations = DESIGN_NAV.flatMap((s) => s.items).find(
      (item) => item.href === "/design/animations",
    );
    expect(animations?.accent).toBe("fuchsia");
    expect(animations?.icon).toBe("🎬");
  });

  it("publication est dans la nav générale", () => {
    const publication = DESIGN_NAV.flatMap((s) => s.items).find(
      (item) => item.href === "/design/publication",
    );
    expect(publication?.accent).toBe("emerald");
  });
});

describe("fallback codé — absence de config DB", () => {
  it("theme par défaut stable", () => {
    expect(normalizeThemeTokens(undefined)).toEqual(DEFAULT_THEME_TOKENS);
  });

  it("motion par défaut stable", () => {
    expect(normalizeMotionSettings(undefined)).toEqual(DEFAULT_MOTION_SETTINGS);
  });
});
