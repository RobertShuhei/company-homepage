import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Card from './Card'

// Mock the LocalizedLink component
vi.mock('./LocalizedLink', () => ({
  default: ({ href, children, className, role }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    role?: string;
  }) => (
    <a href={href} className={className} role={role}>
      {children}
    </a>
  ),
}))

describe('Card Component', () => {
  const mockIcon = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )

  const mockCardProps = {
    title: 'IT導入・システム開発',
    description: '売上・業務効率・生産・品質分析のための実用的な仕組みを貴社の業務に合わせて設計・カスタマイズします。',
    icon: mockIcon,
    href: '/services',
    learnMoreText: '詳細を見る'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the card title correctly based on mock props', () => {
    render(<Card {...mockCardProps} />)

    const title = screen.getByText('IT導入・システム開発')
    expect(title).toBeInTheDocument()
    expect(title.tagName.toLowerCase()).toBe('h3')
  })

  it('renders the card description correctly based on mock props', () => {
    render(<Card {...mockCardProps} />)

    const description = screen.getByText('売上・業務効率・生産・品質分析のための実用的な仕組みを貴社の業務に合わせて設計・カスタマイズします。')
    expect(description).toBeInTheDocument()
    expect(description.tagName.toLowerCase()).toBe('p')
  })

  it('renders the "詳細を見る" link when href is provided', () => {
    render(<Card {...mockCardProps} />)

    const learnMoreLink = screen.getByText('詳細を見る')
    expect(learnMoreLink).toBeInTheDocument()
  })

  it('renders as a clickable link when href prop is provided', () => {
    render(<Card {...mockCardProps} />)

    const cardArticle = screen.getByRole('article')
    expect(cardArticle).toBeInTheDocument()

    // The href is on the LocalizedLink inside the article
    const cardLink = cardArticle.querySelector('a')
    expect(cardLink).toBeInTheDocument()
    expect(cardLink).toHaveAttribute('href', '/services')
  })

  it('renders the icon when icon prop is provided', () => {
    render(<Card {...mockCardProps} />)

    // Check that the SVG icon is rendered
    const iconSvg = screen.getByRole('article').querySelector('svg')
    expect(iconSvg).toBeInTheDocument()
    expect(iconSvg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('renders as a static card when href is not provided', () => {
    const staticCardProps = {
      ...mockCardProps,
      href: undefined
    }

    render(<Card {...staticCardProps} />)

    const cardArticle = screen.getByRole('article')
    expect(cardArticle).toBeInTheDocument()
    expect(cardArticle.tagName.toLowerCase()).toBe('article')

    // Should not contain an anchor link when no href
    const cardLink = cardArticle.querySelector('a')
    expect(cardLink).not.toBeInTheDocument()

    // Should not render learn more link when no href
    expect(screen.queryByText('詳細を見る')).not.toBeInTheDocument()
  })
})