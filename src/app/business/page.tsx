import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import CTA from '@/components/ui/CTA'

export const metadata: Metadata = {
  title: 'Our Services | Business Consulting & Digital Solutions',
  description: 'Comprehensive business consulting services including strategic planning, digital transformation, process optimization, and operational excellence solutions.',
}

export default function BusinessPage() {
  const services = [
    {
      title: "Strategic Consulting",
      description: "Comprehensive business strategy development, market analysis, and competitive positioning to drive sustainable growth and competitive advantage.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: [
        "Market Analysis & Research",
        "Business Model Innovation",
        "Growth Strategy Development",
        "Risk Assessment & Management"
      ]
    },
    {
      title: "Digital Transformation",
      description: "End-to-end digital transformation services to modernize your operations, enhance customer experiences, and create new revenue streams.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: [
        "Technology Assessment",
        "Digital Strategy & Roadmap",
        "System Integration",
        "Change Management"
      ]
    },
    {
      title: "Process Optimization",
      description: "Systematic analysis and improvement of business processes to enhance efficiency, reduce costs, and improve quality outcomes.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      features: [
        "Process Mapping & Analysis",
        "Workflow Optimization",
        "Performance Metrics",
        "Continuous Improvement"
      ]
    },
    {
      title: "Operational Excellence",
      description: "Implement lean methodologies and best practices to achieve operational excellence and sustainable performance improvements.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      features: [
        "Lean Implementation",
        "Quality Management Systems",
        "Performance Dashboards",
        "Training & Development"
      ]
    },
    {
      title: "Change Management",
      description: "Guide your organization through transformational changes with proven methodologies that ensure successful adoption and minimal disruption.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: [
        "Change Readiness Assessment",
        "Stakeholder Engagement",
        "Communication Strategy",
        "Training & Support"
      ]
    },
    {
      title: "Data Analytics & Insights",
      description: "Transform raw data into actionable insights with advanced analytics, business intelligence, and reporting solutions.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: [
        "Data Strategy & Governance",
        "Analytics Implementation",
        "Dashboard Development",
        "Predictive Modeling"
      ]
    }
  ]

  const industries = [
    {
      name: "Financial Services",
      description: "Banking, insurance, fintech, and investment management solutions",
      expertise: ["Risk Management", "Regulatory Compliance", "Digital Banking", "Customer Experience"]
    },
    {
      name: "Healthcare",
      description: "Healthcare providers, pharmaceutical, and medical device companies",
      expertise: ["Digital Health", "Operational Efficiency", "Patient Experience", "Compliance"]
    },
    {
      name: "Manufacturing",
      description: "Industrial, automotive, aerospace, and consumer goods manufacturing",
      expertise: ["Lean Manufacturing", "Supply Chain", "Industry 4.0", "Quality Systems"]
    },
    {
      name: "Technology",
      description: "Software, hardware, telecommunications, and emerging tech companies",
      expertise: ["Agile Transformation", "Product Strategy", "Scaling Operations", "Innovation"]
    },
    {
      name: "Retail & E-commerce",
      description: "Traditional retail, online marketplaces, and omnichannel experiences",
      expertise: ["Customer Journey", "Inventory Optimization", "Digital Commerce", "Supply Chain"]
    },
    {
      name: "Energy & Utilities",
      description: "Oil & gas, renewable energy, utilities, and environmental services",
      expertise: ["Sustainability", "Grid Modernization", "Regulatory Compliance", "Asset Management"]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          title="Comprehensive Business Solutions"
          subtitle="Professional Consulting Services"
          description="From strategic planning to digital transformation, we provide expert consulting services that drive measurable results and sustainable growth for your organization."
          primaryCTA={{
            text: "Schedule Consultation",
            href: "/contact"
          }}
          secondaryCTA={{
            text: "Learn About Our Process",
            href: "/about"
          }}
        />

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
                Our Service Offerings
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                End-to-end consulting solutions designed to address your most complex business challenges
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-teal/20 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 mb-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-navy">Key Areas:</h4>
                    <ul className="text-sm text-gray space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <span className="text-teal mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Industry Expertise
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Deep domain knowledge across key industries enables us to deliver targeted solutions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {industry.name}
                  </h3>
                  
                  <p className="text-gray leading-relaxed mb-6">
                    {industry.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-navy">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.expertise.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-medium"
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

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Our Proven Process
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                A structured approach that ensures successful outcomes and measurable results
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery & Assessment",
                  description: "Comprehensive analysis of current state, challenges, and opportunities"
                },
                {
                  step: "02",
                  title: "Strategy Development",
                  description: "Design tailored solutions aligned with your business objectives"
                },
                {
                  step: "03",
                  title: "Implementation",
                  description: "Execute solutions with dedicated project management and support"
                },
                {
                  step: "04",
                  title: "Optimization",
                  description: "Continuous monitoring, measurement, and improvement of outcomes"
                }
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-teal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-gray">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA
          title="Ready to Transform Your Business?"
          description="Let's discuss your specific challenges and how our expert consulting services can help you achieve your goals."
          primaryButton={{
            text: "Start Your Project",
            href: "/contact"
          }}
          secondaryButton={{
            text: "View Case Studies",
            href: "/about"
          }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  )
}