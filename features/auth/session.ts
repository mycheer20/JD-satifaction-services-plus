import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  phone: string | null;
};

/**
 * Resolves the caller once per request. Layouts, pages and Server Actions can
 * all call this without triggering repeated round trips.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();

  // getUser() re-validates the JWT with Supabase. getSession() only reads the
  // cookie, which a client could have tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile?.role ?? "customer",
    fullName: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
  };
});

export function isStaff(user: SessionUser | null): boolean {
  return user?.role === "admin" || user?.role === "staff";
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "admin";
}

export function isDesigner(user: SessionUser | null): boolean {
  return user?.role === "designer";
}

/** Admin ou designer — accès au panneau Design du site. */
export function isDesignEditor(user: SessionUser | null): boolean {
  return user?.role === "admin" || user?.role === "designer";
}
