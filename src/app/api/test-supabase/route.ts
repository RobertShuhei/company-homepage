import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const result = {
      env_check: {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
        url_partial: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined',
        key_partial: supabaseAnonKey ? 'eyJ...' + supabaseAnonKey.substring(supabaseAnonKey.length - 10) : 'undefined'
      },
      client_test: null as any,
      connection_test: null as any
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Environment variables not found',
        data: result
      }, { status: 500 })
    }

    // Try to create client
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      result.client_test = { success: true, message: 'Client created successfully' }

      // Try a simple query
      try {
        const { data, error } = await supabase.from('blog_posts').select('count').limit(0)

        if (error) {
          result.connection_test = { success: false, error: error.message }
        } else {
          result.connection_test = { success: true, message: 'Connection successful' }
        }
      } catch (queryError: any) {
        result.connection_test = {
          success: false,
          error: 'Query failed',
          details: queryError.message
        }
      }

    } catch (clientError: any) {
      result.client_test = {
        success: false,
        error: 'Client creation failed',
        details: clientError.message
      }
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Test Supabase error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}