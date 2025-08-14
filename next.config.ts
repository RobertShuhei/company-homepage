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
  
  // SEO-optimized redirects for common URL patterns
  async redirects() {
    return [
      // Legacy URLs to new structure
      {
        source: '/about-us',
        destination: '/about',
        permanent: true, // 301 redirect
      },
      {
        source: '/about-me',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/company',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/business',
        permanent: true,
      },
      {
        source: '/solutions',
        destination: '/business',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/get-in-touch',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/privacy',
        permanent: true,
      },
      // Handle common variations
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Remove trailing slashes for consistency (except root)
      {
        source: '/((?!$).*?)/',
        destination: '/$1',
        permanent: true,
      },
      // Handle old Corporate Solutions branding
      {
        source: '/corporate-solutions',
        destination: '/',
        permanent: true,
      },
      {
        source: '/corporate',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;