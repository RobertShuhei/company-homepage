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
  console.log(`[MIDDLEWARE] Processing pathname: ${pathname}`)

  // Exclusion logic moved to middleware function
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(.*)$/.test(pathname)
  ) {
    console.log(`[MIDDLEWARE] Excluding pathname: ${pathname}`)
    return NextResponse.next()
  }

  // Check if path already has a supported locale prefix
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (hasLocalePrefix) {
    console.log(`[MIDDLEWARE] Has locale prefix, passing through: ${pathname}`)
    return NextResponse.next()
  }

  // Redirect non-prefixed paths to default locale (Japanese)
  const redirectPath = pathname === '/' ? '/ja' : `/ja${pathname}`
  console.log(`[MIDDLEWARE] Redirecting ${pathname} -> ${redirectPath}`)
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}