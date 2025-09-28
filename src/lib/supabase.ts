import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { type ResourceCategory } from './resourceCategories'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseFetch: typeof fetch = async (input, init = {}) => {
  const requestUrl = typeof input === 'string' ? input : input.url
  const isBlogPostsRequest = requestUrl.includes('/rest/v1/blog_posts')

  let nextOptions = init.next ?? {}

  if (isBlogPostsRequest) {
    const existingTags = nextOptions.tags ?? []
    const tags = Array.from(new Set([...(Array.isArray(existingTags) ? existingTags : [existingTags]).filter(Boolean), 'blog_posts']))
    nextOptions = { ...nextOptions, tags }
  }

  const finalInit: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    ...init,
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  }

  return fetch(input, finalInit)
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: supabaseFetch,
  },
})

// Database interface for blog posts (Supabase version)
export interface BlogPost {
  id?: number
  uuid?: string
  title: string
  slug: string
  content: string
  original_content?: string
  summary?: string
  language: 'ja' | 'en' | 'zh'
  status: 'draft' | 'published' | 'archived'
  resource_category?: ResourceCategory
  tags?: string[]
  meta_description?: string
  featured_image_url?: string
  keywords?: string
  ai_model?: 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5'
  reference_url?: string
  generation_instructions?: string
  author?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Remove special characters and replace with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    // Truncate to reasonable length
    .substring(0, 100)
}

// Create a new blog post
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'uuid' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  // Generate slug if not provided or ensure uniqueness
  let slug = post.slug || generateSlug(post.title)
  let counter = 1

  // Check for slug uniqueness in the same language
  while (await getBlogPostBySlug(slug, post.language)) {
    if (post.slug) {
      // If slug was explicitly provided, add counter
      slug = `${post.slug}-${counter}`
    } else {
      // If slug was generated, regenerate with counter
      slug = `${generateSlug(post.title)}-${counter}`
    }
    counter++
  }

  const blogPostData = {
    title: post.title,
    slug,
    content: post.content,
    original_content: post.original_content || null,
    summary: post.summary || null,
    language: post.language,
    status: post.status,
    resource_category: post.resource_category || 'blog',
    tags: post.tags || [],
    meta_description: post.meta_description || null,
    featured_image_url: post.featured_image_url || null,
    keywords: post.keywords || null,
    ai_model: post.ai_model || null,
    reference_url: post.reference_url || null,
    generation_instructions: post.generation_instructions || null,
    author: post.author || 'Global Genex Inc.',
    published_at: post.status === 'published' ? (post.published_at || new Date().toISOString()) : null
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blogPostData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`)
  }

  const formatted = formatBlogPost(data)
  await revalidateTag('blog_posts')
  return formatted
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to get blog post: ${error.message}`)
  }

  return data ? formatBlogPost(data) : null
}

// Get blog post by UUID
export async function getBlogPostByUuid(uuid: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('uuid', uuid)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to get blog post: ${error.message}`)
  }

  return data ? formatBlogPost(data) : null
}

// Get blog post by slug and language
export async function getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('language', language)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to get blog post: ${error.message}`)
  }

  return data ? formatBlogPost(data) : null
}

// Get all blog posts with optional filters
export async function getBlogPosts(options: {
  language?: string
  status?: string
  category?: string
  limit?: number
  offset?: number
} = {}): Promise<BlogPost[]> {
  const categoryTagMap = {
    'case-studies': 'case-study',
    'white-papers': 'white-paper',
    'industry-insights': 'industry-insight',
    blog: 'blog',
  }

  const buildQuery = (useCategoryColumn: boolean) => {
    let query = supabase.from('blog_posts').select('*')

    if (options.language) {
      query = query.eq('language', options.language)
    }

    if (options.status) {
      query = query.eq('status', options.status)
    }

    if (options.category) {
      if (useCategoryColumn) {
        query = query.eq('resource_category', options.category)
      } else {
        const tag = categoryTagMap[options.category as keyof typeof categoryTagMap] || options.category
        query = query.contains('tags', [tag])
      }
    }

    query = query
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      const end = (options.offset + (options.limit || 10)) - 1
      query = query.range(options.offset, end)
    }

    return query
  }

  const { data, error } = await buildQuery(true)

  if (error) {
    const columnMissing = options.category && /resource_category/.test(error.message)

    if (columnMissing) {
      const { data: fallbackData, error: fallbackError } = await buildQuery(false)
      if (fallbackError) {
        throw new Error(`Failed to get blog posts: ${fallbackError.message}`)
      }
      return fallbackData ? fallbackData.map(formatBlogPost) : []
    }

    throw new Error(`Failed to get blog posts: ${error.message}`)
  }

  return data ? data.map(formatBlogPost) : []
}

// Update blog post
export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  // Remove immutable fields
  const { id: _, uuid: __, created_at: ___, ...updateData } = updates

  // Convert camelCase to snake_case for database
  const dbUpdates: Record<string, any> = {}
  Object.entries(updateData).forEach(([key, value]) => {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    dbUpdates[dbKey] = value
  })

  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update blog post: ${error.message}`)
  }

  const formatted = data ? formatBlogPost(data) : null
  await revalidateTag('blog_posts')
  return formatted
}

// Delete blog post
export async function deleteBlogPost(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }

  await revalidateTag('blog_posts')
  return true
}

// Get published blog posts for public consumption
export async function getPublishedBlogPosts(options: {
  language?: string
  category?: string
  limit?: number
  offset?: number
} = {}): Promise<BlogPost[]> {
  return getBlogPosts({
    ...options,
    status: 'published'
  })
}

// Format database row to BlogPost interface (snake_case to camelCase)
function formatBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    uuid: row.uuid,
    title: row.title,
    slug: row.slug,
    content: row.content,
    original_content: row.original_content || undefined,
    summary: row.summary || undefined,
    language: row.language,
    status: row.status,
    resource_category: row.resource_category || row.category || 'blog',
    tags: row.tags || undefined,
    meta_description: row.meta_description || undefined,
    featured_image_url: row.featured_image_url || undefined,
    keywords: row.keywords || undefined,
    ai_model: row.ai_model || undefined,
    reference_url: row.reference_url || undefined,
    generation_instructions: row.generation_instructions || undefined,
    author: row.author,
    published_at: row.published_at || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at
  }
}
