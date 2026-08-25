/**
 * Hand-maintained schema types, mirroring supabase/migrations.
 *
 * If you change a migration, change the matching Row here. Running
 * `supabase gen types typescript` against your project is the alternative once
 * the Supabase CLI is set up locally.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "staff" | "admin" | "designer";
export type ProductStatus = "draft" | "active" | "archived";
export type ItemKind = "physical_product" | "digital_product" | "service";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";
export type ServiceRequestStatus =
  | "submitted"
  | "in_review"
  | "quoted"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled";
export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "integer"
  | "boolean"
  | "select"
  | "multiselect"
  | "date"
  | "email"
  | "url"
  | "color"
  | "file"
  | "files";
export type DiscountType = "percentage" | "fixed";
export type ReviewStatus = "pending" | "approved" | "rejected";

/** Columns listed in `R` are required on insert; everything else is optional. */
type Table<Row, R extends keyof Row = never> = {
  Row: Row;
  Insert: Pick<Row, R> & Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type UserProfileRow = Timestamps & {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: Json;
  marketing_opt_in: boolean;
};

export type FieldSetRow = Timestamps & {
  id: string;
  key: string;
  name: string;
  description: string | null;
};

export type FamilyRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type CategoryRow = FamilyRow & { family_id: string };

export type SubcategoryRow = Timestamps & {
  id: string;
  category_id: string;
  field_set_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type FieldDefinitionRow = Timestamps & {
  id: string;
  field_set_id: string;
  key: string;
  label: string;
  type: FieldType;
  unit: string | null;
  options: string[];
  placeholder: string | null;
  help_text: string | null;
  group_label: string | null;
  is_required: boolean;
  is_filterable: boolean;
  is_key_spec: boolean;
  position: number;
};

export type BrandRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
};

export type ProductRow = Timestamps & {
  id: string;
  subcategory_id: string;
  brand_id: string | null;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  model: string | null;
  sku: string | null;
  kind: ItemKind;
  price: number;
  sale_price: number | null;
  currency: string;
  track_inventory: boolean;
  stock: number;
  low_stock_threshold: number;
  status: ProductStatus;
  is_featured: boolean;
  tags: string[];
  weight_grams: number | null;
  dimensions: Json;
  seo_title: string | null;
  seo_description: string | null;
  rating_average: number;
  rating_count: number;
  published_at: string | null;
  created_by: string | null;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type ProductVariantRow = Timestamps & {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  options: Record<string, string>;
  price: number | null;
  sale_price: number | null;
  stock: number;
  image_id: string | null;
  position: number;
  is_active: boolean;
};

export type ProductAttributeRow = {
  id: string;
  product_id: string;
  field_key: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  value_json: Json;
};

export type SupplierRow = Timestamps & {
  id: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  notes: string | null;
  is_active: boolean;
};

export type ProductSupplyRow = Timestamps & {
  product_id: string;
  supplier_id: string | null;
  supplier_reference: string | null;
  cost_price: number | null;
  lead_time_days: number | null;
  is_sourced_on_demand: boolean;
  internal_notes: string | null;
};

export type ServiceRow = Timestamps & {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  base_price: number | null;
  price_note: string | null;
  currency: string;
  delivery_time: string | null;
  icon: string | null;
  image_url: string | null;
  position: number;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type ServiceFormRow = Timestamps & {
  id: string;
  service_id: string;
  name: string;
  description: string | null;
  version: number;
  is_active: boolean;
};

export type ServiceFormFieldRow = Timestamps & {
  id: string;
  form_id: string;
  key: string;
  label: string;
  type: FieldType;
  options: string[];
  placeholder: string | null;
  help_text: string | null;
  group_label: string | null;
  is_required: boolean;
  position: number;
  max_files: number | null;
  accepted_file_types: string[] | null;
};

export type ServiceRequestRow = Timestamps & {
  id: string;
  reference: string;
  service_id: string;
  form_id: string | null;
  user_id: string | null;
  order_id: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  answers: Record<string, Json>;
  status: ServiceRequestStatus;
  quoted_amount: number | null;
  currency: string;
  admin_notes: string | null;
};

export type ServiceRequestFileRow = {
  id: string;
  request_id: string;
  field_key: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type CouponRow = Timestamps & {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

export type OrderRow = Timestamps & {
  id: string;
  reference: string;
  user_id: string | null;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: Json;
  billing_address: Json;
  currency: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  coupon_id: string | null;
  coupon_code: string | null;
  customer_note: string | null;
  admin_note: string | null;
  placed_at: string;
  fulfillment_mode: string;
  delivery_zone_id: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  item_kind: ItemKind;
  product_id: string | null;
  variant_id: string | null;
  service_id: string | null;
  service_request_id: string | null;
  name: string;
  sku: string | null;
  image_url: string | null;
  options: Record<string, string>;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type PaymentRow = Timestamps & {
  id: string;
  order_id: string;
  provider: string;
  payment_method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_reference: string | null;
  customer_txn_id: string | null;
  proof_submitted_at: string | null;
  provider_payload: Json;
  failure_reason: string | null;
  processed_at: string | null;
};

export type PaymentProofFileRow = {
  id: string;
  payment_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type PaymentWebhookEventRow = {
  id: string;
  provider: string;
  event_id: string;
  payload: Json;
  received_at: string;
};

export type AdminNotificationRow = {
  id: string;
  kind: string;
  title: string;
  message: string;
  link_href: string;
  payload: Json;
  read_at: string | null;
  created_at: string;
};

export type DesignPublishStatus = "draft" | "published";

export type DesignMediaRow = Timestamps & {
  id: string;
  bucket_id: string;
  storage_path: string;
  public_url: string;
  display_name: string;
  description: string | null;
  alt_text: string | null;
  mime_type: string;
  extension: string;
  media_kind: "image" | "svg" | "animated";
  width: number | null;
  height: number | null;
  size_bytes: number;
  is_active: boolean;
  created_by: string | null;
};

export type DesignSectionConfigRow = Timestamps & {
  id: string;
  placement: string;
  status: DesignPublishStatus;
  config: Json;
  published_at: string | null;
  updated_by: string | null;
};

export type DesignSlideRow = Timestamps & {
  id: string;
  section_config_id: string;
  media_id: string;
  position: number;
  duration_ms: number;
  transition: string;
  overlay_opacity: number;
  image_position: string;
  alt_text: string | null;
  is_active: boolean;
};

export type DesignGalleryItemRow = Timestamps & {
  id: string;
  media_id: string;
  category: string;
  title: string | null;
  description: string | null;
  position: number;
  status: DesignPublishStatus;
  is_active: boolean;
  created_by: string | null;
};

export type DesignThemeTokensRow = Timestamps & {
  id: string;
  status: DesignPublishStatus;
  tokens: Json;
  updated_by: string | null;
};

export type DesignPublicationRow = {
  id: string;
  published_by: string | null;
  notes: string | null;
  snapshot: Json;
  published_at: string;
};

export type ReviewRow = Timestamps & {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  status: ReviewStatus;
};

export type DeliveryCountryRow = Timestamps & {
  id: string;
  name: string;
  is_active: boolean;
};

export type DeliveryDepartmentRow = Timestamps & {
  id: string;
  country_id: string;
  name: string;
  is_active: boolean;
};

export type DeliveryCommuneRow = Timestamps & {
  id: string;
  department_id: string;
  name: string;
  is_active: boolean;
};

export type DeliveryCityRow = Timestamps & {
  id: string;
  commune_id: string;
  name: string;
  is_active: boolean;
};

export type DeliveryZoneRow = Timestamps & {
  id: string;
  city_id: string;
  name: string;
  delivery_fee: number;
  currency: string;
  is_active: boolean;
};

export type Database = {
  public: {
    Tables: {
      user_profiles: Table<UserProfileRow, "id">;
      field_sets: Table<FieldSetRow, "key" | "name">;
      families: Table<FamilyRow, "slug" | "name">;
      categories: Table<CategoryRow, "slug" | "name" | "family_id">;
      subcategories: Table<SubcategoryRow, "slug" | "name" | "category_id">;
      field_definitions: Table<FieldDefinitionRow, "field_set_id" | "key" | "label">;
      brands: Table<BrandRow, "slug" | "name">;
      products: Table<ProductRow, "subcategory_id" | "slug" | "name" | "price">;
      product_images: Table<ProductImageRow, "product_id" | "storage_path" | "url">;
      product_variants: Table<ProductVariantRow, "product_id" | "name">;
      product_attributes: Table<ProductAttributeRow, "product_id" | "field_key">;
      suppliers: Table<SupplierRow, "name">;
      product_supply: Table<ProductSupplyRow, "product_id">;
      services: Table<ServiceRow, "slug" | "name">;
      service_forms: Table<ServiceFormRow, "service_id" | "name">;
      service_form_fields: Table<ServiceFormFieldRow, "form_id" | "key" | "label">;
      service_requests: Table<
        ServiceRequestRow,
        "service_id" | "contact_name" | "contact_email"
      >;
      service_request_files: Table<
        ServiceRequestFileRow,
        "request_id" | "field_key" | "storage_path" | "file_name"
      >;
      coupons: Table<CouponRow, "code" | "discount_value">;
      orders: Table<OrderRow, "customer_name" | "customer_email">;
      order_items: Table<
        OrderItemRow,
        "order_id" | "name" | "unit_price" | "quantity" | "line_total"
      >;
      payments: Table<PaymentRow, "order_id" | "provider" | "payment_method" | "amount">;
      payment_proof_files: Table<
        PaymentProofFileRow,
        "payment_id" | "storage_path" | "file_name"
      >;
      admin_notifications: Table<
        AdminNotificationRow,
        "kind" | "title" | "message" | "link_href"
      >;
      design_media: Table<DesignMediaRow, "storage_path" | "public_url" | "display_name">;
      design_section_configs: Table<DesignSectionConfigRow, "placement" | "status">;
      design_slides: Table<DesignSlideRow, "section_config_id" | "media_id" | "position">;
      design_gallery_items: Table<
        DesignGalleryItemRow,
        "media_id" | "category" | "status" | "position"
      >;
      design_theme_tokens: Table<DesignThemeTokensRow, "status">;
      design_publications: Table<DesignPublicationRow, "published_at">;
      payment_webhook_events: Table<PaymentWebhookEventRow, "provider" | "event_id">;
      reviews: Table<ReviewRow, "product_id" | "user_id" | "rating">;
      delivery_countries: Table<DeliveryCountryRow, "name">;
      delivery_departments: Table<DeliveryDepartmentRow, "country_id" | "name">;
      delivery_communes: Table<DeliveryCommuneRow, "department_id" | "name">;
      delivery_cities: Table<DeliveryCityRow, "commune_id" | "name">;
      delivery_zones: Table<DeliveryZoneRow, "city_id" | "name" | "delivery_fee">;
    };
    Views: Record<string, never>;
    Functions: {
      place_order: {
        Args: {
          p_user_id: string | null;
          p_customer: Json;
          p_items: Json;
          p_coupon_code?: string | null;
          p_shipping_total?: number;
        };
        Returns: Json;
      };
      restock_order: { Args: { p_order_id: string }; Returns: undefined };
      search_product_ids: {
        Args: {
          p_query?: string | null;
          p_family?: string | null;
          p_category?: string | null;
          p_subcategory?: string | null;
          p_brand_slugs?: string[] | null;
          p_min_price?: number | null;
          p_max_price?: number | null;
          p_in_stock?: boolean | null;
          p_min_rating?: number | null;
          p_featured?: boolean | null;
          p_attributes?: Json;
          p_sort?: string;
          p_limit?: number;
          p_offset?: number;
          p_family_slugs?: string[] | null;
          p_category_slugs?: string[] | null;
          p_subcategory_slugs?: string[] | null;
          p_models?: string[] | null;
        };
        Returns: { id: string; total_count: number }[];
      };
      catalog_facets: {
        Args: {
          p_family?: string | null;
          p_category?: string | null;
          p_subcategory?: string | null;
          p_query?: string | null;
          p_brand_slugs?: string[] | null;
          p_family_slugs?: string[] | null;
          p_category_slugs?: string[] | null;
          p_subcategory_slugs?: string[] | null;
          p_models?: string[] | null;
        };
        Returns: Json;
      };
      search_suggestions: {
        Args: { p_query: string; p_limit?: number };
        Returns: Json;
      };
      global_search: {
        Args: { p_query: string; p_limit?: number };
        Returns: Json;
      };
      admin_dashboard_metrics: { Args: Record<string, never>; Returns: Json };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_designer: { Args: Record<string, never>; Returns: boolean };
      is_design_editor: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      design_publish_status: DesignPublishStatus;
      product_status: ProductStatus;
      item_kind: ItemKind;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      service_request_status: ServiceRequestStatus;
      field_type: FieldType;
      discount_type: DiscountType;
      review_status: ReviewStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
