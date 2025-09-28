import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { getBlogPostBySlug } from '@/lib/supabase'

// Blog post interface for public consumption
interface PublicBlogPost {
  id: number
  uuid: string
  title: string
  slug: string
  content: string
  summary?: string
  language: string
  tags?: string[]
  meta_description?: string
  featured_image_url?: string
  keywords?: string
  author: string
  published_at: string
  created_at: string
}

// Fetch specific blog post from API
async function getBlogPost(slug: string, locale: string): Promise<PublicBlogPost | null> {
  try {
    const post = await getBlogPostBySlug(slug, locale)
    if (!post || post.status !== 'published') {
      return null
    }

    return {
      id: post.id ?? 0,
      uuid: post.uuid ?? '',
      title: post.title,
      slug: post.slug,
      content: post.content,
      summary: post.summary ?? undefined,
      language: post.language,
      tags: post.tags ?? undefined,
      meta_description: post.meta_description ?? undefined,
      featured_image_url: post.featured_image_url ?? undefined,
      keywords: post.keywords ?? undefined,
      author: post.author,
      published_at: post.published_at ?? post.created_at ?? new Date().toISOString(),
      created_at: post.created_at ?? new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Format date for display
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  switch (locale) {
    case 'ja':
      return date.toLocaleDateString('ja-JP', options)
    case 'zh':
      return date.toLocaleDateString('zh-CN', options)
    case 'en':
    default:
      return date.toLocaleDateString('en-US', options)
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)

  if (!post) {
    return {
      title: 'Blog Post Not Found | Global Genex Inc.'
    }
  }

  return {
    title: `${post.title} | Global Genex Inc.`,
    description: post.meta_description || post.summary || post.title,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.summary || post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.summary || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    }
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = await getBlogPost(slug, locale)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-12">
          <nav className="mb-8">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'ja' ? 'ブログ一覧に戻る' : locale === 'zh' ? '返回博客列表' : 'Back to Blog'}
            </Link>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-8">
            <div className="flex items-center">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.published_at}>
                {formatDate(post.published_at, locale)}
              </time>
            </div>

            <div className="flex items-center">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{post.author}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.summary && (
            <div className="bg-gray-50 border-l-4 border-blue-500 p-6 mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-12">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              width={1280}
              height={720}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-6 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-gray-50 italic text-gray-700">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-6">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                {locale === 'ja' ? '著者：' : locale === 'zh' ? '作者：' : 'Author: '}
                <span className="font-medium">{post.author}</span>
              </p>
              <p className="text-sm text-gray-500">
                {locale === 'ja' ? '公開日：' : locale === 'zh' ? '发布日期：' : 'Published: '}
                {formatDate(post.published_at, locale)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href={`/${locale}/contact`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {locale === 'ja' ? 'お問い合わせ' : locale === 'zh' ? '联系我们' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  )
}
