import { NextRequest, NextResponse } from 'next/server'
import { getPublishedBlogPosts, getBlogPostBySlug } from '@/lib/supabase'
import { isResourceCategory, type ResourceCategory } from '@/lib/resourceCategories'

// GET /api/blog/public - Get published blog posts for public consumption
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const language = searchParams.get('language') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const slug = searchParams.get('slug')
    const categoryParam = searchParams.get('category') || undefined
    let category: ResourceCategory | undefined

    // If slug is provided, get specific blog post
    if (slug) {
      if (!language) {
        return NextResponse.json(
          { success: false, error: 'Language parameter is required when requesting specific post by slug' },
          { status: 400 }
        )
      }

      const blogPost = await getBlogPostBySlug(slug, language)
      if (!blogPost) {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        )
      }

      // Only return published posts to public
      if (blogPost.status !== 'published') {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        )
      }

      // Return public-safe version (remove admin fields)
      const publicPost = {
        id: blogPost.id,
        uuid: blogPost.uuid,
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        summary: blogPost.summary,
        language: blogPost.language,
        tags: blogPost.tags,
        meta_description: blogPost.meta_description,
        featured_image_url: blogPost.featured_image_url,
        keywords: blogPost.keywords,
        author: blogPost.author,
        published_at: blogPost.published_at,
        created_at: blogPost.created_at
      }

      return NextResponse.json({
        success: true,
        data: {
          ...publicPost,
          resource_category: blogPost.resource_category
        }
      })
    }

    // Validate filters
    if (language && !['ja', 'en', 'zh'].includes(language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid language. Must be one of: ja, en, zh' },
        { status: 400 }
      )
    }

    if (categoryParam) {
      if (!isResourceCategory(categoryParam)) {
        return NextResponse.json(
          { success: false, error: 'Invalid category. Must be one of: case-studies, white-papers, industry-insights, blog' },
          { status: 400 }
        )
      }

      category = categoryParam
    }

    if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
      return NextResponse.json(
        { success: false, error: 'Invalid limit. Must be between 1 and 50' },
        { status: 400 }
      )
    }

    if (offset && (isNaN(offset) || offset < 0)) {
      return NextResponse.json(
        { success: false, error: 'Invalid offset. Must be 0 or greater' },
        { status: 400 }
      )
    }

    // Get published blog posts
    const blogPosts = await getPublishedBlogPosts({
      language,
      category,
      limit,
      offset
    })

    // Return public-safe versions (remove admin fields)
    const publicPosts = blogPosts.map(post => ({
      id: post.id,
      uuid: post.uuid,
      title: post.title,
      slug: post.slug,
      content: post.content,
      summary: post.summary,
      language: post.language,
      resource_category: post.resource_category,
      tags: post.tags,
      meta_description: post.meta_description,
      featured_image_url: post.featured_image_url,
      keywords: post.keywords,
      author: post.author,
      published_at: post.published_at,
      created_at: post.created_at
    }))

    return NextResponse.json({
      success: true,
      data: publicPosts,
      count: publicPosts.length,
      filters: {
        language,
        category,
        limit,
        offset
      }
    })

  } catch (error) {
    console.error('Error fetching public blog posts:', error)

    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching blog posts' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
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
