import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, getBlogPostById } from '@/lib/supabase'
import { authenticateAdmin, createAuthErrorResponse } from '@/lib/auth'

// GET /api/blog - Get all blog posts with optional filters (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Authenticate admin user
    const authResult = authenticateAdmin(request)
    if (!authResult.isAuthenticated) {
      return createAuthErrorResponse(authResult.error || 'Authentication failed', authResult.statusCode)
    }

    const { searchParams } = new URL(request.url)

    const language = searchParams.get('language') || undefined
    const status = searchParams.get('status') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const id = searchParams.get('id')

    // If ID is provided, get specific blog post
    if (id) {
      const blogId = parseInt(id)
      if (isNaN(blogId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid blog post ID' },
          { status: 400 }
        )
      }

      const blogPost = await getBlogPostById(blogId)
      if (!blogPost) {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: blogPost
      })
    }

    // Validate filters
    if (language && !['ja', 'en', 'zh'].includes(language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language. Must be one of: ja, en, zh' },
        { status: 400 }
      )
    }

    if (status && !['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: draft, published, archived' },
        { status: 400 }
      )
    }

    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { success: false, error: 'Invalid limit. Must be between 1 and 100' },
        { status: 400 }
      )
    }

    if (offset && (isNaN(offset) || offset < 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid offset. Must be 0 or greater' },
        { status: 400 }
      )
    }

    // Get blog posts with filters
    const blogPosts = await getBlogPosts({
      language,
      status,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      data: blogPosts,
      count: blogPosts.length,
      filters: {
        language,
        status,
        limit,
        offset
      }
    })

  } catch (error) {
    console.error('Error fetching blog posts:', error)

    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching blog posts' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/blog/publish for creating posts.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
