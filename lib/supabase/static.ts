import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Anonymous, cookie-free client for build-time reads.
 *
 * `generateStaticParams` runs without an HTTP request, so `cookies()` is
 * unavailable there and `createSupabaseServerClient()` cannot be used. This
 * client sees exactly what a signed-out visitor sees, which is all a list of
 * public slugs needs.
 */
export function createSupabaseStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without credentials at build time the caller falls back to rendering on
  // demand, so a missing variable degrades the build instead of breaking it.
  if (!url || !anonKey) return null;

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
