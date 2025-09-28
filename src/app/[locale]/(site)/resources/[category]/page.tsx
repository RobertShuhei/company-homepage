import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

// Fetch resources by category from API
async function getResourcesByCategory(locale: string, category: ResourceCategory): Promise<PublicResourcePost[]> {
  try {
    let posts = await getPublishedBlogPosts({ language: locale, category, limit: 50 })

    if (posts.length === 0) {
      const fallbackPosts = await getPublishedBlogPosts({ language: locale, limit: 50 })
      const categoryTagMap: Record<ResourceCategory, string> = {
        'case-studies': 'case-study',
        'white-papers': 'white-paper',
        'industry-insights': 'industry-insight',
        blog: 'blog',
      }

      const expectedTag = categoryTagMap[category]
      posts = fallbackPosts.filter((post) => {
        const normalizedCategory = post.resource_category ?? undefined
        if (normalizedCategory === category) {
          return true
        }
        return Array.isArray(post.tags) ? post.tags.includes(expectedTag) : false
      })
    }

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

// Get category display names and descriptions
function getCategoryInfo(category: ResourceCategory, locale: string) {
  const categoryInfo = {
    'case-studies': {
      name: {
        ja: '事例研究',
        en: 'Case Studies',
        zh: '案例研究'
      },
      description: {
        ja: '実際のクライアント事例と成功ストーリーをご紹介します',
        en: 'Real client cases and success stories',
        zh: '真实的客户案例和成功故事'
      }
    },
    'white-papers': {
      name: {
        ja: 'ホワイトペーパー',
        en: 'White Papers',
        zh: '白皮书'
      },
      description: {
        ja: '専門的な研究レポートと業界分析をお届けします',
        en: 'Expert research reports and industry analysis',
        zh: '专业研究报告和行业分析'
      }
    },
    'industry-insights': {
      name: {
        ja: '業界インサイト',
        en: 'Industry Insights',
        zh: '行业洞察'
      },
      description: {
        ja: '最新の業界動向と市場分析をお伝えします',
        en: 'Latest industry trends and market analysis',
        zh: '最新的行业趋势和市场分析'
      }
    },
    'blog': {
      name: {
        ja: 'ブログ',
        en: 'Blog',
        zh: '博客'
      },
      description: {
        ja: 'AI活用・製造業DX・市場参入支援の専門的な知見をお届けします',
        en: 'Expert insights on AI utilization, manufacturing DX, and market entry support',
        zh: 'AI应用、制造业数字化转型、市场进入支持的专业见解'
      }
    }
  }

  const info = categoryInfo[category as keyof typeof categoryInfo]
  if (!info) return null

  return {
    name: info.name[locale as keyof typeof info.name] || info.name.en,
    description: info.description[locale as keyof typeof info.description] || info.description.en
  }
}

export async function generateStaticParams() {
  return RESOURCE_CATEGORIES.map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale: paramLocale, category } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'

  if (!isResourceCategory(category)) {
    return {
      title: 'Page Not Found | Global Genex Inc.',
      description: 'The requested page was not found.'
    }
  }

  const categoryInfo = getCategoryInfo(category, locale)
  if (!categoryInfo) {
    return {
      title: 'Page Not Found | Global Genex Inc.',
      description: 'The requested page was not found.'
    }
  }

  const title = `${categoryInfo.name} | Global Genex Inc.`
  const description = categoryInfo.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale: paramLocale, category } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'

  // Validate category
  if (!isResourceCategory(category)) {
    notFound()
  }

  const categoryInfo = getCategoryInfo(category, locale)
  if (!categoryInfo) {
    notFound()
  }

  const resources = await getResourcesByCategory(locale, category)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link
              href={`/${locale}/resources`}
              className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label={`Back to ${locale === 'ja' ? 'リソース' : locale === 'zh' ? '资源' : 'Resources'}`}
            >
              {locale === 'ja' ? 'リソース' : locale === 'zh' ? '资源' : 'Resources'}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-gray-900" aria-current="page">{categoryInfo.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryInfo.name}
          </h1>
          <p className="text-gray-600 mb-12">
            {categoryInfo.description}
          </p>

          {resources.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {locale === 'ja' ? '現在表示できる記事はありません。' : locale === 'zh' ? '当前没有可显示的文章。' : 'No entries available yet.'}
              </h2>
              <p className="text-gray-600">
                {locale === 'ja'
                  ? '公開され次第、こちらに記事が表示されます。'
                  : locale === 'zh'
                  ? '一旦内容发布，将显示在此处。'
                  : 'Articles will appear here as soon as they are published.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {resources.map((resource) => (
                <article key={resource.uuid || resource.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <time dateTime={resource.published_at}>
                        {formatDate(resource.published_at, locale)}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{resource.author}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      <Link
                        href={`/${locale}/resources/${category}/${resource.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {resource.title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {resource.summary || getExcerpt(resource.content)}
                    </p>

                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {resource.tags.map((tag) => (
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
          )}
        </div>
      </div>
    </main>
  )
}
