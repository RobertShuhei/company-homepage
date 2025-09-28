import { addLocaleToPathname, type Locale } from '../../i18n.config'

export const RESOURCE_CATEGORIES = ['case-studies', 'white-papers', 'industry-insights', 'blog'] as const

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number]

export const RESOURCE_CATEGORY_SET = new Set<ResourceCategory>(RESOURCE_CATEGORIES)

export function isResourceCategory(value: string): value is ResourceCategory {
  return RESOURCE_CATEGORY_SET.has(value as ResourceCategory)
}

export function getResourceCategoryPath(category: ResourceCategory) {
  return `/resources/${category}`
}

export function getLocalizedResourceCategoryPath(locale: Locale, category: ResourceCategory) {
  return addLocaleToPathname(getResourceCategoryPath(category), locale)
}
