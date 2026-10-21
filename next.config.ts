import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      '@solana/kit': 'commonjs @solana/kit',
      '@solana-program/memo': 'commonjs @solana-program/memo',
      '@solana-program/system': 'commonjs @solana-program/system',
      '@solana-program/token': 'commonjs @solana-program/token',
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
