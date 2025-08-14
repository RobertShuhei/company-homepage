import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'

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
      <Header />

      <main>
        {/* ③ Hero 文言を“実態”に寄せる */}
        <Hero
          title="Transform Your Operations with AI-Driven, Hands-On Consulting"
          subtitle="Professional Consulting for Retail & Manufacturing"
          description="We help manufacturers and retailers improve productivity and quality through on-site consulting, data analytics, and digital transformation. We also support market development in Japan and overseas."
          primaryCTA={{ text: "Get Started Today", href: "/contact" }}
          secondaryCTA={{ text: "Explore Services", href: "/business" }}
        />

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Our Core Services
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Practical consulting to raise productivity, quality, and sales performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href="/business"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Why Choose Global Genex Inc.
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Practical, bilingual, and execution-focused support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                    <h3 className="text-xl font-semibold text-navy mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray">
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
