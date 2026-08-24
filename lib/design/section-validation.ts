import { z } from "zod";
import { SLIDE_TRANSITIONS } from "@/lib/design/placements";

const slideInputSchema = z.object({
  mediaId: z.string().uuid(),
  altText: z.string().trim().max(500),
  position: z.number().int().min(0),
  durationMs: z.number().int().min(2000).max(30000).optional(),
  transition: z.enum(SLIDE_TRANSITIONS).optional(),
  overlayOpacity: z.number().min(0).max(0.85).optional(),
  imagePosition: z.string().trim().min(1).optional(),
});

export const heroConfigSchema = z.object({
  mode: z.enum(["gradient", "image", "slider"]),
  autoplay: z.boolean().optional(),
  pauseOnHover: z.boolean().optional(),
  loop: z.boolean().optional(),
  defaultDurationMs: z.number().int().min(2000).max(30000).optional(),
  defaultTransition: z.enum(SLIDE_TRANSITIONS).optional(),
  overlayOpacity: z.number().min(0).max(0.85).optional(),
  imagePosition: z.string().trim().optional(),
});

export const familyCoverSchema = z.object({
  mediaId: z.string().uuid().nullable(),
  altText: z.string().trim().max(500).optional(),
  overlayOpacity: z.number().min(0).max(0.85).optional(),
  imagePosition: z.string().trim().optional(),
  hoverScale: z.number().min(1).max(1.15).optional(),
  enableHover: z.boolean().optional(),
});

export const heroDraftPayloadSchema = z.object({
  config: heroConfigSchema,
  slides: z.array(slideInputSchema),
});

export type HeroDraftPayload = z.infer<typeof heroDraftPayloadSchema>;
export type FamilyCoverPayload = z.infer<typeof familyCoverSchema>;

export function parseHeroDraftPayload(raw: unknown) {
  return heroDraftPayloadSchema.safeParse(raw);
}

export function parseFamilyCoverPayload(raw: unknown) {
  return familyCoverSchema.safeParse(raw);
}

/** Règles métier hero avant publication. */
export function validateHeroForPublish(payload: HeroDraftPayload): string | null {
  const { config, slides } = payload;

  if (config.mode === "gradient") {
    return null;
  }

  if (config.mode === "image") {
    if (slides.length !== 1) {
      return "Le mode image nécessite exactement une slide.";
    }
    if (!slides[0]?.altText.trim()) {
      return "Texte alternatif requis pour l'image hero.";
    }
    return null;
  }

  if (slides.length < 2) {
    return "Le slider nécessite au moins 2 slides.";
  }

  for (const slide of slides) {
    if (!slide.altText.trim()) {
      return "Chaque slide doit avoir un texte alternatif avant publication.";
    }
  }

  return null;
}

export function validateFamilyCoverForPublish(payload: FamilyCoverPayload): string | null {
  if (!payload.mediaId) return null;
  if (!payload.altText?.trim()) {
    return "Texte alternatif requis lorsqu'une image de couverture est publiée.";
  }
  return null;
}
