import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'About Us - Company Profile & Leadership',
  description:
    'Learn about Global Genex Inc., a consulting company based in Fukuoka, Japan. We help retailers and manufacturers improve operations with practical, data-driven execution and bilingual support.',
  keywords: [
    'Global Genex about',
    'company profile',
    'Fukuoka consulting company', 
    'Shuhei Nakahara',
    'bilingual consultant',
    'Japan consulting firm',
    'retail manufacturing consultant',
  ],
  alternates: {
    canonical: 'https://global-genex.com/about',
  },
  openGraph: {
    title: 'About Global Genex Inc. - Expert Consulting Team',
    description: 'Meet the Global Genex team. Professional consulting for retail & manufacturing companies with practical, data-driven execution.',
    url: 'https://global-genex.com/about',
    type: 'website',
  },
  twitter: {
    title: 'About Global Genex Inc. - Expert Consulting Team',
    description: 'Meet the Global Genex team. Professional consulting for retail & manufacturing companies with practical, data-driven execution.',
  },
}

export default function AboutPage() {
  // ── Values（汎用的なのでそのまま利用）
  const values = [
    {
      title: 'Excellence',
      description:
        'We pursue practical, high-quality outcomes on every engagement.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
      )
    },
    {
      title: 'Integrity',
      description:
        'Transparent, honest communication and responsible delivery.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      )
    },
    {
      title: 'Innovation',
      description:
        'Use data and technology pragmatically to solve on-site issues.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    },
    {
      title: 'Collaboration',
      description:
        'Work closely with client teams for sustainable change.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    }
  ]

  // ── Leadership：実在の代表のみ
  const leadership = [
    {
      name: 'Shuhei Nakahara',
      position: 'Representative Director / Consultant',
      bio:
        'Bilingual (JP/EN) consultant based in Fukuoka. Focused on retail & manufacturing operations, data utilization, and cross-border enablement. Provides hands-on, on-site execution and practical countermeasures.',
      expertise: ['Retail & Manufacturing Ops', 'Data & Analytics', 'Cross-border (JP⇄Global)', 'Project Delivery']
    }
  ]

  // ── Milestones：実績数字は避け、設立と方向性のみ
  const milestones = [
  {
    year: '2024',
    title: 'Founded in Fukuoka',
    description:
      'Incorporated in October 2024 as an independent consulting company.',
  },
  {
    year: '2025',
    title: 'Services Launched',
    description:
      'Started consulting for retail and manufacturing operations, data & analytics, and cross-border support.',
  },
  {
    year: '2025',
    title: 'Reusable Assets',
    description:
      'Began publishing templates, checklists, and simple tools for clients.',
  },
]

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
              "@id": "https://global-genex.com/about#webpage",
              url: "https://global-genex.com/about",
              name: "About Global Genex Inc. - Company Profile & Leadership",
              isPartOf: {
                "@id": "https://global-genex.com/#website"
              },
              about: {
                "@id": "https://global-genex.com/#organization"
              },
              description: "Learn about Global Genex Inc., a consulting company based in Fukuoka, Japan. Meet our leadership team and discover our mission to help retailers and manufacturers improve operations.",
              breadcrumb: {
                "@id": "https://global-genex.com/about#breadcrumb"
              },
              inLanguage: "en",
              potentialAction: [
                {
                  "@type": "ReadAction",
                  target: ["https://global-genex.com/about"]
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://global-genex.com/about#breadcrumb",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://global-genex.com"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: "https://global-genex.com/about"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://global-genex.com/about#shuhei-nakahara",
              name: "Shuhei Nakahara",
              givenName: "Shuhei",
              familyName: "Nakahara",
              alternateName: "中原秀平",
              jobTitle: "Representative Director",
              description: "Bilingual (JP/EN) consultant based in Fukuoka. Focused on retail & manufacturing operations, data utilization, and cross-border enablement. Provides hands-on, on-site execution and practical countermeasures.",
              worksFor: {
                "@type": "Organization",
                "@id": "https://global-genex.com/#organization",
                name: "Global Genex Inc."
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
                name: "Business Consultant",
                occupationLocation: {
                  "@type": "Country",
                  name: "Japan"
                },
                skills: [
                  "Retail Operations",
                  "Manufacturing Operations", 
                  "Data Analytics",
                  "Cross-border Business",
                  "Project Management",
                  "Digital Transformation"
                ]
              },
              hasCredential: [
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "Business Consulting Expertise",
                  credentialCategory: "Professional Experience",
                  competencyRequired: "Retail & Manufacturing Operations, Data Analytics, Cross-border Business"
                }
              ],
              knowsAbout: [
                "Retail Operations",
                "Manufacturing Consulting",
                "Data Analytics", 
                "Digital Transformation",
                "Japan Market Entry",
                "Cross-border Business",
                "Supply Chain Management",
                "Inventory Management",
                "Demand Planning"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "professional",
                email: "info@global-genex.com",
                telephone: "+81-70-8361-4870",
                availableLanguage: ["Japanese", "English"]
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "@id": "https://global-genex.com/about#aboutpage",
              mainEntity: {
                "@id": "https://global-genex.com/#organization"
              },
              url: "https://global-genex.com/about",
              name: "About Global Genex Inc.",
              description: "Company profile, leadership team, mission, vision, and core values of Global Genex Inc., a professional consulting firm specializing in retail and manufacturing operations.",
              inLanguage: "en"
            }
          ])
        }}
      />
      <Header />

      <main>
        {/* Hero（誇張なしの紹介） */}
        <Hero
          title="About Global Genex Inc."
          subtitle="Company Profile"
          description="Consulting company in Fukuoka, Japan. We help retailers and manufacturers improve operations with data-driven, on-site execution in Japanese and English."
          primaryCTA={{ text: 'Contact', href: '/contact' }}
          secondaryCTA={{ text: 'Services', href: '/business' }}
        />

        {/* Mission & Vision */}
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">Our Mission</h2>
                <p className="text-xl lg:text-2xl text-gray leading-relaxed mb-10">
                  Help clients visualize issues on site, prioritize with data, and execute pragmatic improvements that stick.
                </p>
                <div className="bg-slate-50 p-8 lg:p-10 rounded-xl">
                  <h3 className="text-2xl font-semibold text-navy mb-4">Our Vision</h3>
                  <p className="text-gray text-lg leading-relaxed">
                    Be a trusted partner for practical transformation across Japan and global markets.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className="text-center bg-slate-100 text-navy p-8 lg:p-10 rounded-xl">
                  <div className="text-xl font-semibold mb-3">Hands-on & On-site</div>
                  <div className="text-base text-gray">Work directly with client teams at the site.</div>
                </div>
                <div className="text-center bg-slate-100 text-navy p-8 lg:p-10 rounded-xl">
                  <div className="text-xl font-semibold mb-3">Bilingual Support</div>
                  <div className="text-base text-gray">Japanese & English communication, documents, and delivery.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-spacing bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">Our Core Values</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">Principles that guide how we work</p>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">Leadership</h2>
              <p className="text-xl lg:text-2xl text-gray max-w-4xl mx-auto">Profile</p>
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
                    <h4 className="font-semibold text-navy text-lg mb-4">Areas of Expertise</h4>
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">Our Story</h2>
              <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto">
                Key steps from launch to today
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

        {/* Certifications は未確定なので表示しない */}

        <CTA
          title="Ready to discuss your challenge?"
          description="Tell us about your site, data, and goals. We’ll propose a practical, phased approach."
          primaryButton={{ text: 'Contact', href: '/contact' }}
          secondaryButton={{ text: 'Services', href: '/business' }}
          variant="default"
        />
      </main>

      <Footer />
    </div>
  )
}
