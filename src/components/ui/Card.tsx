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
        <div className="flex-shrink-0 mb-4">
          <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
            {icon}
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-teal transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-gray leading-relaxed">
        {description}
      </p>

      {href && (
        <div className="mt-4 flex items-center text-teal font-medium group-hover:text-navy transition-colors duration-200">
          Learn more
          <svg 
            className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
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

  const baseClasses = `bg-white p-8 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-teal/20 ${className}`

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