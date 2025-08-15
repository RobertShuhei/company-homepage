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
        source: '/business',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/solutions',
        destination: '/services',
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
          // Security Headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy for enhanced security
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://company-contact-api-production.global-genex.workers.dev",
              "frame-ancestors 'none'",
              "connect-src 'self' https://company-contact-api-production.global-genex.workers.dev https://www.google-analytics.com https://region1.google-analytics.com https://cloudflareinsights.com",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
          // Additional Security Headers
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // SEO and Performance Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      {
        // Cache static assets with optimized headers
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Cache HTML pages with shorter duration
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=31536000',
          },
        ],
      },
      {
        // Specific headers for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        // Favicon and manifest specific caching
        source: '/(favicon\\.ico|site\\.webmanifest|robots\\.txt|sitemap\\.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 24 hours
          },
        ],
      },
    ];
  },
};

export default nextConfig;