import LocalizedLink from './LocalizedLink'

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
          section: 'gradient-bg-primary text-white relative overflow-hidden',
          title: 'text-white',
          description: 'text-slate-300',
          primaryBtn: 'btn-primary-elevated text-lg lg:text-xl px-10 lg:px-12 py-5 lg:py-6 min-w-[200px]',
          secondaryBtn: 'btn-secondary-light text-lg lg:text-xl px-8 lg:px-10 py-4 lg:py-5 min-w-[180px]'
        }
      case 'light':
        return {
          section: 'bg-gradient-to-br from-slate-50 to-white text-navy',
          // 右側25%の範囲でのみグラデーションがかかるように調整
          title: 'bg-gradient-to-r from-navy from-75% to-teal bg-clip-text text-transparent',
          description: 'text-gray',
          primaryBtn: 'btn-primary-elevated text-lg lg:text-xl px-10 lg:px-12 py-5 lg:py-6 min-w-[200px]',
          secondaryBtn: 'btn-secondary-solid text-lg lg:text-xl px-8 lg:px-10 py-4 lg:py-5 min-w-[180px]'
        }
      default:
        return {
          section: 'bg-white text-navy',
          title: 'text-navy',
          description: 'text-gray',
          primaryBtn: 'btn-primary-elevated text-lg lg:text-xl px-10 lg:px-12 py-5 lg:py-6 min-w-[200px]',
          secondaryBtn: 'btn-secondary-solid text-lg lg:text-xl px-8 lg:px-10 py-4 lg:py-5 min-w-[180px]'
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <section className={`section-spacing-lg ${classes.section}`}>
      {/* Background Pattern for Dark Variant */}
      {variant === 'dark' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent"></div>
        </div>
      )}

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 animate-on-scroll fade-in-up ${classes.title}`}>
            {title}
          </h2>

          <p className={`text-xl md:text-2xl lg:text-3xl mb-12 lg:mb-16 leading-relaxed max-w-prose mx-auto animate-on-scroll fade-in-up stagger-1 ${classes.description}`}>
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center animate-on-scroll scale-in stagger-2">
            <LocalizedLink
              href={primaryButton.href}
              className={`btn-interactive ${classes.primaryBtn}`}
            >
              {primaryButton.text}
            </LocalizedLink>

            {secondaryButton && (
              <LocalizedLink
                href={secondaryButton.href}
                className={classes.secondaryBtn}
              >
                {secondaryButton.text}
              </LocalizedLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA