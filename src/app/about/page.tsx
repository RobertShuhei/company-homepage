import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { parseAcceptLanguage, type Locale, defaultLocale } from '../../../i18n.config'

export default async function AboutRedirect() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  
  let detectedLocale: Locale = defaultLocale
  
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage)
    if (parsed) {
      detectedLocale = parsed
    }
  }
  
  redirect(`/${detectedLocale}/about`)
}