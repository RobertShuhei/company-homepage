/**
 * Centralized i18n Configuration
 * This file contains all internationalization settings for the application
 */

// Supported locales configuration
export const locales = ['ja', 'en'] as const
export const defaultLocale = 'ja' as const

// Type definitions for locale handling
export type Locale = typeof locales[number]

// Cookie configuration for locale persistence
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

export interface LocaleCookieOptions {
  name: string
  maxAge: number
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path: string
}

// Cookie configuration object
export const cookieConfig: LocaleCookieOptions = {
  name: LOCALE_COOKIE_NAME,
  maxAge: LOCALE_COOKIE_MAX_AGE,
  httpOnly: false, // Allow client-side access for language switcher
  secure: process.env.NODE_ENV === 'production', // Only secure in production
  sameSite: 'lax',
  path: '/'
}

// Locale detection configuration
export interface I18nConfig {
  locales: readonly Locale[]
  defaultLocale: Locale
  localeDetection: boolean
  cookieConfig: LocaleCookieOptions
}

// Main i18n configuration object
export const i18nConfig: I18nConfig = {
  locales,
  defaultLocale,
  localeDetection: true,
  cookieConfig
} as const

// Type guard function for locale validation
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Language preference mapping for Accept-Language header parsing
export const languageMapping: Record<string, Locale> = {
  'ja': 'ja',
  'ja-JP': 'ja', 
  'ja-jp': 'ja',
  'japanese': 'ja',
  'en': 'en',
  'en-US': 'en',
  'en-us': 'en',
  'en-GB': 'en',
  'en-gb': 'en',
  'english': 'en'
} as const

// Utility function to parse Accept-Language header
export function parseAcceptLanguage(acceptLanguage: string): Locale | null {
  if (!acceptLanguage) return null
  
  // Parse Accept-Language header (format: "ja,en-US;q=0.9,en;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=')
      return {
        code: code.toLowerCase(),
        quality: qValue ? parseFloat(qValue) : 1.0
      }
    })
    .sort((a, b) => b.quality - a.quality) // Sort by quality value (preference)
  
  // Find the first supported language
  for (const { code } of languages) {
    // Check exact match first
    if (languageMapping[code]) {
      return languageMapping[code]
    }
    
    // Check language prefix (e.g., "ja" from "ja-JP")
    const langPrefix = code.split('-')[0]
    if (languageMapping[langPrefix]) {
      return languageMapping[langPrefix]
    }
  }
  
  return null
}

// Helper functions for URL manipulation
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale
  }
  
  return defaultLocale
}

export function removeLocaleFromPathname(pathname: string, locale: Locale): string {
  if (pathname.startsWith(`/${locale}`)) {
    const newPathname = pathname.slice(`/${locale}`.length)
    return newPathname || '/'
  }
  
  return pathname
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  return `/${locale}${pathname === '/' ? '' : pathname}`
}

// SEO and metadata helpers
export function getAlternateUrls(pathname: string): Array<{ locale: Locale; url: string }> {
  const baseUrl = 'https://global-genex.com'
  
  // Remove any existing locale from pathname to get clean path
  const cleanPath = removeLocaleFromPathname(pathname, getLocaleFromPathname(pathname))
  
  return locales.map(locale => ({
    locale,
    url: `${baseUrl}${addLocaleToPathname(cleanPath, locale)}`
  }))
}

export function generateHreflangLinks(pathname: string): Array<{ hrefLang: string; href: string }> {
  const alternates = getAlternateUrls(pathname)
  
  return [
    // Add x-default for Japanese (default locale)
    {
      hrefLang: 'x-default',
      href: alternates.find(alt => alt.locale === defaultLocale)?.url || 'https://global-genex.com'
    },
    // Add each locale
    ...alternates.map(alt => ({
      hrefLang: alt.locale,
      href: alt.url
    }))
  ]
}