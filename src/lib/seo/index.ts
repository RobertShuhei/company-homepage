// Export types
export type {
  SEOTranslations,
  PageSEO,
  MetadataBuilderParams,
  SchemaBuilderParams,
  WebPageSchema,
  BreadcrumbSchema,
  PersonSchema,
  AboutPageSchema,
  OrganizationSchema,
  StructuredDataSchema,
  EnhancedMetadata
} from './types'

// Export utility functions
export {
  loadSEOTranslations,
  generateBaseKeywords,
  extractNames,
  clearSEOTranslationCache
} from './utils'

// Export metadata builder functions
export {
  buildMetadata,
  buildMetadataWithFallback
} from './buildMetadata'

// Export schema builder functions
export {
  buildSchemas,
  buildSchemasWithFallback,
  schemasToJsonLD
} from './buildSchemas'

// Convenience function to build both metadata and schemas
import { Metadata } from 'next'
import { type Locale } from '../../../i18n.config'
import { loadSEOTranslations } from './utils'
import { buildMetadata } from './buildMetadata'
import { buildSchemas, schemasToJsonLD } from './buildSchemas'
import { type SEOTranslations, type StructuredDataSchema } from './types'

/**
 * Build comprehensive SEO data (metadata + structured data) for a page
 * @param locale - The locale
 * @param pathname - The pathname
 * @param page - The page identifier
 * @returns Object containing metadata and structured data
 */
export async function buildComprehensiveSEO({
  locale,
  pathname,
  page
}: {
  locale: Locale
  pathname: string
  page: keyof SEOTranslations['pages']
}): Promise<{
  metadata: Metadata
  structuredData: StructuredDataSchema[]
  jsonLD: string
}> {
  // Load SEO translations
  const seoData = await loadSEOTranslations(locale)
  
  // Build metadata
  const metadata = await buildMetadata({
    locale,
    pathname,
    page,
    seoData
  })
  
  // Build structured data schemas
  const structuredData = buildSchemas({
    locale,
    pathname,
    page,
    seoData
  })
  
  // Convert to JSON-LD string
  const jsonLD = schemasToJsonLD(structuredData)
  
  return {
    metadata,
    structuredData,
    jsonLD
  }
}