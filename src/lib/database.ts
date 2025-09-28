import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'

// Database interface for blog posts
export interface BlogPost {
  id?: number
  title: string
  slug: string
  content: string
  originalContent?: string
  summary?: string
  language: 'ja' | 'en' | 'zh'
  status: 'draft' | 'published' | 'archived'
  tags?: string[]
  metaDescription?: string
  featuredImageUrl?: string
  keywords?: string
  aiModel?: 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5'
  referenceUrl?: string
  generationInstructions?: string
  author?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

let db: Database | null = null

// Initialize database connection
export async function getDatabase(): Promise<Database> {
  if (db) {
    return db
  }

  const dbPath = path.join(process.cwd(), 'data', 'blog.db')

  // Ensure data directory exists
  const fs = await import('fs/promises')
  const dataDir = path.dirname(dbPath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  // Initialize tables
  await initializeTables()

  return db
}

// Create database tables
async function initializeTables() {
  if (!db) return

  await db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      original_content TEXT,
      summary TEXT,
      language TEXT NOT NULL DEFAULT 'ja',
      status TEXT NOT NULL DEFAULT 'draft',
      tags TEXT, -- JSON array as string
      meta_description TEXT,
      featured_image_url TEXT,
      keywords TEXT,
      ai_model TEXT,
      reference_url TEXT,
      generation_instructions TEXT,
      author TEXT DEFAULT 'Global Genex Inc.',
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(slug, language)
    );

    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
  `)
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
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  const database = await getDatabase()

  const now = new Date().toISOString()

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

  const result = await database.run(`
    INSERT INTO blog_posts (
      title, slug, content, original_content, summary, language, status,
      tags, meta_description, featured_image_url, keywords, ai_model,
      reference_url, generation_instructions, author, published_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    post.title,
    slug,
    post.content,
    post.originalContent || null,
    post.summary || null,
    post.language,
    post.status,
    post.tags ? JSON.stringify(post.tags) : null,
    post.metaDescription || null,
    post.featuredImageUrl || null,
    post.keywords || null,
    post.aiModel || null,
    post.referenceUrl || null,
    post.generationInstructions || null,
    post.author || 'Global Genex Inc.',
    post.status === 'published' ? (post.publishedAt || now) : null,
    now,
    now
  ])

  const created = await getBlogPostById(result.lastID!)
  if (!created) {
    throw new Error('Failed to create blog post')
  }

  return created
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const database = await getDatabase()

  const row = await database.get('SELECT * FROM blog_posts WHERE id = ?', [id])

  return row ? formatBlogPost(row) : null
}

// Get blog post by slug and language
export async function getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | null> {
  const database = await getDatabase()

  const row = await database.get(
    'SELECT * FROM blog_posts WHERE slug = ? AND language = ?',
    [slug, language]
  )

  return row ? formatBlogPost(row) : null
}

// Get all blog posts with optional filters
export async function getBlogPosts(options: {
  language?: string
  status?: string
  limit?: number
  offset?: number
} = {}): Promise<BlogPost[]> {
  const database = await getDatabase()

  let query = 'SELECT * FROM blog_posts WHERE 1=1'
  const params: Array<string | number | null> = []

  if (options.language) {
    query += ' AND language = ?'
    params.push(options.language)
  }

  if (options.status) {
    query += ' AND status = ?'
    params.push(options.status)
  }

  query += ' ORDER BY created_at DESC'

  if (options.limit) {
    query += ' LIMIT ?'
    params.push(options.limit)

    if (options.offset) {
      query += ' OFFSET ?'
      params.push(options.offset)
    }
  }

  const rows = await database.all(query, params)

  return rows.map(formatBlogPost)
}

// Update blog post
export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const database = await getDatabase()

  const now = new Date().toISOString()
  const setParts: string[] = []
  const params: Array<string | number | null> = []

  // Build dynamic update query
  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'id' || key === 'createdAt') return // Skip immutable fields

    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    setParts.push(`${dbKey} = ?`)

    if (key === 'tags' && Array.isArray(value)) {
      params.push(JSON.stringify(value))
    } else if (value === undefined) {
      params.push(null)
    } else {
      params.push(typeof value === 'number' || typeof value === 'string' ? value : JSON.stringify(value))
    }
  })

  if (setParts.length === 0) {
    return getBlogPostById(id) // No updates
  }

  // Always update the updated_at timestamp
  setParts.push('updated_at = ?')
  params.push(now)

  // Add ID parameter
  params.push(id)

  await database.run(
    `UPDATE blog_posts SET ${setParts.join(', ')} WHERE id = ?`,
    params
  )

  return getBlogPostById(id)
}

// Delete blog post
export async function deleteBlogPost(id: number): Promise<boolean> {
  const database = await getDatabase()

  const result = await database.run('DELETE FROM blog_posts WHERE id = ?', [id])

  return (result.changes || 0) > 0
}

// Format database row to BlogPost interface
function formatBlogPost(row: unknown): BlogPost {
  if (!row || typeof row !== 'object') {
    throw new Error('Invalid blog post data received from database')
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

  return {
    id: toOptionalNumber(record.id),
    title: toOptionalString(record.title) ?? '',
    slug: toOptionalString(record.slug) ?? '',
    content: toOptionalString(record.content) ?? '',
    originalContent: toOptionalString(record.original_content),
    summary: toOptionalString(record.summary),
    language: (toOptionalString(record.language) as BlogPost['language']) ?? 'ja',
    status: (toOptionalString(record.status) as BlogPost['status']) ?? 'draft',
    tags: parseTags(record.tags),
    metaDescription: toOptionalString(record.meta_description),
    featuredImageUrl: toOptionalString(record.featured_image_url),
    keywords: toOptionalString(record.keywords),
    aiModel: toOptionalString(record.ai_model) as BlogPost['aiModel'] | undefined,
    referenceUrl: toOptionalString(record.reference_url),
    generationInstructions: toOptionalString(record.generation_instructions),
    author: toOptionalString(record.author) ?? 'Global Genex Inc.',
    publishedAt: toOptionalString(record.published_at),
    createdAt: toOptionalString(record.created_at),
    updatedAt: toOptionalString(record.updated_at)
  }
}
