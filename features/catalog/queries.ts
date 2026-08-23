import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseStaticClient } from "@/lib/supabase/static";
import { formatAttributeValue } from "@/features/fields/validation";
import type { FieldDefinition } from "@/features/fields/types";
import type { FieldDefinitionRow, Json } from "@/types/database";
import type {
  CatalogFacets,
  CatalogResult,
  CatalogSearchParams,
  CategoryLocation,
  FamilyDetail,
  FamilyNode,
  ProductCard,
  ProductDetail,
  ProductSpec,
  SearchSuggestion,
  SubcategoryLocation,
} from "./types";

/**
 * Read side of the catalogue. Everything here runs through the request-scoped
 * client, so row level security applies and a draft product is invisible to a
 * visitor even if a slug is guessed.
 *
 * Rows come back snake_case; every exported function maps them to the camelCase
 * domain types in `./types` so no component ever depends on a column name.
 */

const PRODUCT_CARD_SELECT = `
  id, slug, name, short_description, price, sale_price, currency,
  stock, track_inventory, is_featured, rating_average, rating_count,
  brands ( slug, name ),
  subcategories ( slug, name ),
  product_images ( url, alt_text, is_primary, position )
`;

type RawProductCard = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  stock: number;
  track_inventory: boolean;
  is_featured: boolean;
  rating_average: number;
  rating_count: number;
  brands: { slug: string; name: string } | null;
  subcategories: { slug: string; name: string } | null;
  product_images: {
    url: string;
    alt_text: string | null;
    is_primary: boolean;
    position: number;
  }[];
};

function primaryImage(
  images: { url: string; alt_text: string | null; is_primary: boolean; position: number }[],
) {
  const sorted = [...(images ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position,
  );
  return sorted[0] ? { url: sorted[0].url, alt: sorted[0].alt_text } : null;
}

function toProductCard(row: RawProductCard): ProductCard {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    price: Number(row.price),
    salePrice: row.sale_price === null ? null : Number(row.sale_price),
    currency: row.currency,
    stock: row.stock,
    trackInventory: row.track_inventory,
    isFeatured: row.is_featured,
    ratingAverage: Number(row.rating_average),
    ratingCount: row.rating_count,
    brand: row.brands,
    subcategory: row.subcategories,
    image: primaryImage(row.product_images),
  };
}

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

type RawFamilyTree = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  categories: {
    id: string;
    slug: string;
    name: string;
    position: number;
    is_active: boolean;
    subcategories: {
      id: string;
      slug: string;
      name: string;
      position: number;
      is_active: boolean;
    }[];
  }[];
};

const FAMILY_TREE_SELECT = `
  id, slug, name, description, icon, position,
  categories ( id, slug, name, position, is_active,
    subcategories ( id, slug, name, position, is_active ) )
`;

function toFamilyNodes(rows: RawFamilyTree[]): FamilyNode[] {
  return rows.map((family) => ({
    id: family.id,
    slug: family.slug,
    name: family.name,
    description: family.description,
    icon: family.icon,
    categories: (family.categories ?? [])
      .filter((c) => c.is_active)
      .sort((a, b) => a.position - b.position)
      .map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        subcategories: (category.subcategories ?? [])
          .filter((s) => s.is_active)
          .sort((a, b) => a.position - b.position)
          .map((s) => ({ id: s.id, slug: s.slug, name: s.name })),
      })),
  }));
}

/** The whole active tree, used by the header, the footer and the home page. */
export const getFamilyTree = cache(async (): Promise<FamilyNode[]> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("families")
    .select(FAMILY_TREE_SELECT)
    .eq("is_active", true)
    .order("position");

  if (error || !data) return [];
  return toFamilyNodes(data as unknown as RawFamilyTree[]);
});

/**
 * Same tree, for `generateStaticParams`, which runs without an HTTP request and
 * therefore cannot use the cookie-bound client. Returning an empty list simply
 * defers those routes to on-demand rendering.
 */
export async function getFamilyTreeForBuild(): Promise<FamilyNode[]> {
  const supabase = createSupabaseStaticClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("families")
    .select(FAMILY_TREE_SELECT)
    .eq("is_active", true)
    .order("position");

  if (error || !data) return [];
  return toFamilyNodes(data as unknown as RawFamilyTree[]);
}

export const getFamilyBySlug = cache(
  async (slug: string): Promise<FamilyDetail | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("families")
      .select(
        `id, slug, name, description, seo_title, seo_description,
         categories ( id, slug, name, position, is_active,
           subcategories ( id, slug, name, position, is_active ) )`,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    const row = data as unknown as RawFamilyTree & {
      seo_title: string | null;
      seo_description: string | null;
    };

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      categories: (row.categories ?? [])
        .filter((c) => c.is_active)
        .sort((a, b) => a.position - b.position)
        .map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          subcategories: (category.subcategories ?? [])
            .filter((s) => s.is_active)
            .sort((a, b) => a.position - b.position)
            .map((s) => ({ id: s.id, slug: s.slug, name: s.name })),
        })),
    };
  },
);

