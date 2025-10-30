import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Do not block Vercel builds on ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do not block Vercel builds on TS errors
    ignoreBuildErrors: true,
  },
  images: {
    // We are using raw <img> and maybe remote images without domains set.
    // Turning this on avoids Next/Image domain warnings killing the build.
    unoptimized: true,
  },
};

export default nextConfig;
