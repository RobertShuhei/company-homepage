import LocalizedLink from './LocalizedLink'

interface CardProps {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
  className?: string
  learnMoreText?: string
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  href,
  className = "",
  learnMoreText = "Learn more"
}) => {
  const cardContent = (
    <>
      {icon && (
        <div className="flex-shrink-0 mb-8">
          <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-teal/10 to-teal/5 rounded-xl flex items-center justify-center text-teal group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      )}

      <h3 className="text-xl lg:text-2xl font-semibold text-navy mb-5 lg:mb-6 group-hover:text-teal transition-colors duration-300 text-left">
        {title}
      </h3>

      <p className="text-gray text-base lg:text-lg leading-relaxed flex-grow text-left mb-6">
        {description}
      </p>

      {href && (
        <div className="mt-auto flex items-center text-teal font-semibold group-hover:text-navy transition-colors duration-300">
          {learnMoreText}
          <svg
            className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  )

  const baseClasses = `card-floating animate-on-scroll fade-in-up p-8 lg:p-12 h-full flex flex-col ${className}`

  if (href) {
    return (
      <article className={baseClasses}>
        <LocalizedLink
          href={href}
          className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 rounded-2xl h-full flex flex-col"
        >
          {cardContent}
        </LocalizedLink>
      </article>
    )
  }

  return (
    <article className={`${baseClasses} group`}>
      {cardContent}
    </article>
  )
}

export default Card