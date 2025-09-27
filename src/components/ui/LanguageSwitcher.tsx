'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  type Locale,
  locales,
  defaultLocale,
  getLocaleFromPathname,
  removeLocaleFromPathname,
  addLocaleToPathname,
  cookieConfig,
  isValidLocale
} from '../../../i18n.config'
import { Fragment, useState, useEffect, useMemo } from 'react'

const languageLabels: Record<Locale, { label: string; mobileLabel: string; ariaLabel: string }> = {
  ja: {
    label: 'JP',
    mobileLabel: '日本語',
    ariaLabel: '日本語に切り替え'
  },
  en: {
    label: 'EN',
    mobileLabel: 'English',
    ariaLabel: 'Switch to English'
  },
  zh: {
    label: 'ZH',
    mobileLabel: '简体中文',
    ariaLabel: '切换到简体中文'
  }
}

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

  // Memoize clean path for stable URL generation
  const cleanPath = useMemo(() => {
    return removeLocaleFromPathname(pathname, detectedLocale)
  }, [pathname, detectedLocale])

  const languageOptions = useMemo(() => {
    return locales.map(locale => ({
      locale,
      url: addLocaleToPathname(cleanPath, locale),
      isActive: locale === detectedLocale,
      ...languageLabels[locale]
    }))
  }, [cleanPath, detectedLocale])

  if (!languageOptions.length) {
    return null
  }

  // Desktop variant - simple text link without container
  if (variant === 'desktop') {
    return (
      <div
        className={`flex items-center gap-2 text-sm font-medium ${className}`}
        role="group"
        aria-label="Language selector"
      >
        {languageOptions.map((option, index) => (
          <Fragment key={option.locale}>
            <button
              onClick={() => !option.isActive && handleLanguageSwitch(option.locale, option.url)}
              className={`px-2 py-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                option.isActive ? 'text-navy cursor-default' : 'text-gray hover:text-navy'
              }`}
              aria-label={option.isActive ? `当前语言：${option.mobileLabel}` : option.ariaLabel}
              aria-pressed={option.isActive}
              type="button"
              disabled={option.isActive}
            >
              {option.label}
            </button>
            {index < languageOptions.length - 1 && (
              <span className="text-gray" aria-hidden="true">|</span>
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  // Mobile variant - clean integration in mobile menu
  return (
    <div
      className={`flex flex-col gap-1 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {languageOptions.map(option => (
        <button
          key={option.locale}
          onClick={() => !option.isActive && handleLanguageSwitch(option.locale, option.url)}
          className={`w-full text-left block px-3 py-2 text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
            option.isActive
              ? 'text-navy bg-gray-100 cursor-default'
              : 'text-gray hover:text-navy hover:bg-gray-50'
          }`}
          aria-label={option.isActive ? `当前语言：${option.mobileLabel}` : option.ariaLabel}
          aria-pressed={option.isActive}
          type="button"
          disabled={option.isActive}
        >
          {option.mobileLabel}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
