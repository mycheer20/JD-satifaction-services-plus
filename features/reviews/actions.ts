"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/features/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ReviewState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.coerce.number().int().min(1, "Choisissez une note.").max(5),
  title: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().min(10, "Votre avis doit contenir au moins 10 caractères.").max(2000),
});

export async function submitReview(
  _previous: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const user = await getSessionUser();
  if (!user) {
    return { status: "error", message: "Connectez-vous pour laisser un avis." };
  }

  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    title: formData.get("title") ?? "",
    body: formData.get("body"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Merci de corriger les champs signalés.",
      fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, slug")
    .eq("id", parsed.data.productId)
    .eq("status", "active")
    .maybeSingle();

  if (!product) {
    return { status: "error", message: "Produit introuvable." };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: parsed.data.productId,
    user_id: user.id,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    body: parsed.data.body,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "Vous avez déjà laissé un avis sur ce produit.",
      };
    }
    return { status: "error", message: error.message };
  }

  revalidatePath(`/produit/${product.slug}`);
  return {
    status: "success",
    message: "Merci ! Votre avis sera visible après modération.",
  };
}
