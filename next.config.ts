import type { NextConfig } from "next";

/**
 * Product images are served from Supabase Storage, so the project's hostname
 * has to be allowed for `next/image`. It is derived from the same environment
 * variable the Supabase client uses, which keeps the two from drifting apart.
 */
function supabaseImageHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseImageHost();

const nextConfig: NextConfig = {
  // Les Server Actions acceptent par défaut 1 Mo — insuffisant pour les photos JPG.
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/**" }]
      : [],
  },
};

export default nextConfig;