export const getCategoryBySlug = cache(
  async (slug: string): Promise<CategoryLocation | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("categories")
      .select(
        `id, slug, name, description, seo_title, seo_description,
         families ( slug, name ),
         subcategories ( id, slug, name, position, is_active )`,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    const row = data as unknown as {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      seo_title: string | null;
      seo_description: string | null;
      families: { slug: string; name: string } | null;
      subcategories: {
        id: string;
        slug: string;
        name: string;
        position: number;
        is_active: boolean;
      }[];
    };

    if (!row.families) return null;

    return {
      family: row.families,
      category: {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        seoTitle: row.seo_title,
        seoDescription: row.seo_description,
        subcategories: (row.subcategories ?? [])
          .filter((s) => s.is_active)
          .sort((a, b) => a.position - b.position)
          .map((s) => ({ id: s.id, slug: s.slug, name: s.name })),
      },
    };
  },
);

export const getSubcategoryBySlug = cache(
  async (slug: string): Promise<SubcategoryLocation | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("subcategories")
      .select(
        `id, slug, name, description, field_set_id, seo_title, seo_description,
         categories ( slug, name, families ( slug, name ) )`,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    const row = data as unknown as {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      field_set_id: string | null;
      seo_title: string | null;
      seo_description: string | null;
      categories:
        | { slug: string; name: string; families: { slug: string; name: string } | null }
        | null;
    };

    if (!row.categories?.families) return null;

    return {
      family: row.categories.families,
      category: { slug: row.categories.slug, name: row.categories.name },
      subcategory: {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        fieldSetId: row.field_set_id,
        seoTitle: row.seo_title,
        seoDescription: row.seo_description,
      },
    };
  },
);

// ---------------------------------------------------------------------------
// Field definitions
// ---------------------------------------------------------------------------

export function toFieldDefinition(row: FieldDefinitionRow): FieldDefinition {
  return {
    key: row.key,
    label: row.label,
    type: row.type,
    unit: row.unit,
    options: Array.isArray(row.options) ? row.options : [],
    placeholder: row.placeholder,
    helpText: row.help_text,
    group: row.group_label,
    required: row.is_required,
    filterable: row.is_filterable,
    keySpec: row.is_key_spec,
  };
}

export const getFieldDefinitions = cache(
  async (fieldSetId: string | null): Promise<FieldDefinition[]> => {
    if (!fieldSetId) return [];

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("field_definitions")
      .select("*")
      .eq("field_set_id", fieldSetId)
      .order("position");

    return (data ?? []).map(toFieldDefinition);
  },
);

/** Resolves the field set from a subcategory id, for the admin product form. */
export const getFieldDefinitionsForSubcategory = cache(
  async (subcategoryId: string): Promise<FieldDefinition[]> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("subcategories")
      .select("field_set_id")
      .eq("id", subcategoryId)
      .maybeSingle();

    return getFieldDefinitions(data?.field_set_id ?? null);
  },
);

// ---------------------------------------------------------------------------
// Product listings
// ---------------------------------------------------------------------------

export async function searchProducts(
  params: CatalogSearchParams = {},
): Promise<CatalogResult> {
  if (params.onSale) {
    return searchProductsOnSale(params);
  }

  const supabase = await createSupabaseServerClient();
  const perPage = params.perPage ?? 24;
  const page = Math.max(params.page ?? 1, 1);

  const { data: matches, error } = await supabase.rpc("search_product_ids", {
    p_query: params.query ?? null,
    p_family: params.family ?? null,
    p_category: params.category ?? null,
    p_subcategory: params.subcategory ?? null,
    p_brand_slugs: params.brands?.length ? params.brands : null,
    p_min_price: params.minPrice ?? null,
    p_max_price: params.maxPrice ?? null,
    p_in_stock: params.inStock ?? null,
    p_min_rating: params.minRating ?? null,
    p_featured: params.featured ?? null,
    p_attributes: (params.attributes ?? {}) as Json,
    p_sort: params.sort ?? "relevance",
    p_limit: perPage,
    p_offset: (page - 1) * perPage,
    p_family_slugs: params.families?.length ? params.families : null,
    p_category_slugs: params.categories?.length ? params.categories : null,
    p_subcategory_slugs: params.subcategories?.length ? params.subcategories : null,
    p_models: params.models?.length ? params.models : null,
  });

  if (error || !matches || matches.length === 0) {
    return { products: [], total: 0, page, perPage, pageCount: 0 };
  }

  const ids = matches.map((m) => m.id);
  const total = Number(matches[0].total_count);

  const { data: rows } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .in("id", ids);

  // The RPC decided the order; `in` does not preserve it.
  const byId = new Map(
    (rows as unknown as RawProductCard[] | null)?.map((r) => [r.id, r]) ?? [],
  );
  const products = ids
    .map((id) => byId.get(id))
    .filter((r): r is RawProductCard => Boolean(r))
    .map(toProductCard);

  return {
    products,
    total,
    page,
    perPage,
    pageCount: Math.max(Math.ceil(total / perPage), 1),
  };
}

