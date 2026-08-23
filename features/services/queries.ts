import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseStaticClient } from "@/lib/supabase/static";
import type { FieldDefinition } from "@/features/fields/types";
import type { ServiceFormFieldRow } from "@/types/database";

export const listServices = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select(
      "id, slug, name, tagline, description, base_price, price_note, currency, delivery_time, icon, image_url, is_featured",
    )
    .eq("is_active", true)
    .order("position");

  return data ?? [];
});

export const listServiceSlugs = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("is_active", true)
    .order("position");
  return (data ?? []).map((row) => row.slug);
});

/** Build-safe slug list for `generateStaticParams`. */
export async function listServiceSlugsForBuild() {
  const supabase = createSupabaseStaticClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("is_active", true)
    .order("position");

  return (data ?? []).map((row) => row.slug);
}

/** Falls back to the first services when nothing is explicitly featured. */
export async function getFeaturedServices(limit = 6) {
  const services = await listServices();
  const featured = services.filter((s) => s.is_featured);
  return (featured.length > 0 ? featured : services).slice(0, limit);
}

export function toServiceFieldDefinition(row: ServiceFormFieldRow): FieldDefinition {
  return {
    key: row.key,
    label: row.label,
    type: row.type,
    unit: null,
    options: Array.isArray(row.options) ? row.options : [],
    placeholder: row.placeholder,
    helpText: row.help_text,
    group: row.group_label,
    required: row.is_required,
    maxFiles: row.max_files,
    acceptedFileTypes: row.accepted_file_types,
  };
}

export type ServiceWithForm = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  basePrice: number | null;
  priceNote: string | null;
  currency: string;
  deliveryTime: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  form: { id: string; name: string; description: string | null } | null;
  fields: FieldDefinition[];
};

export const getServiceBySlug = cache(
  async (slug: string): Promise<ServiceWithForm | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: service } = await supabase
      .from("services")
      .select(
        `id, slug, name, tagline, description, base_price, price_note, currency,
         delivery_time, seo_title, seo_description`,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!service) return null;

    const { data: form } = await supabase
      .from("service_forms")
      .select("id, name, description")
      .eq("service_id", service.id)
      .eq("is_active", true)
      .maybeSingle();

    let fields: FieldDefinition[] = [];
    if (form) {
      const { data: rows } = await supabase
        .from("service_form_fields")
        .select("*")
        .eq("form_id", form.id)
        .order("position");
      fields = (rows ?? []).map(toServiceFieldDefinition);
    }

    return {
      id: service.id,
      slug: service.slug,
      name: service.name,
      tagline: service.tagline,
      description: service.description,
      basePrice: service.base_price === null ? null : Number(service.base_price),
      priceNote: service.price_note,
      currency: service.currency,
      deliveryTime: service.delivery_time,
      seoTitle: service.seo_title,
      seoDescription: service.seo_description,
      form,
      fields,
    };
  },
);

export async function getMyServiceRequests(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("service_requests")
    .select(
      "id, reference, status, created_at, quoted_amount, currency, services ( slug, name )",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getServiceRequest(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data: request, error } = await supabase
    .from("service_requests")
    .select(
      `id, reference, status, service_id, contact_name, contact_email, contact_phone,
       answers, quoted_amount, currency, created_at`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement de la demande : ${error.message}`);
  if (!request) return null;

  const { data: service } = await supabase
    .from("services")
    .select("slug, name, tagline")
    .eq("id", request.service_id)
    .maybeSingle();

  return { ...request, service };
}
