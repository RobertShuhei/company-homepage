import LocalizedLink from '../ui/LocalizedLink'
import { type FooterTranslations } from '@/lib/translations'

interface FooterProps {
  translations: FooterTranslations
}

const Footer = ({ translations }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  
  // Helper function to get translations safely
  const t = (path: string, fallback?: string) => {
    try {
      const keys = path.split('.')
      let value: unknown = translations
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = (value as Record<string, unknown>)[key]
        } else {
          return fallback || path
        }
      }
      
      return typeof value === 'string' ? value : fallback || path
    } catch {
      return fallback || path
    }
  }

  // LocalizedLink component will handle locale prefixing automatically

  const footerSections = [
    {
      title: t('footer.sections.services.title', 'Services'),
      links: [
        { href: '/services', label: t('footer.sections.services.links.consulting', 'Business Consulting') },
        // それぞれのURLができたら差し替え:
        { href: '/services', label: t('footer.sections.services.links.planning', 'Strategic Planning') },
        { href: '/services', label: t('footer.sections.services.links.optimization', 'Process Optimization') },
        { href: '/services', label: t('footer.sections.services.links.transformation', 'Digital Transformation') },
      ]
    },
    {
      title: t('footer.sections.company.title', 'Company'),
      links: [
        { href: '/about', label: t('footer.sections.company.links.about', 'About Us') },
        { href: '/about', label: t('footer.sections.company.links.team', 'Our Team') },
        { href: '/about', label: t('footer.sections.company.links.careers', 'Careers') },
        { href: '/contact', label: t('footer.sections.company.links.contact', 'Contact') },
      ]
    },
    {
      title: t('footer.sections.resources.title', 'Resources'),
      // 実URLが用意できるまで # は避ける（非表示か差し替え推奨）
      links: [
        { href: '#', label: t('footer.sections.resources.links.cases', 'Case Studies') },
        { href: '#', label: t('footer.sections.resources.links.papers', 'White Papers') },
        { href: '#', label: t('footer.sections.resources.links.insights', 'Industry Insights') },
        { href: '#', label: t('footer.sections.resources.links.blog', 'Blog') },
      ]
    },
  ]

  return (
    <footer className="bg-navy text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <LocalizedLink
                href="/"
                className="text-2xl font-bold hover:text-teal transition-colors duration-200"
                aria-label={t('nav.homeAriaLabel', 'Global Genex Inc. - Home')}
              >
                {t('footer.companyName', 'Global Genex Inc.')}
              </LocalizedLink>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {t('footer.tagline', 'Retail & Manufacturing × AI & Data Analytics × Global Expansion. We bridge Japan and global markets with AI-driven consulting.')}
            </p>
            <div className="flex space-x-5">
              {/* 外部リンクは target+rel を付与 */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-teal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy rounded"
<<<<<<< HEAD
                aria-label={`${t('footer.social.linkedin', 'LinkedIn')} (opens in new window)`}
=======
                aria-label={t('footer.social.linkedin', 'LinkedIn')}
>>>>>>> 3ece5cf0d13f509e5ff38ea068119ea095de1ca6
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-teal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy rounded"
<<<<<<< HEAD
                aria-label={`${t('footer.social.twitter', 'Twitter')} (opens in new window)`}
=======
                aria-label={t('footer.social.twitter', 'Twitter')}
>>>>>>> 3ece5cf0d13f509e5ff38ea068119ea095de1ca6
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href === '#' ? (
                      <span className="text-slate-300 cursor-not-allowed opacity-50">
                        {link.label}
                      </span>
                    ) : (
                      <LocalizedLink
                        href={link.href}
                        className="text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy rounded"
                      >
                        {link.label}
                      </LocalizedLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-300 text-sm">
              © {currentYear} {t('footer.companyName', 'Global Genex Inc.')} {t('footer.copyright', 'All rights reserved.')}
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <LocalizedLink
                href="/privacy"
                className="text-slate-300 hover:text-white text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-navy rounded"
              >
                {t('footer.legal.privacy', 'Privacy Policy')}
              </LocalizedLink>
              <span className="text-slate-300 cursor-not-allowed opacity-50 text-sm">
                {t('footer.legal.terms', 'Terms of Service')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
