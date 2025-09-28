import { NextRequest } from 'next/server'
import { getAdminTokenFromRequest, isValidAdminToken } from './adminSession'

// Simple admin authentication for blog endpoints
export interface AuthResult {
  isAuthenticated: boolean
  error?: string
  statusCode?: number
}

// Admin authentication check
export function authenticateAdmin(request: NextRequest): AuthResult {
  try {
    const token = getAdminTokenFromRequest(request)

    if (!token) {
      return {
        isAuthenticated: false,
        error: '管理者セッションが見つかりません。',
        statusCode: 401,
      }
    }

    if (!isValidAdminToken(token)) {
      return {
        isAuthenticated: false,
        error: '認証トークンが無効です。',
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
      error: 'Authentication system error'
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
