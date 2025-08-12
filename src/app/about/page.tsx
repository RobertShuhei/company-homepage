import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/ui/Hero'
import Card from '@/components/ui/Card'
import CTA from '@/components/ui/CTA'

export const metadata: Metadata = {
  title: 'About Us | Company Profile & Leadership Team',
  description: 'Learn about Corporate Solutions - our mission, values, leadership team, and commitment to delivering exceptional business consulting services worldwide.',
}

export default function AboutPage() {
  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every project, delivering solutions that exceed expectations and drive meaningful results.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Integrity",
      description: "We conduct business with unwavering integrity, building trust through transparency, honesty, and ethical practices.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Innovation",
      description: "We embrace innovation and continuous learning, staying ahead of industry trends to provide cutting-edge solutions.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Collaboration",
      description: "We believe in the power of collaboration, working closely with clients as partners to achieve shared success.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  const leadership = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      bio: "With over 20 years of experience in strategic consulting, Sarah leads our vision to transform businesses through innovative solutions. She holds an MBA from Harvard Business School and is a certified management consultant.",
      expertise: ["Strategic Planning", "Leadership Development", "Digital Transformation"]
    },
    {
      name: "Michael Chen",
      position: "Chief Technology Officer",
      bio: "Michael brings 18+ years of technology leadership experience, specializing in digital transformation and enterprise architecture. He holds a Ph.D. in Computer Science and has led technology initiatives for Fortune 500 companies.",
      expertise: ["Technology Strategy", "Digital Innovation", "System Architecture"]
    },
    {
      name: "Emily Rodriguez",
      position: "Head of Operations",
      bio: "Emily is an expert in operational excellence with 15+ years of experience optimizing business processes across various industries. She is a certified Six Sigma Master Black Belt and lean manufacturing expert.",
      expertise: ["Process Optimization", "Change Management", "Operational Excellence"]
    },
    {
      name: "David Thompson",
      position: "Managing Director",
      bio: "David leads client relationships and business development with 16+ years in management consulting. He specializes in helping organizations navigate complex transformations and achieve sustainable growth.",
      expertise: ["Client Relations", "Business Development", "Project Management"]
    }
  ]

  const milestones = [
    {
      year: "2008",
      title: "Company Founded",
      description: "Corporate Solutions was established with a vision to help businesses unlock their potential through expert consulting."
    },
    {
      year: "2012",
      title: "50 Clients Milestone",
      description: "Reached our first major milestone of serving 50+ clients across various industries with exceptional results."
    },
    {
      year: "2016",
      title: "Digital Focus Expansion",
      description: "Expanded our service offerings to include digital transformation and technology consulting capabilities."
    },
    {
      year: "2019",
      title: "International Growth",
      description: "Extended our services globally, establishing partnerships and serving clients across North America and Europe."
    },
    {
      year: "2022",
      title: "500+ Projects Completed",
      description: "Celebrated the successful completion of over 500 projects, impacting thousands of professionals worldwide."
    },
    {
      year: "2024",
      title: "Innovation Lab Launch",
      description: "Launched our Innovation Lab to explore emerging technologies and develop next-generation business solutions."
    }
  ]

  const certifications = [
    "PMI - Project Management Institute",
    "Six Sigma Master Black Belt",
    "Certified Management Consultant (CMC)",
    "ITIL Foundation Certified",
    "Agile and Scrum Master Certified",
    "ISO 9001 Quality Management"
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          title="Driving Business Excellence Since 2008"
          subtitle="About Corporate Solutions"
          description="We are a team of passionate consultants dedicated to helping organizations achieve their full potential through strategic guidance, innovative solutions, and operational excellence."
          primaryCTA={{
            text: "Meet Our Team",
            href: "#leadership"
          }}
          secondaryCTA={{
            text: "Our Services",
            href: "/business"
          }}
        />

        {/* Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-gray leading-relaxed mb-8">
                  To empower businesses to achieve exceptional results through innovative consulting solutions, strategic guidance, and operational excellence. We are committed to being trusted partners in our clients&apos; success stories.
                </p>
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-navy mb-3">Our Vision</h3>
                  <p className="text-gray">
                    To be the world&apos;s most trusted business transformation partner, recognized for delivering sustainable value and driving positive change across industries.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center bg-navy text-white p-8 rounded-xl">
                  <div className="text-4xl font-bold text-teal mb-2">500+</div>
                  <div className="text-lg">Projects Completed</div>
                </div>
                <div className="text-center bg-teal text-white p-8 rounded-xl">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="text-lg">Years of Experience</div>
                </div>
                <div className="text-center bg-slate-100 text-navy p-8 rounded-xl">
                  <div className="text-4xl font-bold text-teal mb-2">98%</div>
                  <div className="text-lg">Client Satisfaction</div>
                </div>
                <div className="text-center bg-slate-100 text-navy p-8 rounded-xl">
                  <div className="text-4xl font-bold text-teal mb-2">25+</div>
                  <div className="text-lg">Industries Served</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                The principles that guide our work and define our commitment to excellence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  title={value.title}
                  description={value.description}
                  icon={value.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leadership" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Leadership Team
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Meet the experienced professionals who lead our organization and drive our success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {leadership.map((leader, index) => (
                <div key={index} className="bg-slate-50 p-8 rounded-xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-navy mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-teal font-semibold text-lg mb-4">
                      {leader.position}
                    </p>
                    <p className="text-gray leading-relaxed mb-6">
                      {leader.bio}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Areas of Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-medium"
                        >
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

        {/* Timeline Section */}
        <section className="py-20 bg-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Key milestones in our growth and evolution as a leading consulting firm
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-teal mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-300">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Certifications & Partnerships
              </h2>
              <p className="text-xl text-gray max-w-3xl mx-auto">
                Our commitment to excellence is validated through industry certifications and strategic partnerships
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center p-4 bg-slate-50 rounded-lg">
                    <div className="w-3 h-3 bg-teal rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-navy font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA
          title="Ready to Partner with Us?"
          description="Join the hundreds of companies who have transformed their businesses with our expert consulting services."
          primaryButton={{
            text: "Start Your Journey",
            href: "/contact"
          }}
          secondaryButton={{
            text: "Explore Our Services",
            href: "/business"
          }}
          variant="default"
        />
      </main>

      <Footer />
    </div>
  )
}