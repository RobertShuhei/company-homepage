import { NextRequest, NextResponse } from 'next/server'

// Supported locales
export const locales = ['en', 'ja'] as const
export const defaultLocale = 'en' as const

export type Locale = typeof locales[number]

// Helper function to check if a locale is supported
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Get the preferred locale from the request
function getLocale(request: NextRequest): Locale {
  // Check if there's a locale in the URL (for explicit /ja routes)
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // If there's already a locale in the URL, extract it
  if (!pathnameIsMissingLocale) {
    const locale = pathname.split('/')[1] as Locale
    return locales.includes(locale) ? locale : defaultLocale
  }

  // Check Accept-Language header for automatic detection
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Simple language detection - check if Japanese is preferred
    if (acceptLanguage.includes('ja')) {
      return 'ja'
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip processing for static files, API routes, and special Next.js files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next()
  }

  // Check if there's a locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // If pathname is missing locale and it's not the root path for default locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // For Japanese, redirect to /ja/path
    if (locale === 'ja') {
      const redirectPath = pathname === '/' ? '/ja' : `/ja${pathname}`
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    
    // For English (default), keep the path as-is
    return NextResponse.next()
  }

  // If the path has a locale but it's the default locale, redirect to clean URL
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const cleanPath = pathname === '/en' ? '/' : pathname.slice(3)
    return NextResponse.redirect(new URL(cleanPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg, *.webp (images)
     * - *.css, *.js (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'
  ]
}