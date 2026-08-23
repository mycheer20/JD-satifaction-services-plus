/**
 * Domain shapes for the catalogue.
 *
 * Database rows (snake_case) live in `types/database.ts`. Everything that
 * leaves `features/catalog/queries.ts` is mapped to the camelCase shapes below,
 * so pages and components never depend on column names.
 */

import type { ProductStatus } from "@/types/database";

export interface SubcategoryNode {
  id: string;
  slug: string;
  name: string;
}

export interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  subcategories: SubcategoryNode[];
}

export interface FamilyNode {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  categories: CategoryNode[];
}

export interface FamilyDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  categories: CategoryNode[];
}

export interface CategoryDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  subcategories: SubcategoryNode[];
}

export interface SubcategoryDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  fieldSetId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

/** Resolved ancestry, so a listing page can render a breadcrumb in one query. */
export interface CategoryLocation {
  family: { slug: string; name: string };
  category: CategoryDetail;
}

export interface SubcategoryLocation {
  family: { slug: string; name: string };
  category: { slug: string; name: string };
  subcategory: SubcategoryDetail;
}

/** The minimal product shape a listing card needs. */
export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  salePrice: number | null;
  currency: string;
  stock: number;
  trackInventory: boolean;
  isFeatured: boolean;
  ratingAverage: number;
  ratingCount: number;
  brand: { slug: string; name: string } | null;
  image: { url: string; alt: string | null } | null;
  subcategory: { slug: string; name: string } | null;
}

export interface ProductImageView {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface ProductVariantView {
  id: string;
  sku: string | null;
  name: string;
  options: Record<string, string>;
  price: number | null;
  salePrice: number | null;
  stock: number;
}

/** A single rendered characteristic, already formatted for display. */
export interface ProductSpec {
  key: string;
  label: string;
  value: string;
  isKeySpec: boolean;
  group: string | null;
}

export interface ProductBreadcrumb {
  family: { slug: string; name: string };
  category: { slug: string; name: string };
  subcategory: { slug: string; name: string };
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  model: string | null;
  sku: string | null;
  price: number;
  salePrice: number | null;
  currency: string;
  stock: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured: boolean;
  tags: string[];
  weightGrams: number | null;
  ratingAverage: number;
  ratingCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  brand: { id: string; slug: string; name: string; logoUrl: string | null } | null;
  images: ProductImageView[];
  variants: ProductVariantView[];
  specs: ProductSpec[];
  breadcrumb: ProductBreadcrumb;
}

export interface FacetBrand {
  slug: string;
  name: string;
  count: number;
}

export interface FacetTaxonomy {
  slug: string;
  name: string;
  count: number;
  familySlug?: string;
  categorySlug?: string;
}

export interface FacetModel {
  name: string;
  count: number;
}

export interface FacetAttribute {
  key: string;
  label: string;
  values: { value: string; count: number }[];
}

export interface CatalogFacets {
  total: number;
  price: { min: number; max: number };
  brands: FacetBrand[];
  families: FacetTaxonomy[];
  categories: FacetTaxonomy[];
  subcategories: FacetTaxonomy[];
  models: FacetModel[];
  attributes: FacetAttribute[];
}

export type SearchSuggestionKind =
  | "product"
  | "brand"
  | "category"
  | "subcategory"
  | "family"
  | "model"
  | "correction";

export interface SearchSuggestion {
  kind: SearchSuggestionKind;
  label: string;
  slug: string | null;
  meta: string;
  score: number;
}

export type CatalogSort =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest"
  | "name";

export const SORT_LABELS: Record<CatalogSort, string> = {
  relevance: "Pertinence",
  newest: "Nouveautés",
  price_asc: "Prix croissant",
  price_desc: "Prix décroissant",
  rating: "Mieux notés",
  name: "Nom (A-Z)",
};

export interface CatalogSearchParams {
  query?: string;
  family?: string;
  category?: string;
  subcategory?: string;
  brands?: string[];
  families?: string[];
  categories?: string[];
  subcategories?: string[];
  models?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  featured?: boolean;
  onSale?: boolean;
  attributes?: Record<string, string[]>;
  sort?: CatalogSort;
  page?: number;
  perPage?: number;
}

export interface CatalogResult {
  products: ProductCard[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
}
