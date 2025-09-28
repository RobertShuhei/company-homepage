import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/adminSession'

export async function POST() {
  const response = NextResponse.json({ success: true })
  clearAdminSessionCookie(response)
  return response
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
