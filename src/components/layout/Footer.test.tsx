import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Footer from './Footer'

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

describe('Footer Component', () => {
  const mockFooterTranslations = {
    footer: {
      companyName: '株式会社グローバルジェネックス',
      tagline: '小売・製造 × AI・データ × グローバル。AIを活用したコンサルティングで日本と世界をつなぎます。',
      copyright: 'All rights reserved.',
      social: {
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
      },
      sections: {
        services: {
          title: 'サービス',
          links: {
            consulting: 'ビジネスコンサルティング',
            planning: '戦略立案',
            optimization: 'プロセス最適化',
            transformation: 'デジタル変革',
          },
        },
        company: {
          title: '会社',
          links: {
            about: '会社概要',
            team: 'チーム',
            careers: '採用情報',
            contact: 'お問い合わせ',
          },
        },
        resources: {
          title: 'リソース',
          links: {
            cases: '事例研究',
            papers: 'ホワイトペーパー',
            insights: '業界インサイト',
            blog: 'ブログ',
          },
        },
      },
      legal: {
        privacy: 'プライバシーポリシー',
        terms: '利用規約',
      },
    },
    nav: {
      homeAriaLabel: '株式会社グローバルジェネックス - ホーム',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders main navigation links with Japanese text', () => {
    render(<Footer translations={mockFooterTranslations} />)

    // Check for Japanese navigation links in the company section
    expect(screen.getByText('会社概要')).toBeInTheDocument()
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument()
    expect(screen.getByText('チーム')).toBeInTheDocument()
    expect(screen.getByText('採用情報')).toBeInTheDocument()

    // Check for services section
    expect(screen.getByText('サービス')).toBeInTheDocument()
    expect(screen.getByText('ビジネスコンサルティング')).toBeInTheDocument()

    // Check for resources section
    expect(screen.getByText('リソース')).toBeInTheDocument()
  })

  it('renders the copyright notice with © symbol', () => {
    render(<Footer translations={mockFooterTranslations} />)

    const currentYear = new Date().getFullYear()
    const copyrightText = `© ${currentYear} 株式会社グローバルジェネックス All rights reserved.`

    expect(screen.getByText(copyrightText)).toBeInTheDocument()
  })

  it('renders the company logo as a link to homepage', () => {
    render(<Footer translations={mockFooterTranslations} />)

    const logoLink = screen.getByRole('link', {
      name: '株式会社グローバルジェネックス - ホーム'
    })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveTextContent('株式会社グローバルジェネックス')
  })

  it('renders privacy policy link', () => {
    render(<Footer translations={mockFooterTranslations} />)

    const privacyLink = screen.getByRole('link', { name: 'プライバシーポリシー' })
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })
})