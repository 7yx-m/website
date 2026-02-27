import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactCompiler: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
