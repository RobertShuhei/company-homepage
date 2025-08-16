'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations, getNestedTranslation } from '@/lib/hooks/useTranslations'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import LocalizedLink from '../ui/LocalizedLink'
import {
  getLocaleFromPathname,
  removeLocaleFromPathname
} from '../../../i18n.config'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t: translations } = useTranslations()
  const mountId = useRef(Math.random().toString(36).substr(2, 9))
  
  // Helper function to get translations safely
  const t = (path: string, fallback?: string) => {
    if (!translations) return fallback || path;
    return getNestedTranslation(translations, path, fallback);
  }

  // Memoize current locale for stable comparison and hydration consistency
  const currentLocale = useMemo(() => {
    return getLocaleFromPathname(pathname)
  }, [pathname])

  // DEBUG: Component lifecycle tracking
  useEffect(() => {
    console.log('🚀 HEADER MOUNT:', {
      timestamp: new Date().toISOString(),
      mountId: mountId.current,
      pathname,
      currentLocale
    })

    return () => {
      console.log('💀 HEADER UNMOUNT:', {
        timestamp: new Date().toISOString(),
        mountId: mountId.current,
        pathname,
        currentLocale
      })
    }
  }, [])

  // DEBUG: Add comprehensive logging for navigation remounting investigation
  console.log('🔍 HEADER RENDER DEBUG:', {
    timestamp: new Date().toISOString(),
    component: 'Header',
    mountId: mountId.current,
    pathname,
    currentLocale,
    translations: !!translations,
    isMenuOpen
  })
  
  const navItems = [
    { href: '/', label: t('nav.home', 'Home') },
    { href: '/services', label: t('nav.services', 'Services') },
    { href: '/about', label: t('nav.about', 'About') },
    { href: '/contact', label: t('nav.contact', 'Contact') },
  ]

  // Memoize clean pathname for performance
  const cleanPathname = useMemo(() => {
    return removeLocaleFromPathname(pathname, currentLocale)
  }, [pathname, currentLocale])

  const isActiveHref = (href: string) => {
    // "/" は完全一致、それ以外は「完全一致 or 配下パス」で判定
    if (href === '/') return cleanPathname === '/'
    return cleanPathname === href || cleanPathname.startsWith(href + '/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="company-logo-stable">
            <LocalizedLink
              href="/"
              aria-label={t('nav.homeAriaLabel', 'Global Genex Inc. - Home')}
            >
              {t('nav.companyName', 'Global Genex Inc.')}
            </LocalizedLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label={t('nav.menuAriaLabel', 'Main navigation')}>
            {navItems.map((item) => {
              const active = isActiveHref(item.href)
              const stableClass = item.href === '/' ? 'nav-item-home' : 
                                 item.href === '/services' ? 'nav-item-services' :
                                 item.href === '/about' ? 'nav-item-about' :
                                 item.href === '/contact' ? 'nav-item-contact' : ''
              return (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  className={`nav-item-stable ${stableClass} px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                    active ? 'text-navy font-semibold' : 'text-gray hover:text-navy'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </LocalizedLink>
              )
            })}
          </nav>

          {/* Language Switcher (Desktop) */}
          <div className="hidden md:flex">
            <LanguageSwitcher variant="desktop" />
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <LocalizedLink
              href="/contact"
              className="nav-item-stable nav-item-cta bg-teal text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
            >
              {t('nav.getStarted', 'Get Started')}
            </LocalizedLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray hover:text-navy focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 rounded-md p-2"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{t('nav.openMenu', 'Open main menu')}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => {
                const active = isActiveHref(item.href)
                return (
                  <LocalizedLink
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                      active ? 'text-navy font-semibold' : 'text-gray hover:text-navy'
                    }`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </LocalizedLink>
                )
              })}
              <LocalizedLink
                href="/contact"
                className="bg-teal text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-teal/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.getStarted', 'Get Started')}
              </LocalizedLink>
              
              {/* Language Switcher (Mobile) */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
