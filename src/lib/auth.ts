import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'

const JWT_COOKIE_NAME = 'admin_jwt_token'

// Simple admin authentication for blog endpoints
export interface AuthResult {
  isAuthenticated: boolean
  error?: string
  statusCode?: number
}

// Admin authentication check using JWT (async version)
export async function authenticateAdminAsync(request: NextRequest): Promise<AuthResult> {
  try {
    // Get JWT token from cookie
    const jwtToken = request.cookies.get(JWT_COOKIE_NAME)?.value

    if (!jwtToken) {
      return {
        isAuthenticated: false,
        error: '管理者セッションが見つかりません。',
        statusCode: 401,
      }
    }

    // Verify JWT token
    const payload = await verifyToken(jwtToken)

    if (!payload || payload.role !== 'admin') {
      return {
        isAuthenticated: false,
        error: '認証トークンが無効または期限切れです。',
        statusCode: 403,
      }
    }

    return {
      isAuthenticated: true
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      isAuthenticated: false,
      error: 'Authentication system error',
      statusCode: 500
    }
  }
}

// Synchronous version for backward compatibility (only checks token existence)
export function authenticateAdmin(request: NextRequest): AuthResult {
  try {
    const jwtToken = request.cookies.get(JWT_COOKIE_NAME)?.value

    if (!jwtToken) {
      return {
        isAuthenticated: false,
        error: '管理者セッションが見つかりません。',
        statusCode: 401,
      }
    }

    // Just check token existence - full verification should use authenticateAdminAsync
    return {
      isAuthenticated: true
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      isAuthenticated: false,
      error: 'Authentication system error',
      statusCode: 500
    }
  }
}

// Helper function to generate authentication error response
export function createAuthErrorResponse(error: string, statusCode: number = 401) {
  return Response.json(
    {
      success: false,
      error,
      message: '管理者認証が必要です。'
    },
    { status: statusCode }
  )
}

// Admin authentication middleware for API routes
export function withAdminAuth(handler: (request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const authResult = authenticateAdmin(request)

    if (!authResult.isAuthenticated) {
      return createAuthErrorResponse(
        authResult.error || 'Authentication failed',
        authResult.statusCode
      )
    }

    return handler(request)
  }
}
