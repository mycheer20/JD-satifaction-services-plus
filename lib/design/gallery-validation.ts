import { z } from "zod";
import { DESIGN_GALLERY_CATEGORIES } from "@/lib/design/placements";

const categoryIds = DESIGN_GALLERY_CATEGORIES.map((category) => category.id) as [
  string,
  ...string[],
];

export const galleryItemPayloadSchema = z.object({
  mediaId: z.string().uuid(),
  category: z.enum(categoryIds),
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  position: z.number().int().min(0).optional(),
});

export const galleryItemUpdateSchema = galleryItemPayloadSchema
  .omit({ mediaId: true })
  .extend({
    itemId: z.string().uuid(),
    mediaId: z.string().uuid().optional(),
  });

export type GalleryItemPayload = z.infer<typeof galleryItemPayloadSchema>;
export type GalleryItemUpdatePayload = z.infer<typeof galleryItemUpdateSchema>;

export function parseGalleryItemPayload(raw: unknown) {
  return galleryItemPayloadSchema.safeParse(raw);
}

export function parseGalleryItemUpdatePayload(raw: unknown) {
  return galleryItemUpdateSchema.safeParse(raw);
}

export function validateGalleryItemForPublish(input: {
  mediaAltText?: string | null;
  title?: string | null;
}): string | null {
  const alt = input.mediaAltText?.trim() || input.title?.trim();
  if (!alt) {
    return "Un titre ou un texte alternatif média est requis avant publication.";
  }
  return null;
}
