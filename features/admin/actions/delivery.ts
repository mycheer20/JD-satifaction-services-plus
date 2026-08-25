"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertStaff } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DELIVERY_PATHS = [
  "/admin/livraison",
  "/admin/livraison/zones",
  "/admin/livraison/localisations",
] as const;

function revalidateDelivery() {
  for (const path of DELIVERY_PATHS) revalidatePath(path);
  revalidatePath("/checkout");
}

const geoSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  is_active: z.coerce.boolean().optional(),
});

const zoneSchema = z.object({
  id: z.string().uuid().optional(),
  city_id: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  delivery_fee: z.coerce.number().min(0),
  currency: z.string().trim().min(3).max(3).default("HTG"),
  is_active: z.coerce.boolean().optional(),
});

export async function saveDeliveryCountry(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = geoSchema.safeParse({
    id: id ?? undefined,
    name: formData.get("name"),
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success) redirect("/admin/livraison/localisations?erreur=validation");

  const payload = { name: parsed.data.name, is_active: parsed.data.is_active ?? true };
  const { error } = id
    ? await supabase.from("delivery_countries").update(payload).eq("id", id)
    : await supabase.from("delivery_countries").insert(payload);
  if (error) redirect(`/admin/livraison/localisations?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/localisations?ok=pays");
}

export async function saveDeliveryDepartment(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const countryId = String(formData.get("country_id") ?? "");
  const parsed = geoSchema.safeParse({
    id: id ?? undefined,
    name: formData.get("name"),
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success || !countryId) redirect("/admin/livraison/localisations?erreur=validation");

  const payload = {
    country_id: countryId,
    name: parsed.data.name,
    is_active: parsed.data.is_active ?? true,
  };
  const { error } = id
    ? await supabase.from("delivery_departments").update(payload).eq("id", id)
    : await supabase.from("delivery_departments").insert(payload);
  if (error) redirect(`/admin/livraison/localisations?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/localisations?ok=departement");
}

export async function saveDeliveryCommune(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const departmentId = String(formData.get("department_id") ?? "");
  const parsed = geoSchema.safeParse({
    id: id ?? undefined,
    name: formData.get("name"),
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success || !departmentId) redirect("/admin/livraison/localisations?erreur=validation");

  const payload = {
    department_id: departmentId,
    name: parsed.data.name,
    is_active: parsed.data.is_active ?? true,
  };
  const { error } = id
    ? await supabase.from("delivery_communes").update(payload).eq("id", id)
    : await supabase.from("delivery_communes").insert(payload);
  if (error) redirect(`/admin/livraison/localisations?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/localisations?ok=commune");
}

export async function saveDeliveryCity(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const communeId = String(formData.get("commune_id") ?? "");
  const parsed = geoSchema.safeParse({
    id: id ?? undefined,
    name: formData.get("name"),
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success || !communeId) redirect("/admin/livraison/localisations?erreur=validation");

  const payload = {
    commune_id: communeId,
    name: parsed.data.name,
    is_active: parsed.data.is_active ?? true,
  };
  const { error } = id
    ? await supabase.from("delivery_cities").update(payload).eq("id", id)
    : await supabase.from("delivery_cities").insert(payload);
  if (error) redirect(`/admin/livraison/localisations?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/localisations?ok=ville");
}

export async function saveDeliveryZone(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = zoneSchema.safeParse({
    id: id ?? undefined,
    city_id: formData.get("city_id"),
    name: formData.get("name"),
    delivery_fee: formData.get("delivery_fee"),
    currency: formData.get("currency") || "HTG",
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success) {
    redirect(id ? `/admin/livraison/zones/${id}?erreur=validation` : "/admin/livraison/zones/nouveau?erreur=validation");
  }

  const payload = {
    city_id: parsed.data.city_id,
    name: parsed.data.name,
    delivery_fee: parsed.data.delivery_fee,
    currency: parsed.data.currency,
    is_active: parsed.data.is_active ?? true,
  };

  const { error } = id
    ? await supabase.from("delivery_zones").update(payload).eq("id", id)
    : await supabase.from("delivery_zones").insert(payload);

  if (error) {
    redirect(
      id
        ? `/admin/livraison/zones/${id}?erreur=${encodeURIComponent(error.message)}`
        : `/admin/livraison/zones/nouveau?erreur=${encodeURIComponent(error.message)}`,
    );
  }

  revalidateDelivery();
  redirect("/admin/livraison/zones?ok=zone");
}

export async function toggleDeliveryZone(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("is_active") === "1";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("delivery_zones").update({ is_active: isActive }).eq("id", id);
  if (error) redirect(`/admin/livraison/zones?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/zones?ok=statut");
}

export async function deleteDeliveryZone(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("delivery_zone_id", id);

  if ((count ?? 0) > 0) {
    redirect("/admin/livraison/zones?erreur=zone-utilisee-desactivez");
  }

  const { error } = await supabase.from("delivery_zones").delete().eq("id", id);
  if (error) redirect(`/admin/livraison/zones?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/zones?ok=supprime");
}

export async function toggleGeoActive(formData: FormData) {
  await assertStaff();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("is_active") === "1";
  const allowed = [
    "delivery_countries",
    "delivery_departments",
    "delivery_communes",
    "delivery_cities",
  ] as const;
  if (!allowed.includes(table as (typeof allowed)[number])) {
    redirect("/admin/livraison/localisations?erreur=table");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(table as (typeof allowed)[number])
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) redirect(`/admin/livraison/localisations?erreur=${encodeURIComponent(error.message)}`);
  revalidateDelivery();
  redirect("/admin/livraison/localisations?ok=statut");
}
