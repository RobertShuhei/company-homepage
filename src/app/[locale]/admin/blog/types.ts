export const BLOG_RESOURCE_CATEGORIES = ['case-studies', 'white-papers', 'industry-insights', 'blog'] as const

export type ResourceCategory = typeof BLOG_RESOURCE_CATEGORIES[number]

export type AdminBlogStatus = 'draft' | 'published' | 'archived'

export interface AdminBlogPost {
  id: number
  uuid: string
  title: string
  slug: string
  content: string
  original_content?: string
  summary?: string
  language: string
  status: AdminBlogStatus
  resource_category?: ResourceCategory
  tags?: string[]
  meta_description?: string
  keywords?: string
  ai_model?: string
  author: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface AdminBlogFilter {
  language: string
  status: string
  limit: number
}

export type FetchBlogPostsAction = (filter: AdminBlogFilter) => Promise<AdminBlogPost[]>
