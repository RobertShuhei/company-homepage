import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '../../i18n.config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://global-genex.com'
  const currentDate = new Date().toISOString()

  // Page definitions with their priorities and change frequencies
  const pages = [
    {
      path: '',
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      path: '/about',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/services',
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      path: '/contact',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      path: '/privacy',
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Generate URLs for all locales
  const sitemapEntries: MetadataRoute.Sitemap = []

  pages.forEach((page) => {
    locales.forEach((locale) => {
      const isDefault = locale === defaultLocale
      const localePath = isDefault ? page.path : `/${locale}${page.path}`
      const url = page.path === '' ? 
        (isDefault ? baseUrl : `${baseUrl}/${locale}`) : 
        `${baseUrl}${localePath}`

      sitemapEntries.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    })
  })

  return sitemapEntries
}

// Optional: Generate dynamic sitemap for future blog posts or case studies
export async function generateDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  // Future implementation for dynamic content like blog posts
  // const baseUrl = 'https://global-genex.com'
  // const posts = await getBlogPosts()
  // const dynamicPages = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))
  
  return []
}