import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to succeed even if there are lint errors.
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
