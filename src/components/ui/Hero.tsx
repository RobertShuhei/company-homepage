import LocalizedLink from './LocalizedLink'

interface HeroProps {
  title: string
  subtitle: string
  description: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  backgroundPattern?: boolean
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundPattern = true
}) => {
  return (
    <section className="relative gradient-bg-primary text-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced Background Pattern with Gradient Overlay */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/30 to-transparent"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      <div className="relative container-wide section-spacing-xl">
        <div className="max-w-5xl">
          {/* Subtitle with Glass Effect */}
          <div className="mb-8 animate-on-scroll fade-in-up">
            <span className="glass-card inline-flex items-center px-6 py-3 rounded-full text-sm lg:text-base font-medium">
              {subtitle}
            </span>
          </div>

          {/* Main Title with Gradient Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8 lg:mb-10 [text-wrap:balance] [line-break:strict] whitespace-pre-line animate-on-scroll fade-in-up stagger-1">
            {/* 右側25%の範囲でのみグラデーションがかかるように調整 */}
            <span className="bg-gradient-to-r from-white from-75% to-slate-200 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 lg:mb-16 leading-relaxed max-w-prose animate-on-scroll fade-in-up stagger-2">
            {description}
          </p>

          {/* Enhanced CTA Buttons */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 animate-on-scroll scale-in stagger-3">
              {primaryCTA && (
                <LocalizedLink
                  href={primaryCTA.href}
                  className="btn-primary-elevated btn-interactive text-lg lg:text-xl text-center min-w-[200px] lg:min-w-[240px]"
                >
                  {primaryCTA.text}
                </LocalizedLink>
              )}
              {secondaryCTA && (
                <LocalizedLink
                  href={secondaryCTA.href}
                  className="btn-secondary text-lg lg:text-xl text-center min-w-[200px] lg:min-w-[240px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {secondaryCTA.text}
                </LocalizedLink>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-16"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,0 C240,120 480,120 720,80 C960,40 1200,40 1440,80 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero