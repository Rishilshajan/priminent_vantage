import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
    middlewareClientMaxBodySize: 500 * 1024 * 1024, // 500MB in bytes
  },
};

export default nextConfig;
