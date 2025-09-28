import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isValidLocale } from '@/lib/i18n'

export const ADMIN_SESSION_COOKIE_NAME = 'admin_token'
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

const baseCookieConfig = {
  name: ADMIN_SESSION_COOKIE_NAME,
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
}

function getConfiguredAdminToken(): string {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is not configured')
  }
  return adminPassword
}

export function isValidAdminToken(token: string | null | undefined): token is string {
  if (!token) {
    return false
  }
  return token === getConfiguredAdminToken()
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  if (cookieToken) {
    return cookieToken
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export function appendAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    ...baseCookieConfig,
    value: token,
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    ...baseCookieConfig,
    value: '',
    maxAge: 0,
  })
}

export async function setAdminSessionCookie(token: string) {
  const store = await cookies()
  store.set({
    ...baseCookieConfig,
    value: token,
  })
}

export async function removeAdminSessionCookie() {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE_NAME)
}

export async function getAdminTokenFromCookies(): Promise<string | null> {
  const store = await cookies()
  return store.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null
}

export async function requireAdminSession(locale: string, redirectPath: string) {
  const token = await getAdminTokenFromCookies()
  if (!isValidAdminToken(token)) {
    const normalizedLocale = isValidLocale(locale) ? locale : defaultLocale
    const fallbackTarget = `/${normalizedLocale}/admin`
    const target = redirectPath && redirectPath.startsWith(`/${normalizedLocale}/`)
      ? redirectPath
      : fallbackTarget
    const loginUrl = `/${normalizedLocale}/admin/login`
    const searchParams = `?redirectTo=${encodeURIComponent(target)}`
    redirect(`${loginUrl}${searchParams}`)
  }
  return token
}

export async function validateAdminSession(): Promise<boolean> {
  const token = await getAdminTokenFromCookies()
  return isValidAdminToken(token)
}
