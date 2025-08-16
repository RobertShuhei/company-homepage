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

  // a. Initial Exclusion: Skip Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // b. Locale Prefix Check: If already prefixed with supported locale, pass through
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (hasLocalePrefix) {
    return NextResponse.next()
  }

  // c. Redirect Logic: Non-prefixed paths get redirected to /ja (default locale)
  const redirectPath = pathname === '/' ? '/ja' : `/ja${pathname}`
  const response = NextResponse.redirect(new URL(redirectPath, request.url))
  
  // Set cookie for Japanese preference
  response.cookies.set({
    name: cookieConfig.name,
    value: defaultLocale,
    maxAge: cookieConfig.maxAge,
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path
  })
  
  return response
}

export const config = {
  // Match all paths except Next.js internals, API routes, and static files
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (Next.js internal files)
     * - api (API routes)  
     * - Any path containing a file extension (e.g. .png, .ico, .css)
     */
    '/((?!_next|api|.*\\.).*)'
  ]
}