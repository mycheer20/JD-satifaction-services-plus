"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertStaff } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const brandSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  slug: z.string().trim().max(80).optional(),
  logo_url: z.string().trim().url().optional().or(z.literal("")),
});

export async function saveBrand(formData: FormData) {
  await assertStaff();
  const supabase = await createSupabaseServerClient();

  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    logo_url: formData.get("logo_url") || "",
  });

  if (!parsed.success) {
    redirect("/admin/marques?erreur=validation");
  }

  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
  const payload = {
    name: parsed.data.name,
    slug,
    logo_url: parsed.data.logo_url || null,
  };

  if (id) {
    const { error } = await supabase.from("brands").update(payload).eq("id", id);
    if (error) redirect(`/admin/marques?erreur=${encodeURIComponent(error.message)}`);
    revalidatePath("/admin/marques");
    redirect("/admin/marques?ok=modifie");
  }

  const { error } = await supabase.from("brands").insert(payload);
  if (error) redirect(`/admin/marques?erreur=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/marques");
  redirect("/admin/marques?ok=cree");
}

export async function deleteBrand(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) redirect(`/admin/marques?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/marques");
  redirect("/admin/marques?ok=supprime");
}
