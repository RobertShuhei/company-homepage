// Server-side translation utilities for Next.js App Router
import { type Locale, defaultLocale, type Translations } from './i18n'

// Translation data cache for server-side rendering
let serverTranslationCache: Record<Locale, Translations | null> = {
  en: null,
  ja: null
}

// Load translations for a specific locale (server-side only)
async function loadServerTranslations(locale: Locale): Promise<Translations> {
  // Return cached translations if available
  if (serverTranslationCache[locale]) {
    return serverTranslationCache[locale]!
  }

  try {
    const translations = await import(`../locales/${locale}.json`)
    serverTranslationCache[locale] = translations.default || translations
    return serverTranslationCache[locale]!
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`, error)
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      return loadServerTranslations(defaultLocale)
    }
    
    throw new Error(`Failed to load translations for default locale: ${defaultLocale}`)
  }
}

// Main server-side translation function
export async function getServerTranslations(locale: Locale): Promise<Translations> {
  try {
    return await loadServerTranslations(locale)
  } catch (error) {
    console.error(`Error loading translations for locale ${locale}:`, error)
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      try {
        return await loadServerTranslations(defaultLocale)
      } catch (fallbackError) {
        console.error(`Error loading fallback translations:`, fallbackError)
        throw new Error('Failed to load any translations')
      }
    }
    
    throw error
  }
}

// Utility function to get nested translation value safely
export function getNestedTranslation(
  translations: Translations,
  path: string,
  fallback?: string
): string {
  try {
    const keys = path.split('.')
    let value: unknown = translations
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        return fallback || path
      }
    }
    
    return typeof value === 'string' ? value : fallback || path
  } catch (error) {
    console.warn(`Error getting nested translation for path: ${path}`, error)
    return fallback || path
  }
}

// Type-safe translation getter for server components
export function useTypedTranslations(translations: Translations) {
  return {
    nav: translations.nav,
    homepage: translations.homepage,
    about: translations.about,
    services: translations.services,
    contact: translations.contact,
    privacy: translations.privacy,
    footer: translations.footer,
    common: translations.common,
  }
}

// Clear translation cache (useful for development)
export function clearServerTranslationCache(): void {
  serverTranslationCache = {
    en: null,
    ja: null
  }
}