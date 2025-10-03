import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from './jwt'

const JWT_COOKIE_NAME = 'admin_jwt_token'

/**
 * Server-side authentication guard for admin pages
 * Verifies JWT token and redirects to login if invalid
 * @param locale - Current locale (ja, en, zh)
 * @param redirectPath - Path to redirect after login
 */
export async function requireAdminAuth(locale: string, redirectPath?: string) {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get(JWT_COOKIE_NAME)?.value

  if (!jwtToken) {
    const loginUrl = `/${locale}/admin/login`
    const searchParams = redirectPath ? `?redirectTo=${encodeURIComponent(redirectPath)}` : ''
    redirect(`${loginUrl}${searchParams}`)
  }

  // Verify JWT token
  const payload = await verifyToken(jwtToken)

  if (!payload || payload.role !== 'admin') {
    // Token is invalid or expired, redirect to login
    const loginUrl = `/${locale}/admin/login`
    const searchParams = redirectPath ? `?redirectTo=${encodeURIComponent(redirectPath)}` : ''
    redirect(`${loginUrl}${searchParams}`)
  }

  return payload
}

/**
 * Check if user is authenticated (without redirect)
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get(JWT_COOKIE_NAME)?.value

  if (!jwtToken) {
    return false
  }

  const payload = await verifyToken(jwtToken)
  return payload !== null && payload.role === 'admin'
}
