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

const JWT_COOKIE_NAME = 'admin_jwt_token'

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

  const basicAuthUser = process.env.BASIC_AUTH_USERNAME
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD

  const requiresAdminBasicAuth = () => {
    if (!basicAuthUser || !basicAuthPassword) {
      return false
    }

    if (pathname.startsWith('/admin')) {
      return true
    }

    return locales.some((locale) =>
      pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`)
    )
  }

  if (requiresAdminBasicAuth()) {
    const authorizationHeader = request.headers.get('authorization')

    if (!authorizationHeader?.startsWith('Basic ')) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
      })
    }

    try {
      const decoded = atob(authorizationHeader.substring(6))
      const [user, password] = decoded.split(':')

      if (user !== basicAuthUser || password !== basicAuthPassword) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
        })
      }
    } catch {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
      })
    }
  }

  // Exclusion logic moved to middleware function
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Check if path already has a supported locale prefix
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (hasLocalePrefix) {
    const segments = pathname.split('/')
    const localeSegment = segments[1]
    const adminSegment = segments[2]

    if (localeSegment && isValidLocale(localeSegment as Locale) && adminSegment === 'admin') {
      const isLoginPath = segments[3] === 'login'
      const jwtToken = request.cookies.get(JWT_COOKIE_NAME)?.value

      if (!isLoginPath) {
        // For non-login admin pages, check if JWT token exists
        // Note: Full JWT verification happens server-side in page components
        if (!jwtToken) {
          const loginUrl = new URL(`/${localeSegment}/admin/login`, request.url)
          const redirectTarget = `${pathname}${request.nextUrl.search}`
          loginUrl.searchParams.set('redirectTo', redirectTarget)
          return NextResponse.redirect(loginUrl)
        }
      } else if (jwtToken) {
        // If user has a token and is accessing login page, redirect to admin blog
        const destination = new URL(`/${localeSegment}/admin/blog`, request.url)
        return NextResponse.redirect(destination)
      }
    }

    return NextResponse.next()
  }

  // For clean URLs (no locale prefix), determine the intended locale
  const detectedLocale = getLocale(request)
  // For all clean URLs, redirect to the appropriate locale-prefixed URL
  // This ensures proper client-side navigation performance
  const redirectPath = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`
  const response = NextResponse.redirect(new URL(redirectPath, request.url))
  
  // Set cookie for the detected locale preference
  response.cookies.set({
    name: cookieConfig.name,
    value: detectedLocale,
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
     * - site.webmanifest (web app manifest file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest).*)',
  ],
}
