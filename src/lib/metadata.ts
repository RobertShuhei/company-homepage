import { Metadata } from 'next'
import { type Locale, generateHreflangLinks, addLocaleToPathname, type Translations } from './i18n'
import { getServerTranslations } from './translations'

interface MetadataParams {
  locale: Locale
  pathname: string
  page?: 'home' | 'about' | 'services' | 'contact' | 'privacy'
}

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

// Generate localized metadata
export async function generateLocalizedMetadata({
  locale,
  pathname,
  page = 'home'
}: MetadataParams): Promise<Metadata> {
  const translations = await getServerTranslations(locale)
  const hreflangLinks = generateHreflangLinks(pathname)
  
  // Get the canonical URL
  const canonicalUrl = `${BASE_URL}${addLocaleToPathname(pathname, locale)}`
  
  // Get page-specific metadata
  const pageMetadata = getPageMetadata(translations, page, locale)
  
  return {
    metadataBase: new URL(BASE_URL),
    title: pageMetadata.title,
    description: pageMetadata.description,
    keywords: pageMetadata.keywords,
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
      title: pageMetadata.openGraph.title,
      description: pageMetadata.openGraph.description,
      siteName: locale === 'ja' ? '株式会社グローバルジェネックス' : 'Global Genex Inc.',
      images: [
        {
          url: pageMetadata.openGraph.image,
          width: 1200,
          height: 630,
          alt: pageMetadata.openGraph.imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageMetadata.twitter.title,
      description: pageMetadata.twitter.description,
      images: [pageMetadata.twitter.image],
      creator: "@globalgenex",
      site: "@globalgenex",
    },
  }
}

// Get page-specific metadata content
function getPageMetadata(translations: Translations, page: string, locale: Locale) {
  const baseKeywords = [
    locale === 'ja' ? 'グローバルジェネックス' : 'Global Genex',
    locale === 'ja' ? '日本市場参入' : 'Japan market entry',
    locale === 'ja' ? '越境コンサルティング' : 'cross-border consulting',
    locale === 'ja' ? '製造業コンサルティング' : 'manufacturing consulting',
    locale === 'ja' ? '小売コンサルティング' : 'retail consulting',
    locale === 'ja' ? 'AIコンサルティング' : 'AI consulting',
    locale === 'ja' ? 'データ分析' : 'data analytics',
    locale === 'ja' ? 'デジタル変革' : 'digital transformation',
    locale === 'ja' ? 'DXコンサルティング' : 'DX consulting',
    locale === 'ja' ? '福岡コンサルティング' : 'Fukuoka consulting',
    locale === 'ja' ? 'バイリンガルコンサルタント' : 'bilingual consultant',
    locale === 'ja' ? '日本ビジネスコンサルタント' : 'Japan business consultant',
  ]

  switch (page) {
    case 'home':
      return {
        title: translations.homepage?.meta?.title || translations.homepage?.hero?.title || 'Global Genex Inc.',
        description: translations.homepage?.meta?.description || translations.homepage?.hero?.description || '',
        keywords: baseKeywords,
        openGraph: {
          title: translations.homepage?.hero?.title || 'Global Genex Inc.',
          description: translations.homepage?.hero?.description || '',
          image: '/og-homepage.png',
          imageAlt: 'Global Genex Inc. - Professional Business Consulting Services',
        },
        twitter: {
          title: translations.homepage?.hero?.title || 'Global Genex Inc.',
          description: translations.homepage?.hero?.description || '',
          image: '/og-homepage.png',
        },
      }

    case 'about':
      return {
        title: translations.about?.meta?.title || translations.about?.hero?.title || 'About Us',
        description: translations.about?.meta?.description || translations.about?.hero?.description || '',
        keywords: [...baseKeywords, 
          locale === 'ja' ? '代表者' : 'founder',
          locale === 'ja' ? '経歴' : 'background',
          locale === 'ja' ? '実績' : 'experience'
        ],
        openGraph: {
          title: translations.about?.hero?.title || 'About Us',
          description: translations.about?.hero?.description || '',
          image: '/og-about.png',
          imageAlt: 'About Global Genex Inc.',
        },
        twitter: {
          title: translations.about?.hero?.title || 'About Us',
          description: translations.about?.hero?.description || '',
          image: '/og-about.png',
        },
      }

    case 'services':
      return {
        title: translations.services?.meta?.title || translations.services?.hero?.title || 'Services',
        description: translations.services?.meta?.description || translations.services?.hero?.description || '',
        keywords: [...baseKeywords,
          locale === 'ja' ? '製造業' : 'manufacturing',
          locale === 'ja' ? 'ITシステム開発' : 'IT system development',
          locale === 'ja' ? '市場開拓' : 'market development'
        ],
        openGraph: {
          title: translations.services?.hero?.title || 'Services',
          description: translations.services?.hero?.description || '',
          image: '/og-services.png',
          imageAlt: 'Global Genex Inc. Services',
        },
        twitter: {
          title: translations.services?.hero?.title || 'Services',
          description: translations.services?.hero?.description || '',
          image: '/og-services.png',
        },
      }

    case 'contact':
      return {
        title: translations.contact?.meta?.title || translations.contact?.hero?.title || 'Contact Us',
        description: translations.contact?.meta?.description || translations.contact?.hero?.description || '',
        keywords: [...baseKeywords,
          locale === 'ja' ? 'お問い合わせ' : 'contact',
          locale === 'ja' ? '相談' : 'consultation',
          locale === 'ja' ? '連絡先' : 'contact information'
        ],
        openGraph: {
          title: translations.contact?.hero?.title || 'Contact Us',
          description: translations.contact?.hero?.description || '',
          image: '/og-contact.png',
          imageAlt: 'Contact Global Genex Inc.',
        },
        twitter: {
          title: translations.contact?.hero?.title || 'Contact Us',
          description: translations.contact?.hero?.description || '',
          image: '/og-contact.png',
        },
      }

    case 'privacy':
      return {
        title: translations.privacy?.meta?.title || translations.privacy?.title || 'Privacy Policy',
        description: translations.privacy?.meta?.description || 'Our privacy policy and data protection practices.',
        keywords: [...baseKeywords,
          locale === 'ja' ? 'プライバシーポリシー' : 'privacy policy',
          locale === 'ja' ? '個人情報保護' : 'data protection',
          locale === 'ja' ? '利用規約' : 'terms of service'
        ],
        openGraph: {
          title: translations.privacy?.title || 'Privacy Policy',
          description: translations.privacy?.meta?.description || 'Our privacy policy and data protection practices.',
          image: '/og-privacy.png',
          imageAlt: 'Global Genex Inc. Privacy Policy',
        },
        twitter: {
          title: translations.privacy?.title || 'Privacy Policy',
          description: translations.privacy?.meta?.description || 'Our privacy policy and data protection practices.',
          image: '/og-privacy.png',
        },
      }

    default:
      return {
        title: 'Global Genex Inc.',
        description: 'Expert consulting for retail & manufacturing companies.',
        keywords: baseKeywords,
        openGraph: {
          title: 'Global Genex Inc.',
          description: 'Expert consulting for retail & manufacturing companies.',
          image: '/og-image.png',
          imageAlt: 'Global Genex Inc.',
        },
        twitter: {
          title: 'Global Genex Inc.',
          description: 'Expert consulting for retail & manufacturing companies.',
          image: '/og-image.png',
        },
      }
  }
}