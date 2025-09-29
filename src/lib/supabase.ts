import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { RESOURCE_CATEGORY_SET, type ResourceCategory } from './resourceCategories'

// Supabase configuration with quote cleaning
function cleanEnvVar(value: string | undefined): string | undefined {
  if (!value) return value
  const cleaned = value.replace(/^["']|["']$/g, '')
  if (cleaned !== value) {
    console.warn('Removed quotes from environment variable')
  }
  return cleaned
}

const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const supabaseServiceRoleKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
    keyValue: supabaseAnonKey ? 'defined' : 'undefined'
  })
  throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}`)
}

// Helper function to detect if we're running on the server
function isServer(): boolean {
  return typeof window === 'undefined'
}

type FetchInput = Parameters<typeof fetch>[0]

const isRequestWithUrl = (value: FetchInput): value is Request => {
  return typeof value === 'object' && value !== null && 'url' in value && typeof (value as Request).url === 'string'
}

const supabaseFetch: typeof fetch = async (input, init = {}) => {
  let requestUrl = ''

  if (typeof input === 'string') {
    requestUrl = input
  } else if (input instanceof URL) {
    requestUrl = input.toString()
  } else if (isRequestWithUrl(input)) {
    requestUrl = input.url
  }
  const isBlogPostsRequest = requestUrl.includes('/rest/v1/blog_posts')

  let nextOptions = init.next ?? {}

  if (isBlogPostsRequest) {
    const existingTags = nextOptions.tags ?? []
    const tags = Array.from(new Set([...(Array.isArray(existingTags) ? existingTags : [existingTags]).filter(Boolean), 'blog_posts']))
    nextOptions = { ...nextOptions, tags }
  }

  const finalInit: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    ...init,
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  }

  return fetch(input, finalInit)
}

// Create client-side Supabase client (uses anon key)
const createClientSideClient = () => createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: supabaseFetch,
  },
})

// Create server-side Supabase client (uses service role key)
const createServerSideClient = () => {
  if (!supabaseServiceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured, falling back to anon key')
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: supabaseFetch,
      },
    })
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    global: {
      fetch: supabaseFetch,
    },
  })
}

// Export the appropriate client based on environment
export const supabase = isServer() ? createServerSideClient() : createClientSideClient()

// Export specific clients for explicit use cases
export const supabaseAdmin = createServerSideClient()
export const supabaseClient = createClientSideClient()

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
  console.log('[DEBUG] getBlogPosts called with options:', JSON.stringify(options))
  
  const categoryTagMap = {
    'case-studies': 'case-study',
    'white-papers': 'white-paper',
    'industry-insights': 'industry-insight',
    blog: 'blog',
  }

  const buildQuery = (useCategoryColumn: boolean) => {
    console.log(`[DEBUG] Building query with useCategoryColumn: ${useCategoryColumn}`)
    let query = supabase.from('blog_posts').select('*')

    if (options.language) {
      console.log(`[DEBUG] Adding language filter: ${options.language}`)
      query = query.eq('language', options.language)
    }

    if (options.status) {
      console.log(`[DEBUG] Adding status filter: ${options.status}`)
      query = query.eq('status', options.status)
    }

    if (options.category) {
      if (useCategoryColumn) {
        console.log(`[DEBUG] Adding resource_category filter: ${options.category}`)
        query = query.eq('resource_category', options.category)
      } else {
        const tag = categoryTagMap[options.category as keyof typeof categoryTagMap] || options.category
        console.log(`[DEBUG] Adding tags filter: ${tag}`)
        query = query.contains('tags', [tag])
      }
    }

    query = query
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })

    if (options.limit) {
      console.log(`[DEBUG] Adding limit: ${options.limit}`)
      query = query.limit(options.limit)
    }

    if (options.offset) {
      const end = (options.offset + (options.limit || 10)) - 1
      console.log(`[DEBUG] Adding range: ${options.offset} to ${end}`)
      query = query.range(options.offset, end)
    }

    return query
  }

  try {
    console.log('[DEBUG] Executing primary query with resource_category column')
    const { data, error } = await buildQuery(true)

    if (error) {
      console.error('[ERROR] Primary query failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })

      const columnMissing = options.category && /resource_category/.test(error.message)
      console.log(`[DEBUG] Column missing check: ${columnMissing}`)

      if (columnMissing) {
        console.log('[DEBUG] Attempting fallback query with tags')
        const { data: fallbackData, error: fallbackError } = await buildQuery(false)
        
        if (fallbackError) {
          console.error('[ERROR] Fallback query also failed:', {
            message: fallbackError.message,
            details: fallbackError.details,
            hint: fallbackError.hint,
            code: fallbackError.code,
            fullError: JSON.stringify(fallbackError, Object.getOwnPropertyNames(fallbackError))
          })
          throw new Error(`Failed to get blog posts: ${fallbackError.message}`)
        }
        
        console.log(`[DEBUG] Fallback query succeeded, returned ${fallbackData?.length || 0} records`)
        return fallbackData ? fallbackData.map(formatBlogPost) : []
      }

      throw new Error(`Failed to get blog posts: ${error.message}`)
    }

    console.log(`[DEBUG] Primary query succeeded, returned ${data?.length || 0} records`)
    return data ? data.map(formatBlogPost) : []
  } catch (error) {
    console.error('[ERROR] getBlogPosts function failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      options,
      timestamp: new Date().toISOString()
    })
    
    // Log Supabase client configuration
    console.error('[ERROR] Supabase client context:', {
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
      hasAnonKey: !!supabaseAnonKey,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      isServer: isServer()
    })
    
    throw error
  }
}

// Update blog post
export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  // Convert camelCase to snake_case for database while skipping immutable fields
  const dbUpdates: Record<string, unknown> = {}
  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'id' || key === 'created_at' || key === 'createdAt') {
      return
    }

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
function formatBlogPost(row: unknown): BlogPost {
  if (!row || typeof row !== 'object') {
    throw new Error('Invalid Supabase blog post payload')
  }

  const record = row as Record<string, unknown>

  const toOptionalString = (value: unknown): string | undefined => {
    return typeof value === 'string' ? value : undefined
  }

  const toOptionalNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value)
    }
    return undefined
  }

  const parseTags = (value: unknown): string[] | undefined => {
    if (!value) return undefined
    if (Array.isArray(value)) {
      return value.filter((tag): tag is string => typeof tag === 'string')
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed)
          ? parsed.filter((tag): tag is string => typeof tag === 'string')
          : undefined
      } catch {
        return undefined
      }
    }
    return undefined
  }

  const toResourceCategory = (value: unknown): ResourceCategory | undefined => {
    if (typeof value !== 'string') {
      return undefined
    }
    return RESOURCE_CATEGORY_SET.has(value as ResourceCategory) ? (value as ResourceCategory) : undefined
  }

  const language = toOptionalString(record.language) as BlogPost['language'] | undefined
  const status = toOptionalString(record.status) as BlogPost['status'] | undefined

  return {
    id: toOptionalNumber(record.id),
    uuid: toOptionalString(record.uuid),
    title: toOptionalString(record.title) ?? '',
    slug: toOptionalString(record.slug) ?? '',
    content: toOptionalString(record.content) ?? '',
    original_content: toOptionalString(record.original_content),
    summary: toOptionalString(record.summary),
    language: language ?? 'ja',
    status: status ?? 'draft',
    resource_category: toResourceCategory(record.resource_category) || toResourceCategory(record.category) || 'blog',
    tags: parseTags(record.tags),
    meta_description: toOptionalString(record.meta_description),
    featured_image_url: toOptionalString(record.featured_image_url),
    keywords: toOptionalString(record.keywords),
    ai_model: toOptionalString(record.ai_model) as BlogPost['ai_model'] | undefined,
    reference_url: toOptionalString(record.reference_url),
    generation_instructions: toOptionalString(record.generation_instructions),
    author: toOptionalString(record.author) ?? 'Global Genex Inc.',
    published_at: toOptionalString(record.published_at),
    created_at: toOptionalString(record.created_at),
    updated_at: toOptionalString(record.updated_at)
  }
}
