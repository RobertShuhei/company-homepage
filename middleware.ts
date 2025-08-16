import { NextRequest, NextResponse } from 'next/server'
import { 
  locales, 
  defaultLocale, 
  type Locale,
  isValidLocale,
  parseAcceptLanguage,
  LOCALE_COOKIE_NAME,
  cookieConfig
} from './i18n.config'

// Three-tier locale detection priority system
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

  // PRIORITY 1: Check for NEXT_LOCALE cookie
  const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)
  if (localeCookie?.value && isValidLocale(localeCookie.value)) {
    return localeCookie.value
  }

  // PRIORITY 2: Parse Accept-Language header for user preference
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const detectedLocale = parseAcceptLanguage(acceptLanguage)
    if (detectedLocale) {
      return detectedLocale
    }
  }

  // PRIORITY 3: Fallback to Japanese (default)
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

  // If pathname is missing locale, redirect to localized route
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    
    // For Japanese (default), redirect to /ja/path
    if (locale === 'ja') {
      const redirectPath = pathname === '/' ? '/ja' : `/ja${pathname}`
      const response = NextResponse.redirect(new URL(redirectPath, request.url))
      
      // Set cookie for Japanese preference
      response.cookies.set({
        name: cookieConfig.name,
        value: locale,
        maxAge: cookieConfig.maxAge,
        httpOnly: cookieConfig.httpOnly,
        secure: cookieConfig.secure,
        sameSite: cookieConfig.sameSite,
        path: cookieConfig.path
      })
      
      return response
    }
    
    // For English, redirect to /en/path
    if (locale === 'en') {
      const redirectPath = pathname === '/' ? '/en' : `/en${pathname}`
      const response = NextResponse.redirect(new URL(redirectPath, request.url))
      
      // Set cookie for English preference
      response.cookies.set({
        name: cookieConfig.name,
        value: locale,
        maxAge: cookieConfig.maxAge,
        httpOnly: cookieConfig.httpOnly,
        secure: cookieConfig.secure,
        sameSite: cookieConfig.sameSite,
        path: cookieConfig.path
      })
      
      return response
    }
  }

  // All localized routes are now handled through [locale] directory

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