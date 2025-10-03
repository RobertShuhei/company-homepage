import { NextRequest, NextResponse } from 'next/server'
import { generateAccessToken, validateAdminPassword } from '@/lib/jwt'

interface LoginRequestBody {
  password?: string
  redirectTo?: string
}

// Cookie configuration for JWT token
const JWT_COOKIE_NAME = 'admin_jwt_token'
const JWT_COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginRequestBody
    const password = body.password?.trim()

    if (!password) {
      return NextResponse.json(
        { success: false, errorCode: 'missingPassword', error: '管理者パスワードを入力してください。' },
        { status: 400 }
      )
    }

    // Validate password against configured admin password
    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { success: false, errorCode: 'invalidPassword', error: '管理者認証に失敗しました。' },
        { status: 401 }
      )
    }

    // Generate JWT token with admin role
    const accessToken = await generateAccessToken({
      sub: 'admin',
      role: 'admin',
    })

    const safeRedirect = body.redirectTo && body.redirectTo.startsWith('/') ? body.redirectTo : undefined

    const response = NextResponse.json({ success: true, redirectTo: safeRedirect })

    // Set JWT token in HttpOnly secure cookie
    response.cookies.set({
      name: JWT_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_COOKIE_MAX_AGE,
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)

    const errorDetails = `認証処理中にエラーが発生しました。Details: ${(error as Error).message || error}`

    return NextResponse.json(
      { success: false, errorCode: 'server', error: errorDetails },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
