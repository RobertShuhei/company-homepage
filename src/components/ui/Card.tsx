interface CardProps {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
  className?: string
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  href,
  className = ""
}) => {
  const cardContent = (
    <>
      {icon && (
        <div className="flex-shrink-0 mb-6">
          <div className="w-14 h-14 lg:w-16 lg:h-16 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className="text-xl lg:text-2xl font-semibold text-navy mb-4 lg:mb-5 group-hover:text-teal transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-gray text-base lg:text-lg leading-relaxed flex-grow">
        {description}
      </p>

      {href && (
        <div className="mt-6 lg:mt-8 flex items-center text-teal font-semibold group-hover:text-navy transition-colors duration-200">
          Learn more
          <svg 
            className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
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

  const baseClasses = `card-enhanced p-8 lg:p-10 h-full flex flex-col ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} group cursor-pointer transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2`}
        role="article"
      >
        {cardContent}
      </a>
    )
  }

  return (
    <div 
      className={baseClasses}
      role="article"
    >
      {cardContent}
    </div>
  )
}

export default Card