import { describe, expect, it } from "vitest";
import { sectionViewDiffers } from "@/lib/design/editor-diff";
import {
  validateAboutSectionForPublish,
  validateFamilyCoverForPublish,
  validateHeroForPublish,
} from "@/lib/design/section-validation";
import {
  validateGalleryItemForPublish,
  parseGalleryItemPayload,
} from "@/lib/design/gallery-validation";
import type { HeroDraftPayload } from "@/lib/design/section-validation";
import type { SectionEditorView } from "@/types/design";

const MEDIA_ID = "11111111-1111-4111-8111-111111111111";

describe("validation publication — fallback métier", () => {
  it("hero gradient : publication autorisée sans slides", () => {
    const payload: HeroDraftPayload = {
      config: { mode: "gradient" },
      slides: [],
    };
    expect(validateHeroForPublish(payload)).toBeNull();
  });

  it("hero image : exige une slide et un alt", () => {
    expect(
      validateHeroForPublish({
        config: { mode: "image" },
        slides: [],
      }),
    ).toContain("exactement une slide");

    expect(
      validateHeroForPublish({
        config: { mode: "image" },
        slides: [
          {
            mediaId: MEDIA_ID,
            altText: "",
            position: 0,
          },
        ],
      }),
    ).toContain("alternatif");
  });

  it("slider : exige au moins 2 slides avec alt", () => {
    expect(
      validateHeroForPublish({
        config: { mode: "slider" },
        slides: [
          {
            mediaId: MEDIA_ID,
            altText: "Slide 1",
            position: 0,
          },
        ],
      }),
    ).toContain("2 slides");
  });

  it("couverture famille : alt requis si image", () => {
    expect(validateFamilyCoverForPublish({ mediaId: null })).toBeNull();
    expect(
      validateFamilyCoverForPublish({ mediaId: MEDIA_ID, altText: "" }),
    ).toContain("alternatif");
  });

  it("section à propos : alt requis si image", () => {
    expect(validateAboutSectionForPublish({ mediaId: null })).toBeNull();
    expect(
      validateAboutSectionForPublish({ mediaId: MEDIA_ID, altText: "  " }),
    ).toContain("alternatif");
  });

  it("galerie : titre ou alt média requis", () => {
    expect(validateGalleryItemForPublish({ mediaAltText: null, title: null })).not.toBeNull();
    expect(validateGalleryItemForPublish({ mediaAltText: "Boutique", title: null })).toBeNull();
    expect(validateGalleryItemForPublish({ mediaAltText: null, title: "Équipe" })).toBeNull();
  });

  it("galerie : rejette un payload invalide", () => {
    expect(parseGalleryItemPayload({ mediaId: "bad", category: "entreprise" }).success).toBe(
      false,
    );
    expect(
      parseGalleryItemPayload({ mediaId: MEDIA_ID, category: "entreprise" }).success,
    ).toBe(true);
  });
});

describe("editor-diff — détection brouillons", () => {
  const baseView = (overrides?: Partial<SectionEditorView>): SectionEditorView => ({
    placement: "home.hero",
    config: { mode: "gradient" },
    slides: [],
    publishedAt: null,
    ...overrides,
  });

  it("sans brouillon : pas de changement", () => {
    expect(sectionViewDiffers(null, baseView())).toBe(false);
  });

  it("brouillon sans publié : changement si contenu", () => {
    expect(
      sectionViewDiffers(
        baseView({ config: { mode: "image" }, slides: [{ mediaId: MEDIA_ID } as never] }),
        null,
      ),
    ).toBe(true);
    expect(sectionViewDiffers(baseView({ config: {}, slides: [] }), null)).toBe(false);
  });

  it("détecte un changement de config ou de slides", () => {
    const published = baseView();
    expect(sectionViewDiffers(baseView({ config: { mode: "slider" } }), published)).toBe(true);
    expect(sectionViewDiffers(baseView(), published)).toBe(false);
  });
});
