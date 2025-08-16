import { Metadata } from 'next'
import { type Locale } from '../../../i18n.config'

// SEO Translation Structure
export interface SEOTranslations {
  organization: {
    name: string
    alternateName: string
    description: string
    founder: {
      name: string
      alternateName: string
      jobTitle: string
      description: string
      skills: string[]
    }
    services: Array<{
      name: string
      description: string
    }>
  }
  pages: {
    home: PageSEO
    about: PageSEO
    services: PageSEO
    contact: PageSEO
    privacy: PageSEO
  }
}

export interface PageSEO {
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
  openGraph: {
    title: string
    description: string
    imageAlt: string
  }
  schemas: {
    webpage: {
      name: string
      description: string
    }
    aboutPage?: {
      name: string
      description: string
    }
    breadcrumb: Record<string, string>
  }
}

// Builder Function Parameters
export interface MetadataBuilderParams {
  locale: Locale
  pathname: string
  page: keyof SEOTranslations['pages']
  seoData: SEOTranslations
}

export interface SchemaBuilderParams {
  locale: Locale
  pathname: string
  page: keyof SEOTranslations['pages']
  seoData: SEOTranslations
  baseURL?: string
}

// Schema Types
export interface WebPageSchema {
  '@context': string
  '@type': 'WebPage'
  '@id': string
  url: string
  name: string
  isPartOf?: { '@id': string }
  about?: { '@id': string }
  description: string
  breadcrumb: { '@id': string }
  inLanguage: string
  potentialAction?: Array<{
    '@type': string
    target: string[]
  }>
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': 'BreadcrumbList'
  '@id': string
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export interface PersonSchema {
  '@context': string
  '@type': 'Person'
  '@id': string
  name: string
  givenName: string
  familyName: string
  alternateName: string
  jobTitle: string
  description: string
  worksFor: {
    '@type': 'Organization'
    '@id': string
    name: string
  }
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  nationality: {
    '@type': 'Country'
    name: string
  }
  knowsLanguage: Array<{
    '@type': 'Language'
    name: string
    alternateName: string
  }>
  alumniOf: {
    '@type': 'CollegeOrUniversity'
    name: string
    sameAs: string
  }
  hasOccupation: {
    '@type': 'Occupation'
    name: string
    occupationLocation: {
      '@type': 'Country'
      name: string
    }
    skills: string[]
  }
  inLanguage: string
}

export interface AboutPageSchema {
  '@context': string
  '@type': 'AboutPage'
  '@id': string
  mainEntity: { '@id': string }
  url: string
  name: string
  description: string
  inLanguage: string
}

export interface OrganizationSchema {
  '@context': string
  '@type': 'Organization'
  '@id': string
  name: string
  alternateName?: string
  url: string
  logo?: {
    '@type': 'ImageObject'
    url: string
  }
  description: string
  founder: {
    '@type': 'Person'
    '@id': string
    name: string
  }
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  areaServed: Array<{
    '@type': 'Country'
    name: string
  }>
  hasOfferCatalog?: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: Array<{
      '@type': 'Offer'
      itemOffered: {
        '@type': 'Service'
        name: string
        description: string
      }
    }>
  }
  inLanguage: string
}

export type StructuredDataSchema = WebPageSchema | BreadcrumbSchema | PersonSchema | AboutPageSchema | OrganizationSchema

// Enhanced Metadata Interface
export interface EnhancedMetadata extends Metadata {
  structuredData?: StructuredDataSchema[]
}