/**
 * Environment values that are safe to inline in the client bundle.
 * Never add a secret here — only `NEXT_PUBLIC_*` variables belong in this file.
 */
const DEFAULT_STORE_NAME = "JDSATISFACTION SERVICES PLUS";

/** Normalise l'URL du site pour metadata, auth redirects et paiements. */
export function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const candidate =
      fromEnv.startsWith("http://") || fromEnv.startsWith("https://")
        ? fromEnv
        : `https://${fromEnv}`;
    try {
      const url = new URL(candidate);
      return url.origin;
    } catch {
      // Valeur Vercel mal saisie (sans https, guillemets, etc.) — on ignore.
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: resolveSiteUrl(),
  storeName: process.env.NEXT_PUBLIC_STORE_NAME ?? DEFAULT_STORE_NAME,
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "HTG",
};

export function storeLogoInitial(name = publicEnv.storeName): string {
  const trimmed = name.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "?";
}