/** Paginated listing of discounted products (no RPC "on sale" predicate). */
async function searchProductsOnSale(
  params: CatalogSearchParams = {},
): Promise<CatalogResult> {
  const supabase = await createSupabaseServerClient();
  const perPage = params.perPage ?? 24;
  const page = Math.max(params.page ?? 1, 1);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT, { count: "exact" })
    .eq("status", "active")
    .not("sale_price", "is", null);

  if (params.query) {
    query = query.ilike("name", `%${params.query}%`);
  }

  const sort = params.sort ?? "rating";
  if (sort === "price_asc") {
    query = query.order("sale_price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("sale_price", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("rating_average", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error || !data) {
    return { products: [], total: 0, page, perPage, pageCount: 0 };
  }

  const total = count ?? 0;
  const products = (data as unknown as RawProductCard[]).map(toProductCard);

  return {
    products,
    total,
    page,
    perPage,
    pageCount: Math.max(Math.ceil(total / perPage), 1),
  };
}

export async function getCatalogFacets(
  params: Pick<
    CatalogSearchParams,
    | "family"
    | "category"
    | "subcategory"
    | "query"
    | "brands"
    | "families"
    | "categories"
    | "subcategories"
    | "models"
  > = {},
): Promise<CatalogFacets> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("catalog_facets", {
    p_family: params.family ?? null,
    p_category: params.category ?? null,
    p_subcategory: params.subcategory ?? null,
    p_query: params.query ?? null,
    p_brand_slugs: params.brands?.length ? params.brands : null,
    p_family_slugs: params.families?.length ? params.families : null,
    p_category_slugs: params.categories?.length ? params.categories : null,
    p_subcategory_slugs: params.subcategories?.length ? params.subcategories : null,
    p_models: params.models?.length ? params.models : null,
  });

  const fallback: CatalogFacets = {
    total: 0,
    price: { min: 0, max: 0 },
    brands: [],
    families: [],
    categories: [],
    subcategories: [],
    models: [],
    attributes: [],
  };

  if (!data || typeof data !== "object") return fallback;
  return { ...fallback, ...(data as unknown as CatalogFacets) };
}

export async function getSearchSuggestions(
  query: string,
  limit = 8,
): Promise<SearchSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_suggestions", {
    p_query: trimmed,
    p_limit: limit,
  });

  if (error || !data) return [];
  return (Array.isArray(data) ? data : []) as unknown as SearchSuggestion[];
}

/** Convenience wrapper for the home page rails. */
export async function getProductRail(
  params: CatalogSearchParams,
  limit = 10,
): Promise<ProductCard[]> {
  const { products } = await searchProducts({ ...params, perPage: limit, page: 1 });
  return products;
}

export function getFeaturedProducts(limit = 10): Promise<ProductCard[]> {
  return getProductRail({ featured: true, sort: "rating" }, limit);
}

export function getNewArrivals(limit = 10): Promise<ProductCard[]> {
  return getProductRail({ sort: "newest" }, limit);
}

export function getFamilyHighlights(
  familySlug: string,
  limit = 10,
): Promise<ProductCard[]> {
  return getProductRail({ family: familySlug, sort: "rating" }, limit);
}

/**
 * Discounted products. `search_product_ids` has no "on sale" predicate, so this
 * one reads the table directly — the RLS policy still hides anything that is
 * not published.
 */
export async function getPromotions(limit = 10): Promise<ProductCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("status", "active")
    .not("sale_price", "is", null)
    .order("rating_average", { ascending: false })
    .limit(limit);

  return ((data as unknown as RawProductCard[] | null) ?? []).map(toProductCard);
}

// ---------------------------------------------------------------------------
// Product detail
// ---------------------------------------------------------------------------

