import { redirect } from 'next/navigation'
import { getBlogPosts, type BlogPost } from '@/lib/supabase'
import { defaultLocale, isValidLocale } from '@/lib/i18n'
import { requireAdminSession, validateAdminSession } from '@/lib/adminSession'
import AdminBlogClient from './AdminBlogClient'
import { type AdminBlogFilter, type AdminBlogPost } from './types'

const DEFAULT_LIMIT = 20

function toAdminBlogPosts(posts: BlogPost[]): AdminBlogPost[] {
  return posts.map((post) => ({
    id: post.id ?? 0,
    uuid: post.uuid ?? '',
    title: post.title,
    slug: post.slug,
    content: post.content,
    original_content: post.original_content ?? undefined,
    summary: post.summary ?? undefined,
    language: post.language,
    status: post.status,
    resource_category: post.resource_category,
    tags: post.tags ?? undefined,
    meta_description: post.meta_description ?? undefined,
    keywords: post.keywords ?? undefined,
    ai_model: post.ai_model ?? undefined,
    author: post.author ?? 'Global Genex Inc.',
    published_at: post.published_at ?? undefined,
    created_at: post.created_at ?? new Date().toISOString(),
    updated_at: post.updated_at ?? new Date().toISOString(),
  }))
}

function buildFilters(filter: AdminBlogFilter) {
  return {
    language: filter.language === 'all' ? undefined : filter.language,
    status: filter.status === 'all' ? undefined : filter.status,
    limit: filter.limit,
  }
}

export default async function AdminBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale

  const currentPath = `/${locale}/admin/blog`
  await requireAdminSession(locale, currentPath)

  const defaultFilter: AdminBlogFilter = {
    language: locale,
    status: 'all',
    limit: DEFAULT_LIMIT,
  }

  const initialPosts = await getBlogPosts(buildFilters(defaultFilter))

  async function fetchBlogPostsAction(filter: AdminBlogFilter): Promise<AdminBlogPost[]> {
    'use server'
    if (!(await validateAdminSession())) {
      redirect(`/${locale}/admin/login?redirectTo=${encodeURIComponent(currentPath)}`)
    }
    const posts = await getBlogPosts(buildFilters(filter))
    return toAdminBlogPosts(posts)
  }

  return (
    <AdminBlogClient
      locale={locale}
      initialPosts={toAdminBlogPosts(initialPosts)}
      defaultFilter={defaultFilter}
      fetchBlogPostsAction={fetchBlogPostsAction}
    />
  )
}
