'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { AdminBlogFilter, AdminBlogPost, FetchBlogPostsAction, ResourceCategory } from './types'

interface AdminBlogClientProps {
  locale: string
  initialPosts: AdminBlogPost[]
  defaultFilter: AdminBlogFilter
  fetchBlogPostsAction: FetchBlogPostsAction
}

const STATUS_LABELS: Record<string, Record<string, string>> = {
  ja: { published: '公開済み', draft: '下書き', archived: 'アーカイブ' },
  en: { published: 'Published', draft: 'Draft', archived: 'Archived' },
  zh: { published: '已发布', draft: '草稿', archived: '已归档' }
}

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800'
}

const CATEGORY_LABELS: Record<string, Record<ResourceCategory, string>> = {
  ja: {
    'case-studies': '事例研究',
    'white-papers': 'ホワイトペーパー',
    'industry-insights': '業界インサイト',
    blog: 'ブログ'
  },
  en: {
    'case-studies': 'Case Studies',
    'white-papers': 'White Papers',
    'industry-insights': 'Industry Insights',
    blog: 'Blog'
  },
  zh: {
    'case-studies': '案例研究',
    'white-papers': '白皮书',
    'industry-insights': '行业洞察',
    blog: '博客'
  }
}

export default function AdminBlogClient({
  locale,
  initialPosts,
  defaultFilter,
  fetchBlogPostsAction,
}: AdminBlogClientProps) {
  const [blogPosts, setBlogPosts] = useState<AdminBlogPost[]>(initialPosts)
  const [filter, setFilter] = useState<AdminBlogFilter>(defaultFilter)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string): string => STATUS_COLORS[status] || STATUS_COLORS.archived

  const getStatusLabel = (status: string): string => {
    const localized = STATUS_LABELS[locale]?.[status]
    return localized ?? status
  }

  const getCategoryLabel = (category: ResourceCategory | undefined): string => {
    if (!category) {
      return '-'
    }
    const localized = CATEGORY_LABELS[locale]?.[category]
    return localized ?? category
  }

  const handleFetch = (nextFilter: AdminBlogFilter) => {
    setError(null)
    startTransition(async () => {
      try {
        const data = await fetchBlogPostsAction(nextFilter)
        setBlogPosts(data)
      } catch (err) {
        console.error('Failed to fetch admin blog posts:', err)
        setError('ブログ記事の取得に失敗しました。')
      }
    })
  }

  const handleFilterChange = (key: keyof AdminBlogFilter, value: string) => {
    const parsedValue = key === 'limit' ? Number.parseInt(value, 10) : value
    const nextFilter = {
      ...filter,
      [key]: key === 'limit'
        ? Number.isNaN(parsedValue)
          ? filter.limit
          : parsedValue
        : value,
    } as AdminBlogFilter

    setFilter(nextFilter)
    handleFetch(nextFilter)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ブログ記事管理</h1>
          <p className="text-gray-600">公開済みブログ記事の管理と新規記事の作成</p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <Link
            href={`/${locale}/admin/generator`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            新規記事作成
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">言語</label>
            <select
              value={filter.language}
              onChange={(event) => handleFilterChange('language', event.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              disabled={isPending}
            >
              <option value="all">すべて</option>
              <option value="ja">日本語</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              value={filter.status}
              onChange={(event) => handleFilterChange('status', event.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              disabled={isPending}
            >
              <option value="all">すべて</option>
              <option value="published">公開済み</option>
              <option value="draft">下書き</option>
              <option value="archived">アーカイブ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示件数</label>
            <select
              value={filter.limit}
              onChange={(event) => handleFilterChange('limit', event.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              disabled={isPending}
            >
              <option value={10}>10件</option>
              <option value={20}>20件</option>
              <option value={50}>50件</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => handleFetch(filter)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-60"
              disabled={isPending}
            >
              {isPending ? '更新中…' : '更新'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {blogPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ブログ記事が見つかりません</h3>
          <p className="text-gray-600 mb-4">現在のフィルター条件に該当する記事がありません。</p>
          <Link
            href={`/${locale}/admin/generator`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            新規記事を作成
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">言語</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公開日</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.uuid} className={isPending ? 'opacity-70' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500">/{post.language}/resources/{post.resource_category ?? 'blog'}/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 uppercase">{post.language}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getCategoryLabel(post.resource_category)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getStatusColor(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(post.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.published_at ? formatDate(post.published_at) : '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/${locale}/admin/generator?post=${post.uuid}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編集
                        </Link>
                        <Link
                          href={`/${locale}/resources/${post.resource_category ?? 'blog'}/${post.slug}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          表示
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
