import type { NextConfig } from "next";

/**
 * Product images are served from Supabase Storage, so the project's hostname
 * has to be allowed for `next/image`. It is derived from the same environment
 * variable the Supabase client uses, which keeps the two from drifting apart.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/**" }]
      : [],
  },
};

export default nextConfig;
