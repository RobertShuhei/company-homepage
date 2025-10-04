import { test, expect } from '@playwright/test'

test.describe('CTAセクションのボタン視認性テスト', () => {
  test('ホームページのCTAボタンが明確に視認できる', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3002/ja')

    // ページ全体を読み込むまで待機
    await page.waitForLoadState('networkidle')

    // ページ最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // CTAボタン（お問い合わせリンク）を探す
    const ctaButtons = page.locator('a[href*="/contact"], a[href*="お問い合わせ"]')
    const buttonCount = await ctaButtons.count()

    // 少なくとも1つのCTAボタンが表示されることを確認
    expect(buttonCount).toBeGreaterThan(0)

    // 表示されている最初のCTAボタンを確認
    const visibleButton = ctaButtons.first()
    await expect(visibleButton).toBeVisible({ timeout: 5000 })
  })

  test('英語ページのCTAボタンが明確に視認できる', async ({ page }) => {
    // 英語ページにアクセス
    await page.goto('http://localhost:3002/en')

    // ページ全体を読み込むまで待機
    await page.waitForLoadState('networkidle')

    // ページ最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // CTAボタン（お問い合わせリンク）を探す
    const ctaButtons = page.locator('a[href*="/contact"]')
    const buttonCount = await ctaButtons.count()

    // 少なくとも1つのCTAボタンが表示されることを確認
    expect(buttonCount).toBeGreaterThan(0)

    // 表示されている最初のCTAボタンを確認
    const visibleButton = ctaButtons.first()
    await expect(visibleButton).toBeVisible({ timeout: 5000 })
  })

  test('Aboutページのlight variant CTAボタンが視認できる', async ({ page }) => {
    // Aboutページにアクセス
    await page.goto('http://localhost:3002/ja/about')

    // ページ全体を読み込むまで待機
    await page.waitForLoadState('networkidle')

    // ページの最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // CTAボタン（お問い合わせリンク）を探す
    const ctaButtons = page.locator('a[href*="/contact"]')
    const buttonCount = await ctaButtons.count()

    // 少なくとも1つのCTAボタンが表示されることを確認
    expect(buttonCount).toBeGreaterThan(0)

    // 最後のCTAボタン（ページ下部）を確認
    const lastButton = ctaButtons.last()
    await expect(lastButton).toBeVisible({ timeout: 5000 })
  })

  test('CTAボタンのホバー状態が正しく動作する', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3002/ja')

    // ページ全体を読み込むまで待機
    await page.waitForLoadState('networkidle')

    // ページの最下部までスクロール
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // CTAボタン（お問い合わせリンク）を探す
    const ctaButtons = page.locator('a[href*="/contact"]')
    const primaryButton = ctaButtons.first()

    // ボタンが表示されることを確認
    await expect(primaryButton).toBeVisible({ timeout: 5000 })

    // プライマリーボタンにホバー
    await primaryButton.hover()
    await page.waitForTimeout(300) // アニメーション完了待ち

    // ホバー状態でもボタンが視認できることを確認
    await expect(primaryButton).toBeVisible()
  })
})
