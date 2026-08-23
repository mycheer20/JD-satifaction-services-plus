/**
 * Environment values that are safe to inline in the client bundle.
 * Never add a secret here — only `NEXT_PUBLIC_*` variables belong in this file.
 */
const DEFAULT_STORE_NAME = "JDSATISFACTION SERVICES PLUS";

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  storeName: process.env.NEXT_PUBLIC_STORE_NAME ?? DEFAULT_STORE_NAME,
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "HTG",
};

export function storeLogoInitial(name = publicEnv.storeName): string {
  const trimmed = name.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "?";
}
