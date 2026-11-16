import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns = supabaseUrl
  ? [new URL("/storage/v1/object/public/**", supabaseUrl)]
  : [];

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns,
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
