"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "./guards";
import { publicEnv } from "@/lib/public-env";

export interface AuthState {
  status: "idle" | "error" | "success";
  message?: string;
}

const credentials = z.object({
  email: z.string().trim().email("Adresse e-mail invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

/**
 * `next` decides where to land after signing in. Only same-origin relative
 * paths are honoured, so a crafted link cannot bounce a freshly authenticated
 * visitor to another site.
 */
function safeRedirect(value: FormDataEntryValue | null, fallback: string): string {
  const raw = typeof value === "string" ? value : "";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export async function signIn(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Deliberately vague: distinguishing "unknown e-mail" from "wrong password"
    // would let an attacker enumerate accounts.
    return { status: "error", message: "Identifiants incorrects." };
  }

  redirect(safeRedirect(formData.get("next"), "/compte"));
}

export async function signUp(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const schema = credentials.extend({
    fullName: z.string().trim().min(2, "Le nom est requis.").max(120),
    phone: z.string().trim().max(40).optional().default(""),
  });

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();

  // The role is never taken from this payload: the database trigger always
  // creates the profile as 'customer'.
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
      emailRedirectTo: `${publicEnv.siteUrl}/compte`,
    },
  });

  if (error) return { status: "error", message: error.message };

  redirect("/compte");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!z.string().email().safeParse(email).success) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${publicEnv.siteUrl}/compte/mot-de-passe`,
  });

  // The same confirmation is returned whether or not the address exists.
  return {
    status: "success",
    message:
      "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.",
  };
}

export async function updateProfile(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await requireUser();

  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Le nom est requis.").max(120),
      phone: z.string().trim().max(40),
      addressLine1: z.string().trim().max(400),
      city: z.string().trim().max(120),
      region: z.string().trim().max(120),
      postalCode: z.string().trim().max(20),
    })
    .safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone") ?? "",
      addressLine1: formData.get("addressLine1") ?? "",
      city: formData.get("city") ?? "",
      region: formData.get("region") ?? "",
      postalCode: formData.get("postalCode") ?? "",
    });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();

  // `role` is intentionally absent from this update, and a database trigger
  // rejects any attempt to change it from a non-admin session.
  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      address: {
        line1: parsed.data.addressLine1,
        city: parsed.data.city,
        region: parsed.data.region,
        postal_code: parsed.data.postalCode,
      },
    })
    .eq("id", user.id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/compte");
  return { status: "success", message: "Profil mis à jour." };
}
