'use client'

import { usePathname } from 'next/navigation'
import { type Locale } from '../../i18n.config'
import { removeLocaleFromPathname, addLocaleToPathname } from '../../i18n.config'
import { useTranslations, getNestedTranslation } from '@/lib/hooks/useTranslations'

interface BreadcrumbStructuredDataProps {
  locale: Locale
}

interface BreadcrumbItem {
  position: number
  name: string
  item: string
}

export default function BreadcrumbStructuredData({ locale }: BreadcrumbStructuredDataProps) {
  const pathname = usePathname()
  const { t: translations } = useTranslations()

  // Helper function to get translations safely
  const t = (path: string, fallback?: string) => {
    if (!translations) return fallback || path
    return getNestedTranslation(translations, path, fallback)
  }

  // Remove locale from pathname to get clean path
  const cleanPath = removeLocaleFromPathname(pathname, locale)

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const baseUrl = 'https://global-genex.com'
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with Home
    breadcrumbs.push({
      position: 1,
      name: t('nav.home', 'Home'),
      item: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`
    })

    // Add current page if not home
    if (cleanPath !== '/') {
      let pageName = ''

      switch (cleanPath) {
        case '/about':
          pageName = t('nav.about', 'About')
          break
        case '/services':
          pageName = t('nav.services', 'Services')
          break
        case '/contact':
          pageName = t('nav.contact', 'Contact')
          break
        case '/privacy':
          pageName = t('privacy.title', 'Privacy Policy')
          break
        default:
          // Fallback for any other pages
          pageName = cleanPath.replace('/', '').charAt(0).toUpperCase() + cleanPath.replace('/', '').slice(1)
      }

      breadcrumbs.push({
        position: 2,
        name: pageName,
        item: `${baseUrl}${addLocaleToPathname(cleanPath, locale)}`
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Only render breadcrumbs if there's more than just Home
  if (breadcrumbs.length <= 1) {
    return null
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `https://global-genex.com${addLocaleToPathname(cleanPath, locale)}#breadcrumb`,
    itemListElement: breadcrumbs.map((breadcrumb) => ({
      "@type": "ListItem",
      position: breadcrumb.position,
      name: breadcrumb.name,
      item: breadcrumb.item
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbStructuredData)
      }}
    />
  )
}