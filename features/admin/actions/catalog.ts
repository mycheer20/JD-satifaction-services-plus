"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin, assertStaff } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { DiscountType, UserRole } from "@/types/database";

const couponSchema = z.object({
  code: z.string().trim().min(2).max(40),
  description: z.string().trim().max(300).optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().positive(),
  min_order_amount: z.coerce.number().min(0).optional().or(z.literal("")),
  max_discount_amount: z.coerce.number().min(0).optional().or(z.literal("")),
  usage_limit: z.coerce.number().int().min(1).optional().or(z.literal("")),
  per_user_limit: z.coerce.number().int().min(1).optional().or(z.literal("")),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
});

export async function saveCoupon(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;

  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    description: formData.get("description") || "",
    discount_type: formData.get("discount_type"),
    discount_value: formData.get("discount_value"),
    min_order_amount: formData.get("min_order_amount") || "",
    max_discount_amount: formData.get("max_discount_amount") || "",
    usage_limit: formData.get("usage_limit") || "",
    per_user_limit: formData.get("per_user_limit") || "",
    starts_at: formData.get("starts_at") || "",
    ends_at: formData.get("ends_at") || "",
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    redirect(id ? `/admin/coupons/${id}?erreur=validation` : "/admin/coupons/nouveau?erreur=validation");
  }

  const d = parsed.data;
  const payload = {
    code: d.code.toUpperCase(),
    description: d.description || null,
    discount_type: d.discount_type as DiscountType,
    discount_value: d.discount_value,
    min_order_amount: d.min_order_amount === "" ? null : d.min_order_amount,
    max_discount_amount: d.max_discount_amount === "" ? null : d.max_discount_amount,
    usage_limit: d.usage_limit === "" ? null : d.usage_limit,
    per_user_limit: d.per_user_limit === "" ? null : d.per_user_limit,
    starts_at: d.starts_at ? new Date(d.starts_at).toISOString() : null,
    ends_at: d.ends_at ? new Date(d.ends_at).toISOString() : null,
    is_active: d.is_active ?? true,
  };

  if (id) {
    const { error } = await supabase.from("coupons").update(payload).eq("id", id);
    if (error) redirect(`/admin/coupons/${id}?erreur=${encodeURIComponent(error.message)}`);
    revalidatePath("/admin/coupons");
    redirect("/admin/coupons?ok=modifie");
  }

  const { error } = await supabase.from("coupons").insert(payload);
  if (error) redirect(`/admin/coupons/nouveau?erreur=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?ok=cree");
}

export async function deleteCoupon(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) redirect(`/admin/coupons?erreur=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?ok=supprime");
}

const taxonomySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(2000).optional(),
  position: z.coerce.number().int().default(0),
  is_active: z.coerce.boolean().optional(),
});

export async function saveFamily(formData: FormData) {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = taxonomySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || "",
    position: formData.get("position"),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) redirect("/admin/familles?erreur=validation");

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug?.trim() || slugify(parsed.data.name),
    description: parsed.data.description || null,
    position: parsed.data.position,
    is_active: parsed.data.is_active ?? true,
  };

  if (id) {
    await supabase.from("families").update(payload).eq("id", id);
  } else {
    await supabase.from("families").insert(payload);
  }

  revalidatePath("/admin/familles");
  revalidatePath("/catalogue");
  redirect("/admin/familles?ok=" + (id ? "modifie" : "cree"));
}

export async function saveCategory(formData: FormData) {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const familyId = String(formData.get("family_id") ?? "");

  const parsed = taxonomySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || "",
    position: formData.get("position"),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success || !familyId) redirect("/admin/categories?erreur=validation");

  const payload = {
    family_id: familyId,
    name: parsed.data.name,
    slug: parsed.data.slug?.trim() || slugify(parsed.data.name),
    description: parsed.data.description || null,
    position: parsed.data.position,
    is_active: parsed.data.is_active ?? true,
  };

  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);

  revalidatePath("/admin/categories");
  redirect("/admin/categories?ok=" + (id ? "modifie" : "cree"));
}

export async function saveSubcategory(formData: FormData) {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;
  const categoryId = String(formData.get("category_id") ?? "");
  const fieldSetId = String(formData.get("field_set_id") ?? "").trim() || null;

  const parsed = taxonomySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || "",
    position: formData.get("position"),
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success || !categoryId) redirect("/admin/sous-categories?erreur=validation");

  const payload = {
    category_id: categoryId,
    field_set_id: fieldSetId,
    name: parsed.data.name,
    slug: parsed.data.slug?.trim() || slugify(parsed.data.name),
    description: parsed.data.description || null,
    position: parsed.data.position,
    is_active: parsed.data.is_active ?? true,
  };

  if (id) await supabase.from("subcategories").update(payload).eq("id", id);
  else await supabase.from("subcategories").insert(payload);

  revalidatePath("/admin/sous-categories");
  redirect("/admin/sous-categories?ok=" + (id ? "modifie" : "cree"));
}

export async function saveSupplier(formData: FormData) {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    contact_email: String(formData.get("contact_email") ?? "").trim() || null,
    contact_phone: String(formData.get("contact_phone") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on",
  };

  if (!payload.name) redirect("/admin/fournisseurs?erreur=validation");

  if (id) await supabase.from("suppliers").update(payload).eq("id", id);
  else await supabase.from("suppliers").insert(payload);

  revalidatePath("/admin/fournisseurs");
  redirect("/admin/fournisseurs?ok=" + (id ? "modifie" : "cree"));
}

export async function updateUserRole(formData: FormData) {
  await assertAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;

  if (!["customer", "staff", "admin", "designer"].includes(role)) {
    redirect("/admin/utilisateurs?erreur=validation");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("user_profiles").update({ role }).eq("id", userId);
  if (error) redirect(`/admin/utilisateurs?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs?ok=role");
}

export async function saveService(formData: FormData) {
  await assertAdmin();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/services?erreur=validation");

  const payload = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    base_price: Number(formData.get("base_price")) || null,
    price_note: String(formData.get("price_note") ?? "").trim() || null,
    delivery_time: String(formData.get("delivery_time") ?? "").trim() || null,
    position: Number(formData.get("position")) || 0,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  if (id) await supabase.from("services").update(payload).eq("id", id);
  else await supabase.from("services").insert(payload);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services?ok=" + (id ? "modifie" : "cree"));
}