type RawProductDetail = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  model: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  stock: number;
  track_inventory: boolean;
  low_stock_threshold: number;
  status: ProductDetail["status"];
  is_featured: boolean;
  tags: string[] | null;
  weight_grams: number | null;
  seo_title: string | null;
  seo_description: string | null;
  rating_average: number;
  rating_count: number;
  brands: { id: string; slug: string; name: string; logo_url: string | null } | null;
  subcategories: {
    id: string;
    slug: string;
    name: string;
    field_set_id: string | null;
    categories: {
      slug: string;
      name: string;
      families: { slug: string; name: string } | null;
    } | null;
  } | null;
  product_images: {
    id: string;
    url: string;
    alt_text: string | null;
    position: number;
    is_primary: boolean;
    width: number | null;
    height: number | null;
  }[];
  product_variants: {
    id: string;
    sku: string | null;
    name: string;
    options: Record<string, string> | null;
    price: number | null;
    sale_price: number | null;
    stock: number;
    position: number;
    is_active: boolean;
  }[];
  product_attributes: {
    field_key: string;
    value_text: string | null;
    value_number: number | null;
    value_boolean: boolean | null;
  }[];
};

/**
 * Renders stored attributes into display-ready specs, in the order the field
 * set declares. Attributes with no matching definition are dropped: they are
 * leftovers from a field set that changed.
 */
function toSpecs(
  attributes: RawProductDetail["product_attributes"],
  definitions: FieldDefinition[],
): ProductSpec[] {
  const byKey = new Map(attributes.map((a) => [a.field_key, a]));

  return definitions.flatMap((definition) => {
    const attribute = byKey.get(definition.key);
    if (!attribute) return [];

    const value = formatAttributeValue(attribute, definition.unit);
    if (value === "—") return [];

    return [
      {
        key: definition.key,
        label: definition.label,
        value,
        isKeySpec: definition.keySpec ?? false,
        group: definition.group,
      },
    ];
  });
}

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
      .from("products")
      .select(
        `id, slug, name, short_description, description, model, sku,
         price, sale_price, currency, stock, track_inventory, low_stock_threshold,
         status, is_featured, tags, weight_grams,
         seo_title, seo_description, rating_average, rating_count,
         brands ( id, slug, name, logo_url ),
         subcategories (
           id, slug, name, field_set_id,
           categories ( slug, name, families ( slug, name ) )
         ),
         product_images ( id, url, alt_text, position, is_primary, width, height ),
         product_variants ( id, sku, name, options, price, sale_price, stock, position, is_active ),
         product_attributes ( field_key, value_text, value_number, value_boolean )`,
      )
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return null;

    const row = data as unknown as RawProductDetail;
    const subcategory = row.subcategories;
    const category = subcategory?.categories;
    const family = category?.families;

    // A product without a full ancestry cannot be located in the shop, so it is
    // treated as missing rather than rendered with a broken breadcrumb.
    if (!subcategory || !category || !family) return null;

    const definitions = await getFieldDefinitions(subcategory.field_set_id);

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortDescription: row.short_description,
      description: row.description,
      model: row.model,
      sku: row.sku,
      price: Number(row.price),
      salePrice: row.sale_price === null ? null : Number(row.sale_price),
      currency: row.currency,
      stock: row.stock,
      trackInventory: row.track_inventory,
      lowStockThreshold: row.low_stock_threshold,
      status: row.status,
      isFeatured: row.is_featured,
      tags: row.tags ?? [],
      weightGrams: row.weight_grams,
      ratingAverage: Number(row.rating_average),
      ratingCount: row.rating_count,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      brand: row.brands
        ? {
            id: row.brands.id,
            slug: row.brands.slug,
            name: row.brands.name,
            logoUrl: row.brands.logo_url,
          }
        : null,
      images: [...(row.product_images ?? [])]
        .sort(
          (a, b) =>
            Number(b.is_primary) - Number(a.is_primary) || a.position - b.position,
        )
        .map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt_text,
          width: image.width,
          height: image.height,
        })),
      variants: (row.product_variants ?? [])
        .filter((variant) => variant.is_active)
        .sort((a, b) => a.position - b.position)
        .map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          options: variant.options ?? {},
          price: variant.price === null ? null : Number(variant.price),
          salePrice: variant.sale_price === null ? null : Number(variant.sale_price),
          stock: variant.stock,
        })),
      specs: toSpecs(row.product_attributes ?? [], definitions),
      breadcrumb: {
        family: { slug: family.slug, name: family.name },
        category: { slug: category.slug, name: category.name },
        subcategory: { slug: subcategory.slug, name: subcategory.name },
      },
    };
  },
);

export async function getRelatedProducts(
  subcategorySlug: string,
  excludeId: string,
  limit = 8,
): Promise<ProductCard[]> {
  const { products } = await searchProducts({
    subcategory: subcategorySlug,
    perPage: limit + 1,
  });
  return products.filter((p) => p.id !== excludeId).slice(0, limit);
}

export async function getProductReviews(productId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, title, body, created_at, user_id")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
