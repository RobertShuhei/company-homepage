import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost, generateSlug, BlogPost } from '@/lib/supabase'
import { authenticateAdmin, createAuthErrorResponse } from '@/lib/auth'

interface PublishBlogRequest {
  title: string
  content: string
  originalContent: string
  model: string
  keywords: string
  referenceUrl?: string
  instructions?: string
  locale: string
  summary?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin user
    const authResult = authenticateAdmin(request)
    if (!authResult.isAuthenticated) {
      return createAuthErrorResponse(authResult.error || 'Authentication failed', authResult.statusCode)
    }

    const body = await request.json() as PublishBlogRequest

    // Validate required fields
    if (!body.title || !body.content || !body.locale) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, content, and locale are required'
        },
        { status: 400 }
      )
    }

    // Validate locale
    if (!['ja', 'en', 'zh'].includes(body.locale)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid locale. Must be one of: ja, en, zh'
        },
        { status: 400 }
      )
    }

    // Validate model if provided
    if (body.model && !['gpt-5-nano', 'gpt-5-mini', 'gpt-5'].includes(body.model)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid model. Must be one of: gpt-5-nano, gpt-5-mini, gpt-5'
        },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = generateSlug(body.title)

    // Prepare blog post data
    const blogPostData: Omit<BlogPost, 'id' | 'uuid' | 'created_at' | 'updated_at'> = {
      title: body.title.trim(),
      slug,
      content: body.content,
      original_content: body.originalContent,
      summary: body.summary,
      language: body.locale as 'ja' | 'en' | 'zh',
      status: body.status || 'published',
      tags: body.tags || [],
      keywords: body.keywords,
      ai_model: body.model as 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5' | undefined,
      reference_url: body.referenceUrl,
      generation_instructions: body.instructions,
      author: 'Global Genex Inc.',
      published_at: body.status === 'published' ? new Date().toISOString() : undefined
    }

    // Save to database
    const savedPost = await createBlogPost(blogPostData)

    console.log('Blog post saved successfully:', {
      id: savedPost.id,
      uuid: savedPost.uuid,
      title: savedPost.title,
      slug: savedPost.slug,
      language: savedPost.language,
      status: savedPost.status,
      published_at: savedPost.published_at
    })

    return NextResponse.json({
      success: true,
      id: savedPost.id,
      uuid: savedPost.uuid,
      slug: savedPost.slug,
      message: `Blog post ${savedPost.status === 'published' ? 'published' : 'saved as draft'} successfully`,
      publishedAt: savedPost.published_at,
      url: `/blog/${savedPost.slug}` // Future blog view URL
    })

  } catch (error) {
    console.error('Error publishing blog post:', error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('unique_violation')) {
        return NextResponse.json(
          {
            success: false,
            error: 'A blog post with this title already exists in this language. Please use a different title or modify the existing post.'
          },
          { status: 409 }
        )
      }

      if (error.message.includes('Supabase') || error.message.includes('database')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error occurred while saving the blog post'
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while publishing blog post'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
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
