import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Hero from './Hero'

// Mock the LocalizedLink component to avoid i18n dependencies in unit tests
vi.mock('./LocalizedLink', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('Hero Component', () => {
  const mockProps = {
    title: 'AI活用・現場改善で\n生産性向上&業務変革を実現',
    subtitle: '小売・製造業向けプロフェッショナルコンサルティング',
    description: '現場での伴走支援・データ分析・デジタル変革を通じて、生産性と品質の向上を実現します。日本国内および海外での市場開拓も支援します。',
    primaryCTA: {
      text: '無料相談サービス',
      href: '/contact'
    },
    secondaryCTA: {
      text: 'サービスを見る',
      href: '/services'
    }
  }

  it('renders the main headline containing "AI活用・現場改善で"', () => {
    render(<Hero {...mockProps} />)

    expect(screen.getByText(/AI活用・現場改善で/)).toBeInTheDocument()
  })

  it('renders the link button with text "無料相談サービス"', () => {
    render(<Hero {...mockProps} />)

    expect(screen.getByText('無料相談サービス')).toBeInTheDocument()
  })
})