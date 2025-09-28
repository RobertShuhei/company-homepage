import { NextRequest, NextResponse } from 'next/server'

// Temporary debug endpoint to check environment variables
export async function GET(request: NextRequest) {
  try {
    const envStatus = {
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    }

    return NextResponse.json({
      success: true,
      data: envStatus,
      message: 'Environment variable status check'
    })
  } catch (error) {
    console.error('Debug env check error:', error)
    return NextResponse.json(
      { success: false, error: 'Debug check failed' },
      { status: 500 }
    )
  }
}