import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import { isResourceCategory, type ResourceCategory } from '@/lib/resourceCategories'
import { isValidLocale } from '@/lib/i18n'
import { getBlogPostBySlug } from '@/lib/supabase'

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

// Fetch single resource by slug and category
async function getResourceBySlug(locale: string, category: ResourceCategory, slug: string): Promise<PublicResourcePost | null> {
  try {
    const post = await getBlogPostBySlug(slug, locale)
    if (!post || post.status !== 'published') {
      return null
    }

    if ((post.resource_category ?? 'blog') !== category) {
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
      resource_category: post.resource_category ?? 'blog',
      tags: post.tags ?? undefined,
      meta_description: post.meta_description ?? undefined,
      featured_image_url: post.featured_image_url ?? undefined,
      keywords: post.keywords ?? undefined,
      author: post.author ?? 'Unknown Author',
      published_at: post.published_at ?? post.created_at ?? new Date().toISOString(),
      created_at: post.created_at ?? new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error fetching resource:', error)
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }): Promise<Metadata> {
  const { locale: paramLocale, category, slug } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'

  if (!isResourceCategory(category)) {
    return {
      title: 'Page Not Found | Global Genex Inc.',
      description: 'The requested page was not found.'
    }
  }

  const resource = await getResourceBySlug(locale, category, slug)

  if (!resource) {
    return {
      title: 'Page Not Found | Global Genex Inc.',
      description: 'The requested page was not found.'
    }
  }

  const title = `${resource.title} | Global Genex Inc.`
  const description = resource.meta_description || resource.summary || 'Resource from Global Genex Inc.'

  return {
    title,
    description,
    keywords: resource.keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: resource.published_at,
      authors: [resource.author],
      images: resource.featured_image_url ? [resource.featured_image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resource.featured_image_url ? [resource.featured_image_url] : undefined,
    }
  }
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }) {
  const { locale: paramLocale, category, slug } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : 'ja'

  // Validate category
  if (!isResourceCategory(category)) {
    notFound()
  }

  const resource = await getResourceBySlug(locale, category, slug)

  if (!resource) {
    notFound()
  }

  const categoryDisplayName = getCategoryDisplayName(category, locale)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href={`/${locale}/resources`} className="hover:text-gray-700 transition-colors">
              {locale === 'ja' ? 'リソース' : locale === 'zh' ? '资源' : 'Resources'}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/resources/${category}`} className="hover:text-gray-700 transition-colors">
              {categoryDisplayName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{resource.title}</span>
          </nav>

          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <header className="p-8 border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {categoryDisplayName}
                </span>
                <span className="mx-2">•</span>
                <time dateTime={resource.published_at}>
                  {formatDate(resource.published_at, locale)}
                </time>
                <span className="mx-2">•</span>
                <span>{resource.author}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {resource.title}
              </h1>

              {resource.summary && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {resource.summary}
                </p>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
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
            </header>

            {/* Featured Image */}
            {resource.featured_image_url && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={resource.featured_image_url}
                  alt={resource.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                <ReactMarkdown>{resource.content}</ReactMarkdown>
              </div>
            </div>

            {/* Footer */}
            <footer className="p-8 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {locale === 'ja' ? '最終更新:' : locale === 'zh' ? '最后更新:' : 'Last updated:'}{' '}
                  <time dateTime={resource.created_at}>
                    {formatDate(resource.created_at, locale)}
                  </time>
                </div>

                <Link
                  href={`/${locale}/resources/${category}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {locale === 'ja' ? `${categoryDisplayName}一覧に戻る` : locale === 'zh' ? `返回${categoryDisplayName}列表` : `Back to ${categoryDisplayName}`}
                </Link>
              </div>
            </footer>
          </article>

          {/* Related Content CTA */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'ja' ? 'お問い合わせ' : locale === 'zh' ? '联系我们' : 'Get in Touch'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'ja'
                ? 'このようなソリューションにご興味がおありでしたら、お気軽にお問い合わせください。'
                : locale === 'zh'
                ? '如果您对此类解决方案感兴趣，请随时与我们联系。'
                : 'If you\'re interested in solutions like this, please don\'t hesitate to get in touch.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {locale === 'ja' ? 'お問い合わせ' : locale === 'zh' ? '联系我们' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
