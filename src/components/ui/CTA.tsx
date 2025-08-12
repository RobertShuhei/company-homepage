import Link from 'next/link'

interface CTAProps {
  title: string
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
  variant?: 'default' | 'dark' | 'light'
}

const CTA: React.FC<CTAProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'dark':
        return {
          section: 'bg-navy text-white',
          title: 'text-white',
          description: 'text-slate-300',
          primaryBtn: 'bg-teal text-white hover:bg-teal/90 focus:ring-teal focus:ring-offset-navy',
          secondaryBtn: 'border-white text-white hover:bg-white hover:text-navy focus:ring-white focus:ring-offset-navy'
        }
      case 'light':
        return {
          section: 'bg-slate-50 text-navy',
          title: 'text-navy',
          description: 'text-gray',
          primaryBtn: 'bg-teal text-white hover:bg-teal/90 focus:ring-teal focus:ring-offset-slate-50',
          secondaryBtn: 'border-navy text-navy hover:bg-navy hover:text-white focus:ring-navy focus:ring-offset-slate-50'
        }
      default:
        return {
          section: 'bg-white text-navy',
          title: 'text-navy',
          description: 'text-gray',
          primaryBtn: 'bg-teal text-white hover:bg-teal/90 focus:ring-teal',
          secondaryBtn: 'border-navy text-navy hover:bg-navy hover:text-white focus:ring-navy'
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <section className={`py-16 lg:py-24 ${classes.section}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${classes.title}`}>
            {title}
          </h2>
          
          <p className={`text-xl md:text-2xl mb-10 leading-relaxed ${classes.description}`}>
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryButton.href}
              className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${classes.primaryBtn}`}
            >
              {primaryButton.text}
            </Link>
            
            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className={`border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-center transform hover:-translate-y-0.5 ${classes.secondaryBtn}`}
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA