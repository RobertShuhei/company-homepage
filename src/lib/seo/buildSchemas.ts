import { type SchemaBuilderParams, type StructuredDataSchema, type WebPageSchema, type BreadcrumbSchema, type PersonSchema, type AboutPageSchema, type OrganizationSchema, type SEOTranslations } from './types'
import { extractNames } from './utils'

const DEFAULT_BASE_URL = 'https://global-genex.com'

/**
 * Build comprehensive structured data schemas for a page
 * @param params - Parameters for building schemas
 * @returns Array of structured data schemas
 */
export function buildSchemas({
  locale,
  pathname,
  page,
  seoData,
  baseURL = DEFAULT_BASE_URL
}: SchemaBuilderParams): StructuredDataSchema[] {
  const pageUrl = `${baseURL}${pathname === '/' ? `/${locale}` : `/${locale}${pathname}`}`
  const schemas: StructuredDataSchema[] = []

  // Always include WebPage schema
  schemas.push(buildWebPageSchema({ locale, page, seoData, pageUrl }))

  // Always include BreadcrumbList schema
  schemas.push(buildBreadcrumbSchema({ page, seoData, pageUrl }))

  // Include Organization schema for home page
  if (page === 'home') {
    schemas.push(buildOrganizationSchema({ locale, seoData, baseURL }))
  }

  // Include Person schema for about page
  if (page === 'about') {
    schemas.push(buildPersonSchema({ locale, seoData, baseURL }))
    schemas.push(buildAboutPageSchema({ locale, seoData, pageUrl }))
  }

  return schemas
}

/**
 * Build WebPage schema
 */
function buildWebPageSchema({
  locale,
  page,
  seoData,
  pageUrl
}: {
  locale: string
  page: keyof SEOTranslations['pages']
  seoData: SEOTranslations
  pageUrl: string
}): WebPageSchema {
  const pageSEO = seoData.pages[page]
  
  // Extract base URL from pageUrl
  const baseURL = pageUrl.split('/').slice(0, 3).join('') // Get https://domain.com part
  
  const schema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageSEO.schemas.webpage.name,
    description: pageSEO.schemas.webpage.description,
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`
    },
    inLanguage: locale
  }

  // Add organization reference for all pages
  schema.isPartOf = { '@id': `${baseURL}/#website` }
  schema.about = { '@id': `${baseURL}/#organization` }

  // Add potential actions
  schema.potentialAction = [
    {
      '@type': 'ReadAction',
      target: [pageUrl]
    }
  ]

  return schema
}

/**
 * Build BreadcrumbList schema
 */
function buildBreadcrumbSchema({
  page,
  seoData,
  pageUrl
}: {
  page: keyof SEOTranslations['pages']
  seoData: SEOTranslations
  pageUrl: string
}): BreadcrumbSchema {
  const breadcrumbData = seoData.pages[page].schemas.breadcrumb
  const itemListElement = []
  
  // Calculate base URL for home from pageUrl
  const baseUrl = pageUrl.replace(/\/[^/]*$/, '') || pageUrl

  // Always include home
  itemListElement.push({
    '@type': 'ListItem' as const,
    position: 1,
    name: breadcrumbData.home,
    item: baseUrl
  })

  // Add current page if not home
  if (page !== 'home') {
    itemListElement.push({
      '@type': 'ListItem' as const,
      position: 2,
      name: breadcrumbData[page] || page,
      item: pageUrl
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement
  }
}

/**
 * Build Person schema for founder
 */
function buildPersonSchema({
  locale,
  seoData,
  baseURL
}: {
  locale: string
  seoData: SEOTranslations
  baseURL: string
}): PersonSchema {
  const founder = seoData.organization.founder
  const { givenName, familyName } = extractNames(founder.name, locale as 'ja' | 'en')

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseURL}/about#shuhei-nakahara`,
    name: founder.name,
    givenName,
    familyName,
    alternateName: founder.alternateName,
    jobTitle: founder.jobTitle,
    description: founder.description,
    worksFor: {
      '@type': 'Organization',
      '@id': `${baseURL}/#organization`,
      name: seoData.organization.name
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fukuoka',
      addressRegion: 'Fukuoka Prefecture',
      addressCountry: 'JP'
    },
    nationality: {
      '@type': 'Country',
      name: 'Japan'
    },
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'Japanese',
        alternateName: 'ja'
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en'
      }
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Tokyo Institute of Technology',
      sameAs: 'https://www.titech.ac.jp/'
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: locale === 'ja' ? 'ビジネスコンサルタント' : 'Business Consultant',
      occupationLocation: {
        '@type': 'Country',
        name: 'Japan'
      },
      skills: founder.skills
    },
    inLanguage: locale
  }
}

