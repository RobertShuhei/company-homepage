import { NextResponse } from 'next/server'

const JWT_COOKIE_NAME = 'admin_jwt_token'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear JWT token cookie
  response.cookies.set({
    name: JWT_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Immediately expire the cookie
  })

  return response
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
