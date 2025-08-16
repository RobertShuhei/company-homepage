'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  type Locale, 
  defaultLocale,
  getLocaleFromPathname, 
  removeLocaleFromPathname, 
  addLocaleToPathname,
  cookieConfig
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

  // Client-side cookie management
  const setCookie = (locale: Locale) => {
    if (typeof document !== 'undefined') {
      const expires = new Date()
      expires.setTime(expires.getTime() + cookieConfig.maxAge * 1000)
      
      document.cookie = `${cookieConfig.name}=${locale}; expires=${expires.toUTCString()}; path=${cookieConfig.path}; SameSite=${cookieConfig.sameSite}${cookieConfig.secure ? '; Secure' : ''}`
    }
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
    // Use router.push for client-side navigation to ensure cookie is set before navigation
    router.push(targetUrl)
  }

  // Generate URLs for language switching
  const getLocalizedUrl = (targetLocale: Locale): string => {
    const cleanPath = removeLocaleFromPathname(pathname, detectedLocale)
    return addLocaleToPathname(cleanPath, targetLocale)
  }

  const englishUrl = getLocalizedUrl('en')
  const japaneseUrl = getLocalizedUrl('ja')

  // Desktop variant - enhanced horizontal toggle with better visual hierarchy
  if (variant === 'desktop') {
    return (
      <div className={`flex items-center ${className}`} role="group" aria-label="Language selector">
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => handleLanguageSwitch('en', englishUrl)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-gray-50 ${
              detectedLocale === 'en'
                ? 'bg-white text-navy font-semibold shadow-sm border border-gray-200'
                : 'text-gray hover:text-navy hover:bg-gray-100'
            }`}
            aria-current={detectedLocale === 'en' ? 'page' : undefined}
            aria-label="Switch to English"
            type="button"
          >
            <span className="flex items-center space-x-1">
              <span>EN</span>
              {detectedLocale === 'en' && (
                <div className="w-1.5 h-1.5 bg-teal rounded-full" aria-hidden="true" />
              )}
            </span>
          </button>
          
          <button
            onClick={() => handleLanguageSwitch('ja', japaneseUrl)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-gray-50 ${
              detectedLocale === 'ja'
                ? 'bg-white text-navy font-semibold shadow-sm border border-gray-200'
                : 'text-gray hover:text-navy hover:bg-gray-100'
            }`}
            aria-current={detectedLocale === 'ja' ? 'page' : undefined}
            aria-label="日本語に切り替え"
            type="button"
          >
            <span className="flex items-center space-x-1">
              <span>JP</span>
              {detectedLocale === 'ja' && (
                <div className="w-1.5 h-1.5 bg-teal rounded-full" aria-hidden="true" />
              )}
            </span>
          </button>
        </div>
      </div>
    )
  }

  // Mobile variant - enhanced full-width options in mobile menu
  return (
    <div className={`space-y-1 ${className}`} role="group" aria-label="Language selector">
      <div className="px-3 py-2 text-xs font-semibold text-gray uppercase tracking-wider">
        Language
      </div>
      
      <button
        onClick={() => handleLanguageSwitch('en', englishUrl)}
        className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
          detectedLocale === 'en'
            ? 'text-navy font-semibold bg-teal bg-opacity-10 border border-teal border-opacity-20'
            : 'text-gray hover:text-navy hover:bg-gray-50'
        }`}
        aria-current={detectedLocale === 'en' ? 'page' : undefined}
        aria-label="Switch to English"
        type="button"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-3">
            <span className="text-base">🇺🇸</span>
            <span>English</span>
          </span>
          {detectedLocale === 'en' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-teal font-medium">Current</span>
              <div className="w-2 h-2 bg-teal rounded-full" aria-hidden="true" />
            </div>
          )}
        </div>
      </button>
      
      <button
        onClick={() => handleLanguageSwitch('ja', japaneseUrl)}
        className={`w-full text-left block px-3 py-2 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
          detectedLocale === 'ja'
            ? 'text-navy font-semibold bg-teal bg-opacity-10 border border-teal border-opacity-20'
            : 'text-gray hover:text-navy hover:bg-gray-50'
        }`}
        aria-current={detectedLocale === 'ja' ? 'page' : undefined}
        aria-label="日本語に切り替え"
        type="button"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-3">
            <span className="text-base">🇯🇵</span>
            <span>日本語</span>
          </span>
          {detectedLocale === 'ja' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-teal font-medium">現在</span>
              <div className="w-2 h-2 bg-teal rounded-full" aria-hidden="true" />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

export default LanguageSwitcher