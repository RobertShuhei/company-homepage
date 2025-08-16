'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import type { ComponentProps } from 'react'
import { 
  getLocaleFromPathname, 
  addLocaleToPathname,
  type Locale 
} from '../../../i18n.config'

// Extract Next.js Link props and extend them
export interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  /**
   * The base path without locale prefix (e.g., '/about', '/services')
   * Will be automatically prefixed with current locale
   */
  href: string
  
  /**
   * Optional locale override. If not provided, uses current locale from pathname
   */
  locale?: Locale
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * ARIA current attribute for active states
   */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string
  
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  
  /**
   * Children content
   */
  children: React.ReactNode
}

/**
 * LocalizedLink Component
 * 
 * A performance-optimized wrapper around Next.js Link that automatically
 * handles locale-aware URL generation. Supports all standard Link props
 * while providing seamless i18n routing integration.
 * 
 * Features:
 * - Automatic locale prefix generation based on current route
 * - Memoized href calculation for optimal performance
 * - Full TypeScript support with proper prop forwarding
 * - Backward compatible with existing Link usage patterns
 * - Support for locale override when needed
 * 
 * @example
 * // Basic usage - automatically uses current locale
 * <LocalizedLink href="/about">About Us</LocalizedLink>
 * 
 * @example
 * // With specific locale
 * <LocalizedLink href="/contact" locale="en">Contact</LocalizedLink>
 * 
 * @example
 * // With additional props
 * <LocalizedLink 
 *   href="/services" 
 *   className="nav-link" 
 *   aria-current="page"
 * >
 *   Services
 * </LocalizedLink>
 */
export default function LocalizedLink({
  href,
  locale,
  children,
  className,
  'aria-current': ariaCurrent,
  'aria-label': ariaLabel,
  onClick,
  ...restProps
}: LocalizedLinkProps) {
  const pathname = usePathname()
  
  // Memoize current locale extraction for stability
  const currentLocale = useMemo(() => {
    return locale || getLocaleFromPathname(pathname)
  }, [locale, pathname])
  
  // Memoize locale-aware href calculation for performance
  const localizedHref = useMemo(() => {
    // Add locale prefix to the href
    return addLocaleToPathname(href, currentLocale)
  }, [href, currentLocale])
  
  return (
    <Link
      href={localizedHref}
      className={className}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Link>
  )
}