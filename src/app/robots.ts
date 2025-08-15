import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://global-genex.com'
  
  return {
    rules: [
      // Specific rules for Googlebot (highest priority)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/static/chunks/',
          '/worker/',
          '*.json$',
          '*?*utm_*',
          '*?*ref=*',
          '*?*fbclid=*',
        ],
        crawlDelay: 1, // 1 second delay between requests
      },
      // Specific rules for Googlebot Images
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/public/',
          '*.png',
          '*.jpg', 
          '*.jpeg',
          '*.gif',
          '*.webp',
          '*.svg',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      // Specific rules for Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/worker/',
          '*.json$',
        ],
        crawlDelay: 2, // 2 second delay for Bing
      },
      // Rules for other search engines
      {
        userAgent: ['Slurp', 'DuckDuckBot', 'YandexBot'],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/worker/',
        ],
        crawlDelay: 3,
      },
      // General rules for all other bots
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/services', 
          '/contact',
          '/privacy',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/worker/',
          '*.json$',
          '/sitemap.xml',
          '/robots.txt',
          '/*?*',  // Disallow query parameters for general bots
          '/_vercel/',
        ],
        crawlDelay: 5, // Longer delay for unknown bots
      },
      // Block malicious or unwanted bots
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot', 
          'MJ12bot',
          'DotBot',
          'SiteAuditBot',
          'CCBot',
          'GPTBot',
          'ChatGPT-User',
          'Bytespider',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}