import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Header from './Header'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/ja'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

// Mock the translation hook
vi.mock('@/lib/hooks/useTranslations', () => ({
  useTranslations: vi.fn(() => ({
    t: null, // No client translations available
  })),
  getNestedTranslation: vi.fn((translations, path, fallback) => fallback || path),
}))

// Mock the LocalizedLink component
vi.mock('../ui/LocalizedLink', () => ({
  default: ({ href, children, className, 'aria-label': ariaLabel }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}))

// Mock the LanguageSwitcher component
vi.mock('../ui/LanguageSwitcher', () => ({
  default: ({ variant }: { variant?: 'desktop' | 'mobile' }) => (
    <button data-testid={`language-switcher-${variant || 'desktop'}`}>
      Language Switcher
    </button>
  ),
}))

// Mock the i18n config
vi.mock('../../../i18n.config', () => ({
  removeLocaleFromPathname: vi.fn((pathname) => pathname.replace(/^\/(ja|en)/, '') || '/'),
}))

describe('Header Component', () => {
  const mockNavigationTranslations = {
    nav: {
      home: 'ホーム',
      services: 'サービス',
      about: '会社概要',
      contact: 'お問い合わせ',
      companyName: '株式会社グローバルジェネックス',
      homeAriaLabel: '株式会社グローバルジェネックス - ホーム',
      menuAriaLabel: 'メインナビゲーション',
      openMenu: 'メインメニューを開く',
    },
    common: {
      learnMore: '詳細を見る',
      readMore: '続きを読む',
      getStarted: '無料相談を予約',
      contactUs: 'お問い合わせ',
    }
  }

  const defaultProps = {
    navigationTranslations: mockNavigationTranslations,
    locale: 'ja' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the company logo as a link to the homepage', () => {
    render(<Header {...defaultProps} />)

    const logoLink = screen.getByRole('link', {
      name: '株式会社グローバルジェネックス - ホーム'
    })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveTextContent('株式会社グローバルジェネックス')
  })

  it('renders all primary navigation links with correct Japanese text', () => {
    render(<Header {...defaultProps} />)

    // Check for ホーム (Home)
    const homeLink = screen.getByRole('link', { name: 'ホーム' })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    // Check for サービス (Services)
    const servicesLink = screen.getByRole('link', { name: 'サービス' })
    expect(servicesLink).toBeInTheDocument()
    expect(servicesLink).toHaveAttribute('href', '/services')

    // Check for 会社概要 (About)
    const aboutLink = screen.getByRole('link', { name: '会社概要' })
    expect(aboutLink).toBeInTheDocument()
    expect(aboutLink).toHaveAttribute('href', '/about')

    // Check for お問い合わせ (Contact)
    const contactLink = screen.getByRole('link', { name: 'お問い合わせ' })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('renders the language switcher component', () => {
    render(<Header {...defaultProps} />)

    const languageSwitcher = screen.getByTestId('language-switcher-desktop')
    expect(languageSwitcher).toBeInTheDocument()
  })
})