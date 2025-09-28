import { notFound, redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { getServerTranslations } from '@/lib/translations'
import { validateAdminSession } from '@/lib/adminSession'

interface AdminLoginPageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ redirectTo?: string } | undefined>
}

export default async function AdminLoginPage({ params, searchParams }: AdminLoginPageProps) {
  const { locale: localeParam } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  if (!isValidLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const defaultTarget = `/${locale}/admin/blog`
  const requestedRedirect = resolvedSearchParams?.redirectTo || defaultTarget
  const redirectTo = requestedRedirect.startsWith(`/${locale}/`) ? requestedRedirect : defaultTarget

  if (await validateAdminSession()) {
    redirect(redirectTo)
  }

  const fullMessages = await getServerTranslations(locale)

  return (
    <LoginForm
      redirectTo={redirectTo}
      messages={fullMessages.admin?.login}
    />
  )
}
