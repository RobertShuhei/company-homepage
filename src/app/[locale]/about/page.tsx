import { Metadata } from 'next'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'
import Script from 'next/script'
import { getServerTranslations } from '@/lib/translations'
import { generateLocalizedMetadata } from '@/lib/metadata'
import { type Locale, isValidLocale, defaultLocale } from '../../../../i18n.config'
import { notFound } from 'next/navigation'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: '/about',
    page: 'about'
  });
}

export default async function LocalizedAboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params;
  
  // Validate locale
  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const t = await getServerTranslations(locale);

  // Generate locale-aware URLs
  const baseURL = `/${locale}`;

  // Values with localized content
  const values = [
    {
      title: t.about.values.excellence.title,
      description: t.about.values.excellence.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
      )
    },
    {
      title: t.about.values.integrity.title,
      description: t.about.values.integrity.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      )
    },
    {
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    },
    {
      title: t.about.values.collaboration.title,
      description: t.about.values.collaboration.description,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    }
  ]

  // Leadership (founder) with localized content
  const leadership = [
    {
      name: t.about.leadership.founder.name,
      position: t.about.leadership.founder.position,
      bio: t.about.leadership.founder.bio,
      expertise: t.about.leadership.founder.expertise
    }
  ]

  // Timeline with localized content
  const milestones = t.about.timeline.milestones

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `https://global-genex.com${baseURL}/about#webpage`,
              url: `https://global-genex.com${baseURL}/about`,
              name: locale === 'ja' 
                ? "株式会社グローバルジェネックスについて - 企業プロフィール・経営陣"
                : "About Global Genex Inc. - Company Profile & Leadership",
              isPartOf: {
                "@id": "https://global-genex.com/#website"
              },
              about: {
                "@id": "https://global-genex.com/#organization"
              },
              description: locale === 'ja'
                ? "福岡を拠点とするコンサルティング会社、株式会社グローバルジェネックスについて。経営陣紹介と小売業者・製造業者の業務改善支援ミッションをご紹介。"
                : "Learn about Global Genex Inc., a consulting company based in Fukuoka, Japan. Meet our leadership team and discover our mission to help retailers and manufacturers improve operations.",
              breadcrumb: {
                "@id": `https://global-genex.com${baseURL}/about#breadcrumb`
              },
              inLanguage: locale,
              potentialAction: [
                {
                  "@type": "ReadAction",
                  target: [`https://global-genex.com${baseURL}/about`]
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": `https://global-genex.com${baseURL}/about#breadcrumb`,
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
                  name: locale === 'ja' ? "会社概要" : "About",
                  item: `https://global-genex.com${baseURL}/about`
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://global-genex.com/about#shuhei-nakahara",
              name: locale === 'ja' ? "中原 修平" : "Shuhei Nakahara",
              givenName: "Shuhei",
              familyName: "Nakahara",
              alternateName: locale === 'ja' ? "Shuhei Nakahara" : "中原 修平",
              jobTitle: locale === 'ja' ? "代表取締役" : "Representative Director",
              description: locale === 'ja'
                ? "福岡を拠点とするバイリンガル（日本語・英語）コンサルタント。小売・製造業務、データ活用、国際展開支援に特化。実践的な現場実行と具体的な対策を提供。"
                : "Bilingual (JP/EN) consultant based in Fukuoka. Focused on retail & manufacturing operations, data utilization, and cross-border enablement. Provides hands-on, on-site execution and practical countermeasures.",
              worksFor: {
                "@type": "Organization",
                "@id": "https://global-genex.com/#organization",
                name: locale === 'ja' ? "株式会社グローバルジェネックス" : "Global Genex Inc."
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Fukuoka",
                addressRegion: "Fukuoka Prefecture",
                addressCountry: "JP"
              },
              nationality: {
                "@type": "Country",
                name: "Japan"
              },
              knowsLanguage: [
                {
                  "@type": "Language",
                  name: "Japanese",
                  alternateName: "ja"
                },
                {
                  "@type": "Language", 
                  name: "English",
                  alternateName: "en"
                }
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Tokyo Institute of Technology",
                sameAs: "https://www.titech.ac.jp/"
              },
              hasOccupation: {
                "@type": "Occupation",
                name: locale === 'ja' ? "ビジネスコンサルタント" : "Business Consultant",
                occupationLocation: {
                  "@type": "Country",
                  name: "Japan"
                },
                skills: locale === 'ja'
                  ? [
                      "小売業務",
                      "製造業務",
                      "データ分析",
                      "国際ビジネス",
                      "プロジェクト管理",
                      "デジタル変革"
                    ]
                  : [
                      "Retail Operations",
                      "Manufacturing Operations", 
                      "Data Analytics",
                      "Cross-border Business",
                      "Project Management",
                      "Digital Transformation"
                    ]
              },
              inLanguage: locale
            },
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "@id": `https://global-genex.com${baseURL}/about#aboutpage`,
              mainEntity: {
                "@id": "https://global-genex.com/#organization"
              },
              url: `https://global-genex.com${baseURL}/about`,
              name: locale === 'ja' ? "株式会社グローバルジェネックスについて" : "About Global Genex Inc.",
              description: locale === 'ja'
                ? "小売・製造業に特化したプロフェッショナルコンサルティング会社、株式会社グローバルジェネックスの企業プロフィール、経営陣、ミッション、ビジョン、コアバリュー。"
                : "Company profile, leadership team, mission, vision, and core values of Global Genex Inc., a professional consulting firm specializing in retail and manufacturing operations.",
              inLanguage: locale
            }
          ])
        }}
      />

      <main>
        {/* Hero */}
        <Hero
          title={t.about.hero.title}
          subtitle={t.about.hero.subtitle}
          description={t.about.hero.description}
          primaryCTA={{ text: t.nav.contact, href: "/contact" }}
          secondaryCTA={{ text: t.nav.services, href: "/services" }}
        />

        {/* Mission & Vision */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Mission Section */}
              <div className="bg-slate-50 p-8 lg:p-10 rounded-xl h-full flex flex-col">
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">{t.about.mission.title}</h2>
                <p className="text-lg lg:text-xl text-gray leading-relaxed flex-grow">
                  {t.about.mission.description}
                </p>
              </div>
              
              {/* Vision Section */}
              <div className="bg-slate-50 p-8 lg:p-10 rounded-xl h-full flex flex-col">
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">{t.about.vision.title}</h2>
                <p className="text-lg lg:text-xl text-gray leading-relaxed flex-grow">
                  {t.about.vision.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-spacing bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">{t.about.values.title}</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">{t.about.values.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 grid-gap-enhanced">
              {values.map((value, i) => (
                <Card key={i} title={value.title} description={value.description} icon={value.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section id="leadership" className="section-spacing bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">{t.about.leadership.title}</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">{t.about.leadership.subtitle}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {leadership.map((leader, index) => (
                <div key={index} className="bg-slate-50 p-10 lg:p-12 rounded-xl">
                  <div className="mb-8">
                    <h3 className="text-3xl lg:text-4xl font-bold text-navy mb-3">{leader.name}</h3>
                    <p className="text-teal font-semibold text-xl lg:text-2xl mb-6">{leader.position}</p>
                    <p className="text-gray text-lg lg:text-xl leading-relaxed mb-8">{leader.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-lg mb-4">{t.about.leadership.founder.expertiseTitle}</h4>
                    <div className="flex flex-wrap gap-3">
                      {leader.expertise.map((skill, i) => (
                        <span key={i} className="bg-teal/10 text-teal px-4 py-2 rounded-full text-base font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-spacing bg-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">{t.about.timeline.title}</h2>
              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto">
                {t.about.timeline.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-gap-enhanced">
              {milestones.map((m, i) => (
                <div key={i} className="bg-white/5 p-8 lg:p-10 rounded-xl border border-white/10 h-full">
                  <div className="text-3xl lg:text-4xl font-bold text-teal mb-4">{m.year}</div>
                  <h3 className="text-xl lg:text-2xl font-semibold mb-5">{m.title}</h3>
                  <p className="text-slate-300 text-base lg:text-lg leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA
          title={t.about.cta.title}
          description={t.about.cta.description}
          primaryButton={{ text: t.about.cta.primaryButton, href: "/contact" }}
          secondaryButton={{ text: t.about.cta.secondaryButton, href: "/services" }}
          variant="default"
        />
      </main>

    </div>
  )
}