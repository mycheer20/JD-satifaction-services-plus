import "server-only";

import { cache } from "react";
import { getFamilyTree } from "@/features/catalog/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminBadgeCounts } from "@/lib/admin/nav";
import type {
  OrderStatus,
  ProductStatus,
  ReviewStatus,
  ServiceRequestStatus,
} from "@/types/database";

export type DashboardMetrics = {
  revenueTotal: number;
  revenue30d: number;
  ordersTotal: number;
  ordersPending: number;
  productsTotal: number;
  productsActive: number;
  productsLowStock: number;
  productsOutOfStock: number;
  customersTotal: number;
  serviceRequestsPending: number;
  reviewsPending: number;
};

function parseMetrics(raw: Record<string, unknown>): DashboardMetrics {
  return {
    revenueTotal: Number(raw.revenue_total ?? 0),
    revenue30d: Number(raw.revenue_30d ?? 0),
    ordersTotal: Number(raw.orders_total ?? 0),
    ordersPending: Number(raw.orders_pending ?? 0),
    productsTotal: Number(raw.products_total ?? 0),
    productsActive: Number(raw.products_active ?? 0),
    productsLowStock: Number(raw.products_low_stock ?? 0),
    productsOutOfStock: Number(raw.products_out_of_stock ?? 0),
    customersTotal: Number(raw.customers_total ?? 0),
    serviceRequestsPending: Number(raw.service_requests_pending ?? 0),
    reviewsPending: Number(raw.reviews_pending ?? 0),
  };
}

/** Requires service role — call only after `requireStaff()`. */
export const getDashboardMetrics = cache(async (): Promise<DashboardMetrics> => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("admin_dashboard_metrics");

  if (error) throw new Error(`Métriques tableau de bord : ${error.message}`);
  return parseMetrics((data ?? {}) as Record<string, unknown>);
});

export async function getAdminBadgeCounts(): Promise<AdminBadgeCounts> {
  const [metrics, unreadNotifications] = await Promise.all([
    getDashboardMetrics(),
    getUnreadAdminNotificationCount(),
  ]);

  return {
    ordersPending: metrics.ordersPending,
    reviewsPending: metrics.reviewsPending,
    requestsPending: metrics.serviceRequestsPending,
    lowStock: metrics.productsLowStock + metrics.productsOutOfStock,
    notificationsUnread: unreadNotifications,
  };
}

export async function getUnreadAdminNotificationCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("admin_notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  if (error) throw new Error(`Notifications admin : ${error.message}`);
  return count ?? 0;
}

export async function listAdminNotifications(limit = 50) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("id, kind, title, message, link_href, payload, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Notifications admin : ${error.message}`);
  return data ?? [];
}

