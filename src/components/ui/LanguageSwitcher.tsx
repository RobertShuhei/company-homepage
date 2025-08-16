'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  type Locale, 
  defaultLocale,
  getLocaleFromPathname, 
  removeLocaleFromPathname, 
  addLocaleToPathname,
  cookieConfig,
  isValidLocale
} from '../../../i18n.config'
import { useState, useEffect } from 'react'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'desktop' | 'mobile'
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'desktop' 
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  // Client-side cookie management with validation
  const setCookie = (locale: Locale) => {
    if (!isValidLocale(locale) || typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + cookieConfig.maxAge * 1000)
    
    document.cookie = `${cookieConfig.name}=${locale}; expires=${expires.toUTCString()}; path=${cookieConfig.path}; SameSite=${cookieConfig.sameSite}${cookieConfig.secure ? '; Secure' : ''}`
  }

  // Handle hydration issues by setting mounted state
  useEffect(() => {
    setMounted(true)
    setCurrentLocale(getLocaleFromPathname(pathname))
  }, [pathname])

  // Get current locale (use server-safe detection for initial render)
  const detectedLocale = mounted ? currentLocale : getLocaleFromPathname(pathname)

  // Handle language switch with cookie setting
  const handleLanguageSwitch = (targetLocale: Locale, targetUrl: string) => {
    setCookie(targetLocale)
    router.push(targetUrl)
  }

  // Generate URLs for language switching
  const getLocalizedUrl = (targetLocale: Locale): string => {
    const cleanPath = removeLocaleFromPathname(pathname, detectedLocale)
    return addLocaleToPathname(cleanPath, targetLocale)
  }

  // Only show the inactive language - hide the currently active one
  const getInactiveLanguage = (): { locale: Locale; url: string; label: string; mobileLabel: string; ariaLabel: string } | null => {
    if (detectedLocale === 'ja') {
      return {
        locale: 'en',
        url: getLocalizedUrl('en'),
        label: 'EN',
        mobileLabel: 'English',
        ariaLabel: 'Switch to English'
      }
    } else if (detectedLocale === 'en') {
      return {
        locale: 'ja',
        url: getLocalizedUrl('ja'),
        label: 'JP',
        mobileLabel: '日本語',
        ariaLabel: '日本語に切り替え'
      }
    }
    return null
  }

  const inactiveLanguage = getInactiveLanguage()

  // If no inactive language to show, don't render anything
  if (!inactiveLanguage) {
    return null
  }

  // Desktop variant - simple text link without container
  if (variant === 'desktop') {
    return (
      <button
        onClick={() => handleLanguageSwitch(inactiveLanguage.locale, inactiveLanguage.url)}
        className={`px-2 py-1 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 text-gray hover:text-navy ${className}`}
        aria-label={inactiveLanguage.ariaLabel}
        type="button"
      >
        {inactiveLanguage.label}
      </button>
    )
  }

  // Mobile variant - clean integration in mobile menu
  return (
    <button
      onClick={() => handleLanguageSwitch(inactiveLanguage.locale, inactiveLanguage.url)}
      className={`w-full text-left block px-3 py-2 text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 text-gray hover:text-navy hover:bg-gray-50 ${className}`}
      aria-label={inactiveLanguage.ariaLabel}
      type="button"
    >
      {inactiveLanguage.mobileLabel}
    </button>
  )
}

export default LanguageSwitcher