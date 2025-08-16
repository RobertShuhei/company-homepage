import { Metadata } from 'next'
import { type MetadataBuilderParams } from './types'
import { generateHreflangLinks, addLocaleToPathname } from '../i18n'

// Base URL for the site
const BASE_URL = 'https://global-genex.com'

// Common metadata that doesn't change by locale
const commonMetadata = {
  authors: [{ name: "Global Genex Inc.", url: BASE_URL }],
  creator: "Global Genex Inc.",
  publisher: "Global Genex Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
}

/**
 * Build comprehensive metadata for a page using SEO translations
 * @param params - Parameters for building metadata
 * @returns Promise resolving to Next.js Metadata object
 */
export async function buildMetadata({
  locale,
  pathname,
  page,
  seoData
}: MetadataBuilderParams): Promise<Metadata> {
  // Generate hreflang links for alternate language versions
  const hreflangLinks = generateHreflangLinks(pathname)
  
  // Get the canonical URL
  const canonicalUrl = `${BASE_URL}${addLocaleToPathname(pathname, locale)}`
  
  // Get page-specific SEO data
  const pageSEO = seoData.pages[page]
  
  // Determine OpenGraph image based on page
  const ogImage = getOpenGraphImage(page)
  
  return {
    metadataBase: new URL(BASE_URL),
    title: pageSEO.metadata.title,
    description: pageSEO.metadata.description,
    keywords: pageSEO.metadata.keywords,
    ...commonMetadata,
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangLinks.reduce((acc, link) => {
        acc[link.hrefLang] = link.href
        return acc
      }, {} as Record<string, string>),
    },
    openGraph: {
      type: "website",
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      url: canonicalUrl,
      title: pageSEO.openGraph.title,
      description: pageSEO.openGraph.description,
      siteName: seoData.organization.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageSEO.openGraph.imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageSEO.openGraph.title,
      description: pageSEO.openGraph.description,
      images: [ogImage],
      creator: "@globalgenex",
      site: "@globalgenex",
    },
  }
}

/**
 * Get the appropriate OpenGraph image for a page
 * @param page - The page identifier
 * @returns The OpenGraph image URL
 */
function getOpenGraphImage(page: string): string {
  const imageMap: Record<string, string> = {
    home: '/og-homepage.png',
    about: '/og-about.png',
    services: '/og-services.png',
    contact: '/og-contact.png',
    privacy: '/og-privacy.png'
  }
  
  return imageMap[page] || '/og-image.png'
}

/**
 * Build metadata with enhanced error handling and fallbacks
 * @param params - Parameters for building metadata
 * @returns Promise resolving to Next.js Metadata object
 */
export async function buildMetadataWithFallback({
  locale,
  pathname,
  page,
  seoData
}: MetadataBuilderParams): Promise<Metadata> {
  try {
    return await buildMetadata({ locale, pathname, page, seoData })
  } catch (error) {
    console.error(`Failed to build metadata for page ${page} in locale ${locale}:`, error)
    
    // Return basic fallback metadata
    const companyName = locale === 'ja' ? '株式会社グローバルジェネックス' : 'Global Genex Inc.'
    const canonicalUrl = `${BASE_URL}${addLocaleToPathname(pathname, locale)}`
    
    return {
      metadataBase: new URL(BASE_URL),
      title: `${companyName} - ${page}`,
      description: `${companyName} ${page} page`,
      ...commonMetadata,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        locale: locale === 'ja' ? 'ja_JP' : 'en_US',
        url: canonicalUrl,
        title: `${companyName} - ${page}`,
        description: `${companyName} ${page} page`,
        siteName: companyName,
      },
    }
  }
}