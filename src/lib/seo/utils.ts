import { type Locale } from '../../../i18n.config'
import { type SEOTranslations } from './types'
import { promises as fs } from 'fs'
import path from 'path'

// Cache for SEO translations
const seoTranslationCache = new Map<Locale, SEOTranslations>()

/**
 * Load SEO translations for a specific locale
 * @param locale - The locale to load translations for
 * @returns Promise resolving to SEO translations
 */
export async function loadSEOTranslations(locale: Locale): Promise<SEOTranslations> {
  // Check cache first
  if (seoTranslationCache.has(locale)) {
    return seoTranslationCache.get(locale)!
  }

  try {
    // Build path to SEO translation file
    const seoFilePath = path.join(process.cwd(), 'src', 'locales', locale, 'seo.json')
    
    // Read and parse the file
    const fileContent = await fs.readFile(seoFilePath, 'utf-8')
    const seoTranslations: SEOTranslations = JSON.parse(fileContent)
    
    // Cache the translations
    seoTranslationCache.set(locale, seoTranslations)
    
    return seoTranslations
  } catch (error) {
    console.error(`Failed to load SEO translations for locale ${locale}:`, error)
    
    // Fallback to default structure if file doesn't exist
    const fallbackTranslations: SEOTranslations = {
      organization: {
        name: locale === 'ja' ? '株式会社グローバルジェネックス' : 'Global Genex Inc.',
        alternateName: locale === 'ja' ? 'Global Genex Inc.' : '株式会社グローバルジェネックス',
        description: 'Professional consulting services',
        founder: {
          name: locale === 'ja' ? '中原 修平' : 'Shuhei Nakahara',
          alternateName: locale === 'ja' ? 'Shuhei Nakahara' : '中原 修平',
          jobTitle: locale === 'ja' ? '代表取締役' : 'Representative Director',
          description: 'Professional consultant',
          skills: []
        },
        services: []
      },
      pages: {
        home: createFallbackPageSEO(locale, 'home'),
        about: createFallbackPageSEO(locale, 'about'),
        services: createFallbackPageSEO(locale, 'services'),
        contact: createFallbackPageSEO(locale, 'contact'),
        privacy: createFallbackPageSEO(locale, 'privacy')
      }
    }
    
    return fallbackTranslations
  }
}

/**
 * Create fallback page SEO data
 * @param locale - The locale
 * @param page - The page type
 * @returns Fallback page SEO data
 */
function createFallbackPageSEO(locale: Locale, page: string) {
  const companyName = locale === 'ja' ? '株式会社グローバルジェネックス' : 'Global Genex Inc.'
  
  return {
    metadata: {
      title: `${companyName} - ${page}`,
      description: `${companyName} ${page} page`,
      keywords: [companyName, page]
    },
    openGraph: {
      title: `${companyName} - ${page}`,
      description: `${companyName} ${page} page`,
      imageAlt: `${companyName} ${page}`
    },
    schemas: {
      webpage: {
        name: `${companyName} - ${page}`,
        description: `${companyName} ${page} page`
      },
      breadcrumb: {
        home: locale === 'ja' ? 'ホーム' : 'Home',
        [page]: page
      }
    }
  }
}

/**
 * Generate base keywords for SEO
 * @param locale - The locale
 * @returns Array of base keywords
 */
export function generateBaseKeywords(locale: Locale): string[] {
  return [
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
    locale === 'ja' ? '日本ビジネスコンサルタント' : 'Japan business consultant'
  ]
}

/**
 * Extract first and family names from full name
 * @param fullName - The full name
 * @param locale - The locale to determine name order
 * @returns Object with givenName and familyName
 */
export function extractNames(fullName: string, locale: Locale): { givenName: string; familyName: string } {
  const parts = fullName.trim().split(' ')
  
  if (locale === 'ja') {
    // Japanese: Family name first, given name last
    return {
      familyName: parts[0] || '',
      givenName: parts.slice(1).join(' ') || ''
    }
  } else {
    // English: Given name first, family name last
    return {
      givenName: parts[0] || '',
      familyName: parts.slice(1).join(' ') || ''
    }
  }
}

/**
 * Clear the SEO translation cache (useful for development/testing)
 */
export function clearSEOTranslationCache(): void {
  seoTranslationCache.clear()
}