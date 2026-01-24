import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile @stacks packages for proper SSR support
  transpilePackages: [
    '@stacks/connect',
    '@stacks/network',
    '@stacks/transactions',
    '@stacks/auth',
    '@stacks/encryption',
    '@stacks/profile',
    '@stacks/storage',
    '@stacks/common',
  ],
  // Empty turbopack config to silence warnings
  turbopack: {},
};

export default nextConfig;
