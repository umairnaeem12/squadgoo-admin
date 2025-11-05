import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Skip ESLint during Vercel or production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Custom webpack config for SVG imports
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
