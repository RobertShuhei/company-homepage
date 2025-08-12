import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'

export default function Home() {
  const services = [
    {
      title: "Strategic Consulting",
      description: "Expert guidance to help your business navigate complex challenges and identify growth opportunities with data-driven insights.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Digital Transformation",
      description: "Modernize your operations with cutting-edge technology solutions that streamline processes and enhance productivity.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Process Optimization",
      description: "Analyze and refine your business processes to eliminate inefficiencies and maximize operational performance.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  const features = [
    {
      title: "Expert Team",
      description: "Our certified professionals bring decades of industry experience to every project."
    },
    {
      title: "Proven Results",
      description: "Track record of delivering measurable improvements for businesses of all sizes."
    },
    {
      title: "Custom Solutions",
      description: "Tailored approaches designed specifically for your unique business challenges."
    },
    {
      title: "Ongoing Support",
      description: "Comprehensive support throughout implementation and beyond for lasting success."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          title="Transform Your Business with Expert Solutions"
          subtitle="Professional Consulting Services"
          description="We help businesses unlock their potential through strategic consulting, digital transformation, and process optimization. Partner with us to achieve exceptional results."
          primaryCTA={{
            text: "Get Started Today",
            href: "/contact"
          }}
          secondaryCTA={{
            text: "Learn More",
            href: "/business"
          }}
        />

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Our Core Services
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Comprehensive business solutions designed to drive growth and operational excellence
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
                Why Choose Corporate Solutions
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                We combine industry expertise with innovative approaches to deliver exceptional value
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

        {/* Stats Section */}
        <section className="py-20 bg-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal mb-2">500+</div>
                <div className="text-xl text-slate-300">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal mb-2">98%</div>
                <div className="text-xl text-slate-300">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-teal mb-2">15+</div>
                <div className="text-xl text-slate-300">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA
          title="Ready to Transform Your Business?"
          description="Let's discuss how our expert solutions can help you achieve your goals and drive sustainable growth."
          primaryButton={{
            text: "Schedule Consultation",
            href: "/contact"
          }}
          secondaryButton={{
            text: "View Our Work",
            href: "/about"
          }}
          variant="light"
        />
      </main>

      <Footer />
    </div>
  )
}
