import { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedBlogPosts, type BlogPost } from '@/lib/supabase'
import { isValidLocale, defaultLocale } from '@/lib/i18n'

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

// Fetch blog posts from API
async function getBlogPosts(locale: string): Promise<PublicBlogPost[]> {
  try {
    const posts = await getPublishedBlogPosts({ language: locale, limit: 20 })
    return posts.map(mapBlogPostToPublic)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

function mapBlogPostToPublic(post: BlogPost): PublicBlogPost {
  return {
    id: post.id ?? 0,
    uuid: post.uuid ?? '',
    title: post.title,
    slug: post.slug,
    content: post.content,
    summary: post.summary,
    language: post.language,
    tags: post.tags,
    meta_description: post.meta_description,
    featured_image_url: post.featured_image_url,
    keywords: post.keywords,
    author: post.author,
    published_at: post.published_at ?? post.created_at ?? new Date().toISOString(),
    created_at: post.created_at ?? new Date().toISOString(),
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

// Extract excerpt from content
function getExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown formatting for excerpt
  const plainText = content
    .replace(/^#+\s/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale

  const titles = {
    ja: 'ブログ記事一覧 | Global Genex Inc.',
    en: 'Blog Articles | Global Genex Inc.',
    zh: '博客文章 | Global Genex Inc.'
  }

  const descriptions = {
    ja: 'Global Genex Inc.の専門家によるAI活用、製造業DX、市場参入支援に関する最新ブログ記事をご覧ください。',
    en: 'Read the latest blog articles by Global Genex Inc. experts on AI utilization, manufacturing DX, and market entry support.',
    zh: '阅读Global Genex Inc.专家关于AI应用、制造业数字化转型和市场进入支持的最新博客文章。'
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.ja,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.ja,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.ja,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.ja,
      type: 'website',
    }
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale
  const blogPosts = await getBlogPosts(locale)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {locale === 'ja' ? 'ブログ記事' : locale === 'zh' ? '博客文章' : 'Blog Articles'}
          </h1>
          <p className="text-gray-600 mb-12">
            {locale === 'ja'
              ? 'AI活用・製造業DX・市場参入支援の専門的な知見をお届けします'
              : locale === 'zh'
              ? '为您提供AI应用、制造业数字化转型、市场进入支持的专业见解'
              : 'Expert insights on AI utilization, manufacturing DX, and market entry support'}
          </p>

          {blogPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {locale === 'ja' ? '現在公開中の記事はありません。' : locale === 'zh' ? '当前没有已发布的文章。' : 'No published articles yet.'}
              </h2>
              <p className="text-gray-600">
                {locale === 'ja'
                  ? '新しい記事が公開され次第、こちらに表示されます。'
                  : locale === 'zh'
                  ? '一旦有新文章发布，将在此显示。'
                  : 'New articles will appear here once they are published.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post) => (
                <article key={post.uuid || post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <time dateTime={post.published_at}>
                        {formatDate(post.published_at, locale)}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {post.summary || getExcerpt(post.content)}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {locale === 'ja' ? '続きを読む' : locale === 'zh' ? '阅读更多' : 'Read More'}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
