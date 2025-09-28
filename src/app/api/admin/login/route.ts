import { NextRequest, NextResponse } from 'next/server'
import { appendAdminSessionCookie, isValidAdminToken } from '@/lib/adminSession'

interface LoginRequestBody {
  password?: string
  redirectTo?: string
}

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

    if (!isValidAdminToken(password)) {
      return NextResponse.json(
        { success: false, errorCode: 'invalidPassword', error: '管理者認証に失敗しました。' },
        { status: 401 }
      )
    }

    const safeRedirect = body.redirectTo && body.redirectTo.startsWith('/') ? body.redirectTo : undefined

    const response = NextResponse.json({ success: true, redirectTo: safeRedirect })
    appendAdminSessionCookie(response, password)
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, errorCode: 'server', error: '認証処理中にエラーが発生しました。' },
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
