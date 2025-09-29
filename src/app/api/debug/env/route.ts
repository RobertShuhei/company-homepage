import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check all Supabase-related environment variables
    const envCheck = {
      // Public environment variables (safe to check)
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

      // Server-side environment variables
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,

      // Other important environment variables
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      ADMIN_API_TOKEN: !!process.env.ADMIN_API_TOKEN,

      // Environment info
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,

      // Partial values (first few characters for verification, but not full keys)
      NEXT_PUBLIC_SUPABASE_URL_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      NEXT_PUBLIC_SUPABASE_ANON_KEY_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      timestamp: new Date().toISOString(),
      message: 'Environment variables check completed'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check environment variables',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}