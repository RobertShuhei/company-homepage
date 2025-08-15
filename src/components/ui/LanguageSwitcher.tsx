'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type Locale, defaultLocale, getLocaleFromPathname, removeLocaleFromPathname, addLocaleToPathname } from '@/lib/i18n'
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
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  // Handle hydration issues by setting mounted state
  useEffect(() => {
    setMounted(true)
    setCurrentLocale(getLocaleFromPathname(pathname))
  }, [pathname])

  // Get current locale (use server-safe detection for initial render)
  const detectedLocale = mounted ? currentLocale : getLocaleFromPathname(pathname)

  // Generate URLs for language switching
  const getLocalizedUrl = (targetLocale: Locale): string => {
    const cleanPath = removeLocaleFromPathname(pathname, detectedLocale)
    return addLocaleToPathname(cleanPath, targetLocale)
  }

  const englishUrl = getLocalizedUrl('en')
  const japaneseUrl = getLocalizedUrl('ja')

  // Desktop variant - horizontal toggle with separator
  if (variant === 'desktop') {
    return (
      <div className={`flex items-center space-x-1 ${className}`} role="group" aria-label="Language selector">
        <Link
          href={englishUrl}
          className={`px-2 py-1 text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
            detectedLocale === 'en'
              ? 'text-navy font-semibold'
              : 'text-gray hover:text-navy'
          }`}
          aria-current={detectedLocale === 'en' ? 'page' : undefined}
          aria-label="Switch to English"
        >
          EN
        </Link>
        
        <span className="text-gray text-sm" aria-hidden="true">|</span>
        
        <Link
          href={japaneseUrl}
          className={`px-2 py-1 text-sm font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
            detectedLocale === 'ja'
              ? 'text-navy font-semibold'
              : 'text-gray hover:text-navy'
          }`}
          aria-current={detectedLocale === 'ja' ? 'page' : undefined}
          aria-label="日本語に切り替え"
        >
          JP
        </Link>
      </div>
    )
  }

  // Mobile variant - full-width options in mobile menu
  return (
    <div className={`space-y-1 ${className}`} role="group" aria-label="Language selector">
      <div className="px-3 py-2 text-xs font-semibold text-gray uppercase tracking-wider">
        Language
      </div>
      
      <Link
        href={englishUrl}
        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
          detectedLocale === 'en'
            ? 'text-navy font-semibold bg-gray-50'
            : 'text-gray hover:text-navy hover:bg-gray-50'
        }`}
        aria-current={detectedLocale === 'en' ? 'page' : undefined}
        aria-label="Switch to English"
      >
        <div className="flex items-center justify-between">
          <span>English</span>
          {detectedLocale === 'en' && (
            <svg
              className="h-4 w-4 text-teal"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </Link>
      
      <Link
        href={japaneseUrl}
        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
          detectedLocale === 'ja'
            ? 'text-navy font-semibold bg-gray-50'
            : 'text-gray hover:text-navy hover:bg-gray-50'
        }`}
        aria-current={detectedLocale === 'ja' ? 'page' : undefined}
        aria-label="日本語に切り替え"
      >
        <div className="flex items-center justify-between">
          <span>日本語</span>
          {detectedLocale === 'ja' && (
            <svg
              className="h-4 w-4 text-teal"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </Link>
    </div>
  )
}

export default LanguageSwitcher