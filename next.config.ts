import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude the worker directory from Next.js processing
  outputFileTracingExcludes: {
    '*': ['./worker/**/*'],
  },
  webpack: (config, { isServer }) => {
    // Ignore the worker directory completely
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/worker/**', '**/node_modules/**'],
    };
    
    return config;
  },
};

export default nextConfig;