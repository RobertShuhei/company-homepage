import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'
import Script from 'next/script'
import { getServerTranslations } from '@/lib/translations'
import { generateLocalizedMetadata } from '@/lib/metadata'
import { type Locale, isValidLocale, defaultLocale } from '../../../middleware'
import { notFound } from 'next/navigation'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: locale === defaultLocale ? '/' : `/${locale}`,
    page: 'home'
  });
}

export default async function LocalizedHomePage({ params }: HomePageProps) {
  const resolvedParams = await params;
  
  // Validate locale
  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const t = await getServerTranslations(locale);

  // Service data with localized content
  const services = [
    {
      title: t.homepage.services.manufacturing.title,
      description: t.homepage.services.manufacturing.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: t.homepage.services.it.title,
      description: t.homepage.services.it.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: t.homepage.services.market.title,
      description: t.homepage.services.market.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  const features = [
    {
      title: t.homepage.features.dataExecution.title,
      description: t.homepage.features.dataExecution.description
    },
    {
      title: t.homepage.features.handsOn.title,
      description: t.homepage.features.handsOn.description
    },
    {
      title: t.homepage.features.bilingual.title,
      description: t.homepage.features.bilingual.description
    },
    {
      title: t.homepage.features.practical.title,
      description: t.homepage.features.practical.description
    }
  ]

  // Generate locale-aware URLs
  const baseURL = locale === defaultLocale ? '' : `/${locale}`;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://global-genex.com/#website",
              url: "https://global-genex.com",
              name: locale === 'ja' ? "株式会社グローバルジェネックス" : "Global Genex Inc.",
              description: locale === 'ja' 
                ? "日本とグローバルな小売・製造業向けの専門コンサルティング。AIを活用したデータ分析、市場参入支援、デジタル変革サービス。"
                : "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services.",
              publisher: {
                "@id": "https://global-genex.com/#organization"
              },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `https://global-genex.com${baseURL}/services?search={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              ],
              inLanguage: locale,
              copyrightYear: 2025,
              copyrightHolder: {
                "@id": "https://global-genex.com/#organization"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `https://global-genex.com${baseURL}#webpage`,
              url: `https://global-genex.com${baseURL}`,
              name: locale === 'ja' 
                ? "株式会社グローバルジェネックス - 小売・製造業コンサルティングの専門家"
                : "Global Genex Inc. - Expert Retail & Manufacturing Consulting",
              isPartOf: {
                "@id": "https://global-genex.com/#website"
              },
              about: {
                "@id": "https://global-genex.com/#organization"
              },
              description: locale === 'ja'
                ? "AIを活用した実践的コンサルティングで業務変革を実現。小売・製造業向けのプロフェッショナルコンサルティングサービス。"
                : "Transform your operations with AI-driven, hands-on consulting. Professional consulting services for retail & manufacturing companies with practical execution.",
              breadcrumb: {
                "@id": `https://global-genex.com${baseURL}#breadcrumb`
              },
              inLanguage: locale,
              potentialAction: [
                {
                  "@type": "ReadAction",
                  target: [`https://global-genex.com${baseURL}`]
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": `https://global-genex.com${baseURL}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === 'ja' ? "ホーム" : "Home",
                  item: `https://global-genex.com${baseURL}`
                }
              ]
            }
          ])
        }}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <Hero
          title={t.homepage.hero.title}
          subtitle={t.homepage.hero.subtitle}
          description={t.homepage.hero.description}
          primaryCTA={{ text: t.homepage.hero.primaryCTA, href: `${baseURL}/contact` }}
          secondaryCTA={{ text: t.homepage.hero.secondaryCTA, href: `${baseURL}/services` }}
        />

        {/* Services Section */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8">
                {t.homepage.services.title}
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                {t.homepage.services.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-gap-enhanced">
              {services.map((service, index) => (
                <Card
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href={`${baseURL}/services`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-spacing bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">
                {t.homepage.features.title}
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                {t.homepage.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 grid-gap-enhanced">
              {features.map((feature, index) => (
                <div key={index} className="text-center h-full">
                  <div className="card-enhanced p-8 lg:p-10 h-full">
                    <h3 className="text-xl lg:text-2xl font-semibold text-navy mb-5 lg:mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-gray text-base lg:text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA
          title={t.homepage.cta.title}
          description={t.homepage.cta.description}
          primaryButton={{ text: t.homepage.cta.primaryButton, href: `${baseURL}/contact` }}
          secondaryButton={{ text: t.homepage.cta.secondaryButton, href: `${baseURL}/about` }}
          variant="light"
        />
      </main>

      <Footer />
    </div>
  )
}