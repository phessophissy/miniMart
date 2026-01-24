import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark @stacks packages as external to prevent bundling/SSR issues
  serverExternalPackages: [
    '@stacks/connect',
    '@stacks/network',
    '@stacks/transactions',
    '@stacks/auth',
    '@stacks/encryption',
    '@stacks/profile',
    '@stacks/storage',
    '@stacks/common',
  ],
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
};

export default nextConfig;
