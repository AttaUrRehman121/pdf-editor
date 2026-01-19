import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 1. Ignore node-canvas (it's for Node.js, not browser)
    config.resolve.alias.canvas = false;

    // 2. Ensure pdfjs-dist is handled correctly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
    };

    return config;
  },
};

export default nextConfig;