/**
 * Build AboutPage schema
 */
function buildAboutPageSchema({
  locale,
  seoData,
  pageUrl
}: {
  locale: string
  seoData: SEOTranslations
  pageUrl: string
}): AboutPageSchema {
  const aboutPageData = seoData.pages.about.schemas.aboutPage
  
  // Extract base URL from pageUrl
  const baseURL = pageUrl.split('/').slice(0, 3).join('') // Get https://domain.com part

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${pageUrl}#aboutpage`,
    mainEntity: {
      '@id': `${baseURL}/#organization`
    },
    url: pageUrl,
    name: aboutPageData?.name || 'About',
    description: aboutPageData?.description || 'About page',
    inLanguage: locale
  }
}

/**
 * Build Organization schema
 */
function buildOrganizationSchema({
  locale,
  seoData,
  baseURL
}: {
  locale: string
  seoData: SEOTranslations
  baseURL: string
}): OrganizationSchema {
  const org = seoData.organization

  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseURL}/#organization`,
    name: org.name,
    url: baseURL,
    description: org.description,
    founder: {
      '@type': 'Person',
      '@id': `${baseURL}/about#shuhei-nakahara`,
      name: org.founder.name
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fukuoka',
      addressRegion: 'Fukuoka Prefecture',
      addressCountry: 'JP'
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Japan'
      },
      {
        '@type': 'Country',
        name: 'United States'
      }
    ],
    inLanguage: locale
  }

  // Add alternate name if different from main name
  if (org.alternateName && org.alternateName !== org.name) {
    schema.alternateName = org.alternateName
  }

  // Add logo if available
  schema.logo = {
    '@type': 'ImageObject',
    url: `${baseURL}/logo.png`
  }

  // Add services if available
  if (org.services && org.services.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: locale === 'ja' ? 'コンサルティングサービス' : 'Consulting Services',
      itemListElement: org.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description
        }
      }))
    }
  }

  return schema
}

/**
 * Convert schemas to JSON-LD string for script tag
 * @param schemas - Array of structured data schemas
 * @returns JSON-LD string ready for script tag
 */
export function schemasToJsonLD(schemas: StructuredDataSchema[]): string {
  return JSON.stringify(schemas, null, 0)
}

/**
 * Build schemas with error handling and fallbacks
 * @param params - Parameters for building schemas
 * @returns Array of structured data schemas
 */
export function buildSchemasWithFallback(params: SchemaBuilderParams): StructuredDataSchema[] {
  try {
    return buildSchemas(params)
  } catch (error) {
    console.error(`Failed to build schemas for page ${params.page} in locale ${params.locale}:`, error)
    
    // Return minimal fallback schemas
    const pageUrl = `${params.baseURL || DEFAULT_BASE_URL}${params.pathname === '/' ? `/${params.locale}` : `/${params.locale}${params.pathname}`}`
    
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${params.seoData?.organization?.name || 'Global Genex Inc.'} - ${params.page}`,
        description: `${params.seoData?.organization?.name || 'Global Genex Inc.'} ${params.page} page`,
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        inLanguage: params.locale
      }
    ]
  }
}
