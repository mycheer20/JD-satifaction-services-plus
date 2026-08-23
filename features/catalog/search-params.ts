import type { CatalogSearchParams, CatalogSort } from "./types";
import { SORT_LABELS } from "./types";

/**
 * URL <-> query translation for listing pages.
 *
 * The URL is the single source of truth for a listing: every filter is
 * shareable, bookmarkable and survives a reload. Attribute facets use an
 * `a_<key>` prefix so they never collide with a built-in parameter.
 */

export const ATTRIBUTE_PREFIX = "a_";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
}

function positiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function isSort(value: string | undefined): value is CatalogSort {
  return !!value && value in SORT_LABELS;
}

export function parseSearchParams(
  raw: RawSearchParams,
  scope: Pick<CatalogSearchParams, "family" | "category" | "subcategory"> = {},
): CatalogSearchParams {
  const attributes: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!key.startsWith(ATTRIBUTE_PREFIX)) continue;
    const values = list(value);
    if (values.length > 0) attributes[key.slice(ATTRIBUTE_PREFIX.length)] = values;
  }

  const sortParam = first(raw.tri);

  return {
    ...scope,
    query: first(raw.q)?.trim() || undefined,
    brands: list(raw.marque),
    families: list(raw.famille),
    categories: list(raw.cat),
    subcategories: list(raw.scat),
    models: list(raw.modele),
    minPrice: positiveNumber(first(raw.prix_min)),
    maxPrice: positiveNumber(first(raw.prix_max)),
    inStock: first(raw.stock) === "1" ? true : undefined,
    minRating: positiveNumber(first(raw.note)),
    featured: first(raw.vedette) === "1" ? true : undefined,
    onSale: first(raw.promo) === "1" ? true : undefined,
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
    sort: isSort(sortParam) ? sortParam : "relevance",
    page: Math.max(Number(first(raw.page) ?? 1) || 1, 1),
    perPage: 24,
  };
}

/** Counts the filters a shopper has applied, for the "clear filters" affordance. */
export function countActiveFilters(params: CatalogSearchParams): number {
  return (
    (params.brands?.length ?? 0) +
    (params.families?.length ?? 0) +
    (params.categories?.length ?? 0) +
    (params.subcategories?.length ?? 0) +
    (params.models?.length ?? 0) +
    (params.minPrice !== undefined ? 1 : 0) +
    (params.maxPrice !== undefined ? 1 : 0) +
    (params.inStock ? 1 : 0) +
    (params.minRating !== undefined ? 1 : 0) +
    (params.featured ? 1 : 0) +
    (params.onSale ? 1 : 0) +
    Object.values(params.attributes ?? {}).reduce((n, values) => n + values.length, 0)
  );
}
