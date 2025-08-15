'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActiveHref = (href: string) => {
    // "/" は完全一致、それ以外は「完全一致 or 配下パス」で判定
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-navy hover:text-teal transition-colors duration-200"
              aria-label="Global Genex Inc. - Home"
            >
              Global Genex Inc.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActiveHref(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                    active ? 'text-navy font-semibold' : 'text-gray hover:text-navy'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Language Switcher (Desktop) */}
          <div className="hidden md:flex">
            <LanguageSwitcher variant="desktop" />
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="bg-teal text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
            >
              Get Started
            </Link>
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
              <span className="sr-only">Open main menu</span>
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
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                      active ? 'text-navy font-semibold' : 'text-gray hover:text-navy'
                    }`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                className="bg-teal text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-teal/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
              
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
