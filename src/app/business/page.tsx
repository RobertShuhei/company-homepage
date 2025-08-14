import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import CTA from '@/components/ui/CTA'

export const metadata: Metadata = {
  title: 'Business Services - Retail & Manufacturing Consulting Solutions',
  description:
    'Expert consulting services for retail and manufacturing companies. Operations improvement, inventory & demand planning, data analytics dashboards, and Japan market entry support.',
  keywords: [
    'retail consulting services',
    'manufacturing consulting',
    'operations improvement',
    'inventory planning',
    'demand planning',
    'data analytics consulting',
    'Japan market entry',
    'business localization',
    'supply chain consulting',
    'digital transformation services',
  ],
  alternates: {
    canonical: 'https://global-genex.com/business',
  },
  openGraph: {
    title: 'Professional Consulting Services - Global Genex Inc.',
    description: 'Comprehensive consulting solutions for retail & manufacturing. Operations improvement, data analytics, and market entry expertise.',
    url: 'https://global-genex.com/business',
    type: 'website',
  },
  twitter: {
    title: 'Professional Consulting Services - Global Genex Inc.',
    description: 'Comprehensive consulting solutions for retail & manufacturing. Operations improvement, data analytics, and market entry expertise.',
  },
}

export default function BusinessPage() {
  const services = [
    {
      title: 'Retail Operations Improvement',
      description:
        'Hands-on improvements for store and back-office operations to raise productivity and service quality.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: [
        'Current-state assessment and KPI setup (sales, inventory, labor)',
        'SOP and workflow documentation',
        'Layout/merchandising and work-path improvements',
        'Staff training and PDCA adoption',
      ],
    },
    {
      title: 'Inventory & Demand Planning',
      description:
        'Reduce stockouts and overstock with pragmatic demand planning and replenishment rules.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      features: [
        'Simple forecasting setup',
        'Review reorder points and lot sizes',
        'Assortment and replenishment rule optimization',
        'WMS/ERP & spreadsheet flow improvements',
      ],
    },
    {
      title: 'Data Analytics & Dashboards',
      description:
        'Turn operational data into clear weekly/monthly insights with lightweight BI dashboards.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        'Define KPIs and reporting',
        'Build dashboards (BI or spreadsheets)',
        'Data preparation and automation',
        'Regular reviews and recommendations',
      ],
    },
    {
      title: 'Market Entry & Localization',
      description:
        'Support for companies expanding to/from Japan: research, partner outreach, and localization.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: [
        'Market and competitor scan, working hypotheses',
        'Partner prospect research and outreach',
        'Localization (terminology/UX/materials, light translation)',
        'Meeting support and bilingual communication',
      ],
    },
  ]

  const industries = [
    {
      name: 'Retail & E-commerce',
      description: 'Food, apparel, specialty, D2C/marketplace, omnichannel operations',
      expertise: ['Store operations', 'Merchandising & inventory', 'Customer experience & e-commerce', 'Supply chain'],
    },
    {
      name: 'Manufacturing & Logistics',
      description: 'Discrete/process manufacturing and warehouse operations',
      expertise: ['Lean/Kaizen', 'Production & logistics KPIs', 'Inventory & demand planning', 'Quality & standardization'],
    },
    {
      name: 'SMEs & Startups',
      description: 'Japan-based or overseas teams expanding to/from Japan',
      expertise: ['Market validation', 'Go-to-market', 'Localization', 'Partner development'],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main>
        {/* Hero Section */}
        <Hero
          title="Practical Consulting for Retail & Manufacturing"
          subtitle="Services"
          description="Operations improvement, inventory & demand planning, data dashboards, and market entry/localization — delivered with hands-on execution."
          primaryCTA={{ text: 'Contact', href: '/contact' }}
          secondaryCTA={{ text: 'About', href: '/about' }}
        />

        {/* Services Overview */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8">
                Service Offerings
              </h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                Focused services you can start small with and scale as needed
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
                    <h4 className="font-semibold text-navy text-lg">Typical Work:</h4>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">Industry Focus</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                Practical, domain-aware execution in industries where impact is immediate
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
                    <h4 className="font-semibold text-navy text-base">Specializations:</h4>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">Process</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">
                A simple, transparent approach that keeps momentum and accountability
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-gap-enhanced">
              {[
                { step: '01', title: 'Discovery', description: 'Current state, constraints, and goals' },
                { step: '02', title: 'Plan', description: 'Prioritized roadmap and quick wins' },
                { step: '03', title: 'Execute', description: 'Hands-on delivery and reviews' },
                { step: '04', title: 'Optimize', description: 'Measure, learn, and iterate' },
              ].map((phase, index) => (
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
          title="Discuss Your Priorities"
          description="Tell me where you need impact first. We’ll scope a practical project you can start quickly."
          primaryButton={{ text: 'Contact', href: '/contact' }}
          secondaryButton={{ text: 'About Global Genex', href: '/about' }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  )
}
