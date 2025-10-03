import { SignJWT, jwtVerify } from 'jose'

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-key-change-in-production'
)
const JWT_ALGORITHM = 'HS256'
const JWT_ISSUER = 'global-genex-admin'
const JWT_AUDIENCE = 'global-genex-homepage'

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = '8h' // 8 hours
export const REFRESH_TOKEN_EXPIRY = '7d' // 7 days

// JWT Payload interface
export interface JWTPayload {
  sub: string // subject (user identifier)
  role: 'admin'
  iat?: number // issued at
  exp?: number // expiration
  iss?: string // issuer
  aud?: string // audience
}

/**
 * Generate a JWT access token
 * @param payload - Token payload containing user info
 * @returns Signed JWT token string
 */
export async function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error('Error generating access token:', error)
    throw new Error('Failed to generate access token')
  }
}

/**
 * Generate a JWT refresh token with longer expiry
 * @param payload - Token payload containing user info
 * @returns Signed JWT refresh token string
 */
export async function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error('Error generating refresh token:', error)
    throw new Error('Failed to generate refresh token')
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded payload if valid, null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    // Validate required fields
    if (!payload.sub || !('role' in payload) || payload.role !== 'admin') {
      console.warn('Invalid token payload structure')
      return null
    }

    // Type assertion with proper validation
    return {
      sub: payload.sub,
      role: payload.role as 'admin',
      iat: payload.iat,
      exp: payload.exp,
      iss: payload.iss,
      aud: payload.aud,
    } as JWTPayload
  } catch (error) {
    // Log specific error types for debugging
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        console.warn('Token has expired')
      } else if (error.message.includes('signature')) {
        console.error('Invalid token signature')
      } else {
        console.error('Token verification failed:', error.message)
      }
    }
    return null
  }
}

/**
 * Check if a token is expired
 * @param token - JWT token string to check
 * @returns true if expired, false otherwise
 */
export async function isTokenExpired(token: string): Promise<boolean> {
  const payload = await verifyToken(token)
  return payload === null
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

/**
 * Validate admin password against configured password
 * @param password - Password to validate
 * @returns true if valid, false otherwise
 */
export function validateAdminPassword(password: string): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (!configuredPassword) {
    console.error('ADMIN_PASSWORD is not configured')
    return false
  }

  // Remove any accidentally included quotes from environment variable
  const cleanPassword = configuredPassword.replace(/^["']|["']$/g, '')

  return password === cleanPassword
}
