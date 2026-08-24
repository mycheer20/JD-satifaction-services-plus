import { DESIGN_GALLERY_CATEGORIES } from "@/lib/design/placements";
import type { DesignGalleryCategoryId } from "@/lib/design/placements";

const labelMap = new Map(DESIGN_GALLERY_CATEGORIES.map((category) => [category.id, category.label]));

export function galleryCategoryLabel(category: string): string {
  return labelMap.get(category as DesignGalleryCategoryId) ?? category;
}

export function isGalleryCategory(value: string): value is DesignGalleryCategoryId {
  return labelMap.has(value as DesignGalleryCategoryId);
}
