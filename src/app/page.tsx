import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Global Genex Inc. - Expert Retail & Manufacturing Consulting | Japan Market Entry',
  description:
    'Professional consulting services for retail & manufacturing companies. AI-driven data analytics, Japan market entry support, and digital transformation expertise. Based in Fukuoka, serving global clients.',
  keywords: [
    'retail consulting',
    'manufacturing consulting',
    'Japan market entry',
    'business consulting Fukuoka',
    'AI consulting',
    'data analytics consulting',
    'digital transformation',
    'cross-border business',
    'bilingual consultant',
    'Global Genex',
    'operations improvement',
    'supply chain consulting',
  ],
  alternates: {
    canonical: 'https://global-genex.com',
  },
  openGraph: {
    title: 'Global Genex Inc. - Expert Retail & Manufacturing Consulting',
    description: 'Transform your business with professional consulting services. AI-driven analytics, operations improvement, and Japan market entry expertise.',
    url: 'https://global-genex.com',
    type: 'website',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Global Genex Inc. - Professional Business Consulting Services',
      },
    ],
  },
  twitter: {
    title: 'Global Genex Inc. - Expert Retail & Manufacturing Consulting',
    description: 'Transform your business with professional consulting services. AI-driven analytics, operations improvement, and Japan market entry expertise.',
    images: ['/og-homepage.png'],
  },
}

export default function Home() {
  // ① 会社の3本柱に合わせる
  const services = [
    {
      title: "Manufacturing Consulting",
      description:
        "Hands-on support to visualize processes, train teams, and improve productivity and quality at the shop floor.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "IT Implementation / System Development",
      description:
        "Practical systems for sales performance, operational efficiency, and production/quality analytics tailored to your operations.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Support for Market Development",
      description:
        "Hands-on support to open and expand sales channels in Japan and overseas, leveraging bilingual, on-the-ground execution.",
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
      title: "Data-Driven Execution",
      description: "Diagnose, prioritize, and implement improvements backed by facts.."
    },
    {
      title: "Hands-On & On-Site",
      description: "We work at the site with your team to visualize issues and implement practical countermeasures."
    },
    {
      title: "Bilingual & Cross-Border",
      description: "Japanese–English support for supply chains and sales channels across Japan and overseas."
    },
    {
      title: "Practical, Phased Delivery",
      description: "Small wins first, then scale. We avoid overengineering and focus on measurable improvements."
    }
  ]

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
              name: "Global Genex Inc.",
              description: "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services.",
              publisher: {
                "@id": "https://global-genex.com/#organization"
              },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://global-genex.com/services?search={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              ],
              inLanguage: "en",
              copyrightYear: 2025,
              copyrightHolder: {
                "@id": "https://global-genex.com/#organization"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://global-genex.com/#webpage",
              url: "https://global-genex.com",
              name: "Global Genex Inc. - Expert Retail & Manufacturing Consulting",
              isPartOf: {
                "@id": "https://global-genex.com/#website"
              },
              about: {
                "@id": "https://global-genex.com/#organization"
              },
              description: "Transform your operations with AI-driven, hands-on consulting. Professional consulting services for retail & manufacturing companies with practical execution.",
              breadcrumb: {
                "@id": "https://global-genex.com/#breadcrumb"
              },
              inLanguage: "en",
              potentialAction: [
                {
                  "@type": "ReadAction",
                  target: ["https://global-genex.com"]
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://global-genex.com/#breadcrumb",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://global-genex.com"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": "https://global-genex.com/#consulting-services",
              name: "Business Consulting Services",
              provider: {
                "@id": "https://global-genex.com/#organization"
              },
              serviceType: "Business Consulting",
              description: "Comprehensive consulting services for retail & manufacturing companies including operations improvement, data analytics, and market entry support.",
              areaServed: ["Japan", "Global"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Consulting Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Manufacturing Consulting",
                      description: "Hands-on support to visualize processes, train teams, and improve productivity and quality at the shop floor."
                    }
                  },
                  {
                    "@type": "Offer", 
                    itemOffered: {
                      "@type": "Service",
                      name: "IT Implementation / System Development",
                      description: "Practical systems for sales performance, operational efficiency, and production/quality analytics tailored to your operations."
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service", 
                      name: "Support for Market Development",
                      description: "Hands-on support to open and expand sales channels in Japan and overseas, leveraging bilingual, on-the-ground execution."
                    }
                  }
                ]
              }
            }
          ])
        }}
      />
      <Header />

      <main>
        {/* ③ Hero 文言を“実態”に寄せる */}
        <Hero
          title="Transform Your Operations with AI-Driven, Hands-On Consulting"
          subtitle="Professional Consulting for Retail & Manufacturing"
          description="We help manufacturers and retailers improve productivity and quality through on-site consulting, data analytics, and digital transformation. We also support market development in Japan and overseas."
          primaryCTA={{ text: "Get Started Today", href: "/contact" }}
          secondaryCTA={{ text: "Explore Services", href: "/services" }}
        />

        {/* Services Section */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8">
                Our Core Services
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                Practical consulting to raise productivity, quality, and sales performance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-gap-enhanced">
              {services.map((service, index) => (
                <Card
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href="/services"
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
                Why Choose Global Genex Inc.
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                Practical, bilingual, and execution-focused support
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

        {/* ④ “数字実績”は一旦削除（嘘防止）*/}

        {/* CTA Section */}
        <CTA
          title="Ready to Move Forward?"
          description="Tell us your current challenges. We’ll propose a phased approach that fits your site, team, and timeline."
          primaryButton={{ text: "Schedule Consultation", href: "/contact" }}
          secondaryButton={{ text: "About the Founder", href: "/about" }}
          variant="light"
        />
      </main>

      <Footer />
    </div>
  )
}
