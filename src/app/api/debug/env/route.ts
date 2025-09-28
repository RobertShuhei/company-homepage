import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Temporary debug endpoint to check environment variables and Supabase connection
export async function GET(request: NextRequest) {
  try {
    const envStatus = {
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    }

    // Test Supabase connection
    let supabaseStatus = { connected: false, error: null, tableExists: false }
    try {
      // Simple query to test connection
      const { data, error } = await supabase.from('blog_posts').select('count').limit(1)

      if (error) {
        supabaseStatus.error = error.message
      } else {
        supabaseStatus.connected = true
        supabaseStatus.tableExists = true
      }
    } catch (supabaseError: any) {
      supabaseStatus.error = supabaseError.message || 'Unknown Supabase error'
    }

    return NextResponse.json({
      success: true,
      data: {
        environment: envStatus,
        supabase: supabaseStatus
      },
      message: 'Environment and Supabase connection check'
    })
  } catch (error) {
    console.error('Debug env check error:', error)
    return NextResponse.json(
      { success: false, error: 'Debug check failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}