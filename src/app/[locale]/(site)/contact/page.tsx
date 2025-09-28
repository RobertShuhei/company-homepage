import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import LocalizedLink from '@/components/ui/LocalizedLink'
import { getServerTranslations } from '@/lib/translations'
import { generateLocalizedMetadata } from '@/lib/metadata'
import { type Locale, isValidLocale, defaultLocale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params: paramsPromise,
}: ContactPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: locale === defaultLocale ? '/contact' : `/${locale}/contact`,
    page: 'contact'
  });
}

export default async function LocalizedContactPage({ params: paramsPromise }: ContactPageProps) {
  const params = await paramsPromise;

  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const t = await getServerTranslations(locale);

  // Clean URLs will be handled by LocalizedLink component

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t.contact.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                {t.contact.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8">
                  {t.contact.info.title}
                </h2>
                
                <div className="space-y-12">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8" aria-label="Email">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-8">
                      <h3 className="text-2xl font-semibold text-navy mb-2">{t.contact.info.email.title}</h3>
                      <p className="text-gray">{t.contact.info.email.address}</p>
                      <p className="text-gray text-sm mt-1">{t.contact.info.email.response}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8" aria-label="Business hours">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-8">
                      <h3 className="text-2xl font-semibold text-navy mb-2">{t.contact.info.hours.title}</h3>
                      <div className="text-gray space-y-1">
                        <p>{t.contact.info.hours.weekdays}</p>
                        <p>{t.contact.info.hours.saturday}</p>
                        <p>{t.contact.info.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8">
                  {t.contact.form.title}
                </h2>
                
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                {t.contact.services.title}
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                {t.contact.services.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: t.contact.services.manufacturing.title,
                  description: t.contact.services.manufacturing.description,
                  icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: t.contact.services.it.title,
                  description: t.contact.services.it.description,
                  icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: t.contact.services.market.title,
                  description: t.contact.services.market.description,
                  icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                }
              ].map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 text-center">
                  <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center text-teal mx-auto mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <LocalizedLink
                href="/services"
                className="inline-flex items-center bg-teal text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
              >
                {t.contact.services.exploreAll}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </LocalizedLink>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
