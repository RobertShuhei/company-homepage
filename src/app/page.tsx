import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { parseAcceptLanguage, type Locale, defaultLocale } from '../../i18n.config'

export default async function RootPage() {
  // This page should not render - middleware should handle redirection
  // But if it does render, perform server-side locale detection
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  
  let detectedLocale: Locale = defaultLocale
  
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage)
    if (parsed) {
      detectedLocale = parsed
    }
  }
  
  // Redirect to the detected locale
  redirect(`/${detectedLocale}`)
}