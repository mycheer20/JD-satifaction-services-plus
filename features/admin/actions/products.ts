"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertStaff } from "@/features/auth/guards";
import { getFieldDefinitionsForSubcategory } from "@/features/catalog/queries";
import { parseDynamicFields } from "@/features/fields/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { resolveImageMime } from "@/lib/uploads/resolve-image-mime";
import { slugify } from "@/lib/utils";
import { publicEnv } from "@/lib/public-env";
import type { ProductStatus } from "@/types/database";

const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(100).optional(),
  subcategory_id: z.string().uuid(),
  brand_id: z.string().uuid().optional().or(z.literal("")),
  short_description: z.string().trim().max(500).optional(),
  description: z.string().trim().max(20000).optional(),
  model: z.string().trim().max(120).optional(),
  sku: z.string().trim().max(80).optional(),
  price: z.coerce.number().min(0),
  sale_price: z.coerce.number().min(0).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0).default(0),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  status: z.enum(["draft", "active", "archived"]),
  tags: z.string().trim().optional(),
});

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
}

/** Avoids products_slug_key violations by suffixing -2, -3, … when needed. */
async function ensureUniqueProductSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseSlug: string,
  excludeId?: string | null,
): Promise<string> {
  const normalized = baseSlug.slice(0, 80) || "produit";

  async function isAvailable(slug: string): Promise<boolean> {
    const { data } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) return true;
    return excludeId != null && data.id === excludeId;
  }

  if (await isAvailable(normalized)) return normalized;

  for (let suffix = 2; suffix <= 99; suffix++) {
    const candidate = `${normalized}-${suffix}`.slice(0, 80);
    if (await isAvailable(candidate)) return candidate;
  }

  return `${normalized.slice(0, 70)}-${Date.now().toString(36)}`.slice(0, 80);
}

export async function saveProduct(formData: FormData) {
  const user = await assertStaff();
  const supabase = await createSupabaseServerClient();
  const id = String(formData.get("id") ?? "").trim() || null;

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    subcategory_id: formData.get("subcategory_id"),
    brand_id: formData.get("brand_id") || "",
    short_description: formData.get("short_description") || "",
    description: formData.get("description") || "",
    model: formData.get("model") || "",
    sku: formData.get("sku") || "",
    price: formData.get("price"),
    sale_price: formData.get("sale_price") || "",
    stock: formData.get("stock"),
    low_stock_threshold: formData.get("low_stock_threshold"),
    status: formData.get("status"),
    tags: formData.get("tags") || "",
  });

  const isFeatured = formData.get("is_featured") === "on";
  const trackInventory = formData.get("track_inventory") === "on";

  if (!parsed.success) {
    const dest = id ? `/admin/produits/${id}` : "/admin/produits/nouveau";
    redirect(`${dest}?erreur=validation`);
  }

  const data = parsed.data;
  let productId = id;
  const requestedSlug = data.slug?.trim() || slugify(data.name);
  const slug = await ensureUniqueProductSlug(supabase, requestedSlug, productId);
  const tags = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const payload = {
    subcategory_id: data.subcategory_id,
    brand_id: data.brand_id || null,
    slug,
    name: data.name,
    short_description: data.short_description || null,
    description: data.description || null,
    model: data.model || null,
    sku: data.sku || null,
    price: data.price,
    sale_price: data.sale_price === "" || data.sale_price === undefined ? null : data.sale_price,
    stock: data.stock,
    low_stock_threshold: data.low_stock_threshold,
    status: data.status as ProductStatus,
    is_featured: isFeatured,
    track_inventory: trackInventory,
    tags,
    currency: publicEnv.currency,
    created_by: user.id,
  };

  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) redirect(`/admin/produits/${productId}?erreur=${encodeURIComponent(error.message)}`);
  } else {
    const { data: created, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();

    if (error) redirect(`/admin/produits/nouveau?erreur=${encodeURIComponent(error.message)}`);
    productId = created.id;
  }

  const definitions = await getFieldDefinitionsForSubcategory(data.subcategory_id);
  const { values, errors } = parseDynamicFields(definitions, formData, "attr.");

  if (Object.keys(errors).length > 0) {
    redirect(`/admin/produits/${productId}?erreur=validation`);
  }

  await supabase.from("product_attributes").delete().eq("product_id", productId);

  if (values.length > 0) {
    const { error: attrError } = await supabase.from("product_attributes").insert(
      values.map((v) => ({
        product_id: productId!,
        field_key: v.field_key,
        value_text: v.value_text,
        value_number: v.value_number,
        value_boolean: v.value_boolean,
        value_json: v.value_json,
      })),
    );
    if (attrError) {
      redirect(`/admin/produits/${productId}?erreur=${encodeURIComponent(attrError.message)}`);
    }
  }

  const files = formData.getAll("images").filter((f) => f instanceof File && f.size > 0) as File[];

  if (files.length > 0) {
    const admin = createSupabaseAdminClient();
    const { count } = await supabase
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId);

    let position = count ?? 0;
    const hadNoImages = position === 0;

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;

      const storagePath = `${productId}/${Date.now()}-${sanitizeFileName(file.name)}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const mime = resolveImageMime(file, buffer);
      if (!mime) continue;

      const { error: uploadError } = await admin.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: mime,
          upsert: false,
        });

      if (uploadError) continue;

      const { data: urlData } = admin.storage.from("product-images").getPublicUrl(storagePath);

      const imagePosition = position++;
      await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: storagePath,
        url: urlData.publicUrl,
        alt_text: data.name,
        position: imagePosition,
        is_primary: hadNoImages && imagePosition === 0,
      });
    }
  }

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  revalidatePath(`/produit/${slug}`);
  redirect(`/admin/produits/${productId}?ok=modifie`);
}

export async function deleteProduct(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("id") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) redirect(`/admin/produits?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  redirect("/admin/produits?ok=supprime");
}

export async function deleteProductImage(formData: FormData) {
  await assertStaff();
  const imageId = String(formData.get("image_id") ?? "");
  const productId = String(
    formData.get("product_id") ?? formData.get("id") ?? "",
  );

  const supabase = await createSupabaseServerClient();
  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();

  if (image?.storage_path) {
    const admin = createSupabaseAdminClient();
    await admin.storage.from("product-images").remove([image.storage_path]);
  }

  await supabase.from("product_images").delete().eq("id", imageId);

  revalidatePath(`/admin/produits/${productId}`);
  redirect(`/admin/produits/${productId}?ok=modifie`);
}
