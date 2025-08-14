import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'

export const metadata: Metadata = {
  title: 'About Us | Company Profile',
  description:
    'Global Genex Inc. is a consulting company based in Fukuoka, Japan. We help retailers and manufacturers improve operations with practical, data-driven execution.',
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
    { year: '2025', title: 'Established in Fukuoka', description: 'Global Genex Inc. launched as an independent consulting practice.' },
    { year: '2025', title: 'Services Launched', description: 'Retail & manufacturing operations, data analytics, and cross-border support.' },
    { year: '2025', title: 'Reusable Assets', description: 'Started publishing templates, checklists, and simple tools for clients.' }
  ]

  return (
    <div className="min-h-screen flex flex-col">
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

        {/* Mission & Vision（数値カードは削除） */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Mission</h2>
                <p className="text-xl text-gray leading-relaxed mb-8">
                  Help clients visualize issues on site, prioritize with data, and execute pragmatic improvements that stick.
                </p>
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-navy mb-3">Our Vision</h3>
                  <p className="text-gray">
                    Be a trusted partner for practical transformation across Japan and global markets.
                  </p>
                </div>
              </div>
              {/* 右側の数値カード（500+/98%など）は削除 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center bg-slate-100 text-navy p-8 rounded-xl">
                  <div className="text-lg font-semibold">Hands-on & On-site</div>
                  <div className="text-sm text-gray mt-2">Work directly with client teams at the site.</div>
                </div>
                <div className="text-center bg-slate-100 text-navy p-8 rounded-xl">
                  <div className="text-lg font-semibold">Bilingual Support</div>
                  <div className="text-sm text-gray mt-2">Japanese & English communication, documents, and delivery.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Core Values</h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">Principles that guide how we work</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <Card key={i} title={value.title} description={value.description} icon={value.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* Leadership（代表のみ） */}
        <section id="leadership" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Leadership</h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">Profile</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
              {leadership.map((leader, index) => (
                <div key={index} className="bg-slate-50 p-8 rounded-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-navy mb-2">{leader.name}</h3>
                    <p className="text-teal font-semibold text-lg mb-4">{leader.position}</p>
                    <p className="text-gray leading-relaxed mb-6">{leader.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill, i) => (
                        <span key={i} className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-medium">
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

        {/* Timeline（数値誇張なし） */}
        <section className="py-20 bg-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Key steps from launch to today
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-teal mb-2">{m.year}</div>
                  <h3 className="text-xl font-semibold mb-3">{m.title}</h3>
                  <p className="text-slate-300">{m.description}</p>
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
