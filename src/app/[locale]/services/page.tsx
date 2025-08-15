import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import CTA from '@/components/ui/CTA'
import Script from 'next/script'
import { getServerTranslations } from '@/lib/translations'
import { generateLocalizedMetadata } from '@/lib/metadata'
import { type Locale, isValidLocale, defaultLocale } from '../../../../middleware'
import { notFound } from 'next/navigation'

interface ServicesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: locale === defaultLocale ? '/services' : `/${locale}/services`,
    page: 'services'
  });
}

export default async function LocalizedServicesPage({ params }: ServicesPageProps) {
  const resolvedParams = await params;
  
  // Validate locale
  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const t = await getServerTranslations(locale);

  // Generate locale-aware URLs
  const baseURL = locale === defaultLocale ? '' : `/${locale}`;

  // Services with localized content
  const services = [
    {
      title: t.services.retail.title,
      description: t.services.retail.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: t.services.retail.features,
    },
    {
      title: t.services.inventory.title,
      description: t.services.inventory.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      features: t.services.inventory.features,
    },
    {
      title: t.services.analytics.title,
      description: t.services.analytics.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: t.services.analytics.features,
    },
    {
      title: t.services.market.title,
      description: t.services.market.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: t.services.market.features,
    },
  ]

  // Industries with localized content
  const industries = [
    {
      name: t.services.industries.retail.name,
      description: t.services.industries.retail.description,
      expertise: t.services.industries.retail.expertise,
    },
    {
      name: t.services.industries.manufacturing.name,
      description: t.services.industries.manufacturing.description,
      expertise: t.services.industries.manufacturing.expertise,
    },
    {
      name: t.services.industries.smes.name,
      description: t.services.industries.smes.description,
      expertise: t.services.industries.smes.expertise,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `https://global-genex.com${baseURL}/services#webpage`,
              url: `https://global-genex.com${baseURL}/services`,
              name: locale === 'ja' 
                ? "プロフェッショナルコンサルティングサービス - グローバルジェネックス株式会社"
                : "Professional Consulting Services - Global Genex Inc.",
              isPartOf: {
                "@id": "https://global-genex.com/#website"
              },
              about: {
                "@id": "https://global-genex.com/#organization"
              },
              description: locale === 'ja'
                ? "小売・製造業向けの包括的コンサルティングソリューション。業務改善、データ分析、市場参入の専門知識。"
                : "Comprehensive consulting solutions for retail & manufacturing. Operations improvement, data analytics, and market entry expertise.",
              breadcrumb: {
                "@id": `https://global-genex.com${baseURL}/services#breadcrumb`
              },
              inLanguage: locale
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": `https://global-genex.com${baseURL}/services#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === 'ja' ? "ホーム" : "Home",
                  item: `https://global-genex.com${baseURL}`
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: locale === 'ja' ? "サービス" : "Services",
                  item: `https://global-genex.com${baseURL}/services`
                }
              ]
            },
            // Service schemas for each offering
            ...services.map((service, index) => ({
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `https://global-genex.com${baseURL}/services#service-${index}`,
              name: service.title,
              provider: {
                "@id": "https://global-genex.com/#organization"
              },
              serviceType: "Business Consulting",
              description: service.description,
              category: "Operations Consulting",
              audience: {
                "@type": "Audience",
                audienceType: locale === 'ja' ? "小売・製造業企業" : "Retail & Manufacturing Companies"
              },
              areaServed: ["Japan", "Global"],
              availableLanguage: ["Japanese", "English"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: service.title,
                itemListElement: service.features.map((feature) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: feature,
                    description: feature
                  }
                }))
              },
              inLanguage: locale
            }))
          ])
        }}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <Hero
          title={t.services.hero.title}
          subtitle={t.services.hero.subtitle}
          description={t.services.hero.description}
          primaryCTA={{ text: t.nav.contact, href: `${baseURL}/contact` }}
          secondaryCTA={{ text: t.nav.about, href: `${baseURL}/about` }}
        />

        {/* Services Overview */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8">
                {t.services.overview.title}
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                {t.services.overview.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 grid-gap-enhanced">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="card-enhanced p-10 lg:p-12 h-full flex flex-col"
                >
                  <div className="flex-shrink-0 mb-6">
                    <div className="w-16 h-16 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-semibold text-navy mb-5">{service.title}</h3>

                  <p className="text-gray text-lg leading-relaxed mb-8 flex-grow">{service.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy text-lg">{t.common.typicalWork}</h4>
                    <ul className="text-base text-gray space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <span className="text-teal mr-3 text-lg font-medium">•</span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Focus */}
        <section className="section-spacing bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">{t.services.industries.title}</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                {t.services.industries.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-gap-enhanced">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="card-enhanced p-10 h-full"
                >
                  <h3 className="text-xl lg:text-2xl font-semibold text-navy mb-5">{industry.name}</h3>

                  <p className="text-gray text-base lg:text-lg leading-relaxed mb-8">{industry.description}</p>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-navy text-base">{t.common.specializations}</h4>
                    <div className="flex flex-wrap gap-3">
                      {industry.expertise.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">{t.services.process.title}</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                {t.services.process.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-gap-enhanced">
              {t.services.process.steps.map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-teal text-white rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold mx-auto mb-6">
                    {phase.step}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-navy mb-4">{phase.title}</h3>
                  <p className="text-gray text-base lg:text-lg leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTA
          title={t.services.cta.title}
          description={t.services.cta.description}
          primaryButton={{ text: t.services.cta.primaryButton, href: `${baseURL}/contact` }}
          secondaryButton={{ text: t.services.cta.secondaryButton, href: `${baseURL}/about` }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  )
}