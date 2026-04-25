import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false, // Prevent source map exposure in production
  eslint: {
    ignoreDuringBuilds: true, // Speeds up builds, assuming linting is part of CI
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
