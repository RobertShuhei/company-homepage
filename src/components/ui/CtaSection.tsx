import LocalizedLink from './LocalizedLink'

interface CtaSectionProps {
  title: string
  subtitle: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
}

/**
 * CtaSection - サイト全体で統一されたCTAセクション
 *
 * デザイン仕様:
 * - 背景: 薄いグレーのグラデーション (slate-50 to white)
 * - 見出し: ブランドカラーのグラデーションテキスト (navy to teal)
 * - プライマリボタン: ティール色の塗りつぶし (btn-primary-elevated)
 * - セカンダリボタン: ネイビー色の塗りつぶし (btn-secondary-solid)
 */
const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  subtitle,
  primaryButton,
  secondaryButton
}) => {
  return (
    <section className="section-spacing-lg bg-gradient-to-br from-slate-50 to-white text-navy">
      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 右側25%の範囲でのみグラデーションがかかるように調整 */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 animate-on-scroll fade-in-up bg-gradient-to-r from-navy from-75% to-teal bg-clip-text text-transparent">
            {title}
          </h2>

          <p className="text-xl md:text-2xl lg:text-3xl mb-12 lg:mb-16 leading-relaxed max-w-prose mx-auto animate-on-scroll fade-in-up stagger-1 text-gray">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center animate-on-scroll scale-in stagger-2">
            <LocalizedLink
              href={primaryButton.href}
              className="btn-interactive btn-primary-elevated text-lg lg:text-xl px-10 lg:px-12 py-5 lg:py-6 min-w-[200px]"
            >
              {primaryButton.text}
            </LocalizedLink>

            {secondaryButton && (
              <LocalizedLink
                href={secondaryButton.href}
                className="btn-secondary-solid text-lg lg:text-xl px-8 lg:px-10 py-4 lg:py-5 min-w-[180px]"
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

export default CtaSection
