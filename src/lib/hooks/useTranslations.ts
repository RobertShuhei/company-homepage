'use client'

import { useParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { type Locale, defaultLocale, isValidLocale, type Translations, getLocaleFromPathname } from '../i18n'

// Translation data cache for client-side
let clientTranslationCache: Record<Locale, Translations | null> = {
  en: null,
<<<<<<< HEAD
  ja: null,
  zh: null
=======
  ja: null
>>>>>>> 3ece5cf0d13f509e5ff38ea068119ea095de1ca6
}

// Load translations for client-side use
async function loadClientTranslations(locale: Locale): Promise<Translations> {
  // Return cached translations if available
  if (clientTranslationCache[locale]) {
    return clientTranslationCache[locale]!
  }

  try {
    const translations = await import(`../../locales/${locale}/common.json`)
    clientTranslationCache[locale] = translations.default || translations
    return clientTranslationCache[locale]!
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`, error)
    
    // Fallback to default locale
    if (locale !== defaultLocale) {
      return loadClientTranslations(defaultLocale)
    }
    
    throw new Error(`Failed to load translations for default locale: ${defaultLocale}`)
  }
}

// Hook for client components with proper state management
export function useTranslations(): {
  t: Translations | null
  locale: Locale
  isLoading: boolean
} {
  const params = useParams()
  const pathname = usePathname()
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get locale from URL params or pathname
  const locale = getLocaleFromParams(params) || getLocaleFromPathname(pathname)
  
  // Load translations when locale changes
  useEffect(() => {
    let isMounted = true
    
    async function loadTranslations() {
      try {
        setIsLoading(true)
        const t = await loadClientTranslations(locale)
        if (isMounted) {
          setTranslations(t)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to load translations:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadTranslations()
    
    return () => {
      isMounted = false
    }
  }, [locale])
  
  return {
    t: translations,
    locale,
    isLoading
  }
}

// Helper to get locale from Next.js params
function getLocaleFromParams(params: Record<string, string | string[] | undefined> | null): Locale | null {
  if (!params?.locale) {
    return null
  }
  
  if (typeof params.locale === 'string' && isValidLocale(params.locale)) {
    return params.locale
  }
  
  return null
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

// Type-safe translation getter for client components
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
export function clearClientTranslationCache(): void {
  clientTranslationCache = {
    en: null,
<<<<<<< HEAD
    ja: null,
    zh: null
  }
}
=======
    ja: null
  }
}
>>>>>>> 3ece5cf0d13f509e5ff38ea068119ea095de1ca6