export async function listAdminProducts(options?: {
  status?: string;
  q?: string;
  limit?: number;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select(
      `id, slug, name, sku, model, status, price, sale_price, stock, low_stock_threshold, is_featured, updated_at,
       brand:brands ( name, slug ),
       subcategory:subcategories ( name, slug, category:categories ( name, family:families ( name ) ) )`,
    )
    .order("updated_at", { ascending: false })
    .limit(options?.limit ?? 100);

  if (options?.status) query = query.eq("status", options.status as ProductStatus);
  if (options?.q?.trim()) {
    query = query.or(
      `name.ilike.%${options.q.trim()}%,sku.ilike.%${options.q.trim()}%,model.ilike.%${options.q.trim()}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(`Liste produits : ${error.message}`);
  return (data ?? []) as unknown as ProductListRow[];
}

export type ProductListRow = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  model: string | null;
  status: ProductStatus;
  price: number;
  sale_price: number | null;
  stock: number;
  low_stock_threshold: number;
  is_featured: boolean;
  updated_at: string;
  brand: { name: string; slug: string } | null;
  subcategory: {
    name: string;
    slug: string;
    category?: { name: string; family?: { name: string } };
  } | null;
};

export async function getAdminProduct(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `*, brand:brands ( id, name, slug ),
       subcategory:subcategories ( id, name, slug, field_set_id,
         category:categories ( id, name, slug, family:families ( id, name, slug ) )
       ),
       images:product_images ( * ),
       attributes:product_attributes ( * ),
       variants:product_variants ( * ),
       supply:product_supply ( * )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement produit : ${error.message}`);
  return data as unknown as AdminProductDetail | null;
}

export type AdminProductDetail = {
  id: string;
  slug: string;
  name: string;
  subcategory_id: string;
  brand_id: string | null;
  short_description: string | null;
  description: string | null;
  model: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  low_stock_threshold: number;
  status: ProductStatus;
  is_featured: boolean;
  track_inventory: boolean;
  tags: string[];
  attributes?: {
    field_key: string;
    value_text: string | null;
    value_number: number | null;
    value_boolean: boolean | null;
    value_json: unknown;
  }[];
  images?: { id: string; url: string; alt_text: string | null }[];
};

export async function listBrands() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, logo_url, created_at")
    .order("name");
  if (error) throw new Error(`Liste marques : ${error.message}`);
  return data ?? [];
}

export async function listAdminOrders(status?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select("id, reference, status, customer_name, customer_email, customer_phone, total, currency, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status as OrderStatus);

  const { data, error } = await query;
  if (error) throw new Error(`Liste commandes : ${error.message}`);
  return data ?? [];
}

export async function listAdminReviews(status?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("reviews")
    .select(
      `id, rating, title, body, status, created_at,
       product:products ( name, slug ),
       profile:user_profiles ( full_name )`,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status as ReviewStatus);

  const { data, error } = await query;
  if (error) throw new Error(`Liste avis : ${error.message}`);
  return data ?? [];
}

export async function listAdminServiceRequests(status?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("service_requests")
    .select(
      `id, reference, status, contact_name, contact_email, quoted_amount, currency, created_at,
       service:services ( name, slug )`,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status as ServiceRequestStatus);

  const { data, error } = await query;
  if (error) throw new Error(`Liste demandes : ${error.message}`);
  return data ?? [];
}

export async function getAdminServiceRequest(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      `*, service:services ( name, slug ), files:service_request_files ( * )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement demande : ${error.message}`);
  return data as unknown as AdminServiceRequestDetail | null;
}

export type AdminServiceRequestDetail = {
  id: string;
  reference: string;
  status: ServiceRequestStatus;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  quoted_amount: number | null;
  currency: string;
  admin_notes: string | null;
  answers: Record<string, unknown>;
  created_at: string;
  service: { name: string; slug: string } | null;
  files: { id: string; file_name: string; field_key: string }[];
};

export async function listCoupons() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Liste coupons : ${error.message}`);
  return data ?? [];
}

export async function listFamilies() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("families").select("*").order("position");
  if (error) throw new Error(`Liste familles : ${error.message}`);
  return data ?? [];
}

export async function listCategories(familyId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("categories")
    .select("*, family:families ( name, slug )")
    .order("position");

  if (familyId) query = query.eq("family_id", familyId);

  const { data, error } = await query;
  if (error) throw new Error(`Liste catégories : ${error.message}`);
  return data ?? [];
}

export async function listSubcategories(categoryId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("subcategories")
    .select(
      "*, category:categories ( name, slug, family:families ( name, slug ) ), field_set:field_sets ( name, key )",
    )
    .order("position");

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query;
  if (error) throw new Error(`Liste sous-catégories : ${error.message}`);
  return data ?? [];
}

export async function listFieldSets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("field_sets").select("*").order("name");
  if (error) throw new Error(`Liste jeux de champs : ${error.message}`);
  return data ?? [];
}

export async function getFieldSetWithDefinitions(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("field_sets")
    .select("*, definitions:field_definitions ( * )")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement jeu de champs : ${error.message}`);
  return data as {
    id: string;
    key: string;
    name: string;
    description: string | null;
    definitions: {
      id: string;
      key: string;
      label: string;
      type: string;
      is_filterable: boolean;
      is_key_spec: boolean;
    }[];
  } | null;
}

export async function listServicesAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("services").select("*").order("position");
  if (error) throw new Error(`Liste services : ${error.message}`);
  return data ?? [];
}

export async function listSuppliers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("suppliers").select("*").order("name");
  if (error) throw new Error(`Liste fournisseurs : ${error.message}`);
  return data ?? [];
}

export async function listUsers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, phone, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(`Liste utilisateurs : ${error.message}`);
  return data ?? [];
}

/** Full taxonomy tree for product forms. */
export async function getTaxonomyForProductForm() {
  const [tree, supabase] = await Promise.all([
    getFamilyTree(),
    createSupabaseServerClient(),
  ]);

  const { data: subs } = await supabase
    .from("subcategories")
    .select("id, field_set_id");

  const fieldSetBySub = new Map(
    (subs ?? []).map((row) => [row.id, row.field_set_id as string | null]),
  );

  return tree.map((family) => ({
    id: family.id,
    name: family.name,
    categories: family.categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        field_set_id: fieldSetBySub.get(sub.id) ?? null,
      })),
    })),
  }));
}

export async function getOrderForAdmin(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, items:order_items ( * ), payments:payments ( *, proof_files:payment_proof_files ( * ) )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement commande : ${error.message}`);
  return data as unknown as AdminOrderDetail | null;
}

import type { PaymentProofFileRow } from "@/types/database";

export type AdminOrderDetail = {
  id: string;
  reference: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: unknown;
  customer_note: string | null;
  admin_note: string | null;
  fulfillment_mode: string;
  delivery_zone_id: string | null;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  total: number;
  currency: string;
  placed_at: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    line_total: number;
  }[];
  payments: {
    id: string;
    provider: string;
    payment_method: string;
    status: string;
    amount: number;
    customer_txn_id: string | null;
    proof_submitted_at: string | null;
    proof_files: PaymentProofFileRow[];
  }[];
};
