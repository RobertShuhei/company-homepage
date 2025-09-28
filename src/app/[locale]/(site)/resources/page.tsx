import { Metadata } from 'next'
import Link from 'next/link'
import { RESOURCE_CATEGORIES, isResourceCategory, type ResourceCategory } from '@/lib/resourceCategories'
import { isValidLocale } from '@/lib/i18n'
import { getPublishedBlogPosts, type BlogPost } from '@/lib/supabase'

// Resource post interface for public consumption
interface PublicResourcePost {
  id: number
  uuid: string
  title: string
  slug: string
  content: string
  summary?: string
  language: string
  resource_category: string
  tags?: string[]
  meta_description?: string
  featured_image_url?: string
  keywords?: string
  author: string
  published_at: string
  created_at: string
}

// Fetch all published resources from API
async function getAllResources(locale: string): Promise<PublicResourcePost[]> {
  try {
    const posts = await getPublishedBlogPosts({ language: locale, limit: 50 })
    return posts.map(mapBlogPostToResource)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

function mapBlogPostToResource(post: BlogPost): PublicResourcePost {
  return {
    id: post.id ?? 0,
    uuid: post.uuid ?? '',
    title: post.title,
    slug: post.slug,
    content: post.content,
    summary: post.summary,
    language: post.language,
    resource_category: post.resource_category ?? 'blog',
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
  const plainText = content
    .replace(/^#+\s/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// Get category display name
function getCategoryDisplayName(category: ResourceCategory, locale: string): string {
  const categoryNames = {
    'case-studies': {
      ja: '事例研究',
      en: 'Case Studies',
      zh: '案例研究'
    },
    'white-papers': {
      ja: 'ホワイトペーパー',
      en: 'White Papers',
      zh: '白皮书'
    },
    'industry-insights': {
      ja: '業界インサイト',
      en: 'Industry Insights',
      zh: '行业洞察'
    },
    'blog': {
      ja: 'ブログ',
      en: 'Blog',
      zh: '博客'
    }
  }

  return categoryNames[category]?.[locale as keyof typeof categoryNames['case-studies']] || category
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: paramLocale } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'

  const titles = {
    ja: 'リソース一覧 | Global Genex Inc.',
    en: 'Resources | Global Genex Inc.',
    zh: '资源 | Global Genex Inc.'
  }

  const descriptions = {
    ja: 'Global Genex Inc.の事例研究、ホワイトペーパー、業界インサイト、ブログ記事をご覧ください。',
    en: 'Explore Global Genex Inc.\'s case studies, white papers, industry insights, and blog articles.',
    zh: '探索Global Genex Inc.的案例研究、白皮书、行业洞察和博客文章。'
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

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: paramLocale } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'
  const allResources = await getAllResources(locale)

  // Group resources by category
  const resourcesByCategory = allResources.reduce((acc, resource) => {
    const category = isResourceCategory(resource.resource_category)
      ? resource.resource_category
      : 'blog'

    if (!acc[category]) {
      acc[category] = []
    }

    acc[category].push(resource)
    return acc
  }, {} as Record<ResourceCategory, PublicResourcePost[]>)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {locale === 'ja' ? 'リソース' : locale === 'zh' ? '资源' : 'Resources'}
          </h1>
          <p className="text-gray-600 mb-12">
            {locale === 'ja'
              ? '事例研究、ホワイトペーパー、業界インサイト、ブログ記事をご覧ください'
              : locale === 'zh'
              ? '查看案例研究、白皮书、行业洞察和博客文章'
              : 'Explore our case studies, white papers, industry insights, and blog articles'}
          </p>

          {RESOURCE_CATEGORIES.map(category => {
            const resources = resourcesByCategory[category] || []
            if (resources.length === 0) return null

            return (
              <section key={category} className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {getCategoryDisplayName(category, locale)}
                  </h2>
                  <Link
                    href={`/${locale}/resources/${category}`}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {locale === 'ja' ? 'すべて見る' : locale === 'zh' ? '查看全部' : 'View All'} →
                  </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.slice(0, 3).map((resource) => (
                    <article key={resource.uuid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <time dateTime={resource.published_at}>
                            {formatDate(resource.published_at, locale)}
                          </time>
                          <span className="mx-2">•</span>
                          <span>{resource.author}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          <Link
                            href={`/${locale}/resources/${category}/${resource.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {resource.title}
                          </Link>
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-4">
                          {resource.summary || getExcerpt(resource.content, 150)}
                        </p>

                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/${locale}/resources/${category}/${resource.slug}`}
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
              </section>
            )
          })}

          {allResources.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {locale === 'ja' ? 'コンテンツ準備中' : locale === 'zh' ? '内容准备中' : 'Coming Soon'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ja'
                  ? 'AI活用、製造業DX、市場参入支援に関する専門的なリソースを準備しています。今しばらくお待ちください。'
                  : locale === 'zh'
                  ? '我们正在准备关于AI应用、制造业数字化转型和市场进入支持的专业资源，敬请期待。'
                  : 'We are preparing expert resources on AI utilization, manufacturing DX, and market entry support. Please stay tuned.'}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {locale === 'ja' ? 'お問い合わせ' : locale === 'zh' ? '联系我们' : 'Contact Us'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
