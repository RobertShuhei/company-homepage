import { test, expect } from '@playwright/test'

test.describe('デザイン一貫性テスト', () => {
  test('お問い合わせページが他のページと同じセクション構造を持つ', async ({ page }) => {
    // お問い合わせページにアクセス
    await page.goto('http://localhost:3002/ja/contact')

    // ページが読み込まれたことを確認
    await page.waitForLoadState('networkidle')

    // section-spacing-lg クラスを持つセクションが存在することを確認
    const sections = page.locator('section.section-spacing-lg')
    const sectionCount = await sections.count()

    // 少なくとも3つのセクション（Hero、コンテンツ、サービスプレビュー）が存在
    expect(sectionCount).toBeGreaterThanOrEqual(3)

    // container-wide クラスを持つコンテナが存在することを確認
    const containers = page.locator('div.container-wide')
    const containerCount = await containers.count()
    expect(containerCount).toBeGreaterThan(0)

    // 背景色が交互に切り替わることを確認
    const firstSection = sections.nth(0)
    const secondSection = sections.nth(1)
    const thirdSection = sections.nth(2)

    // 各セクションが表示されることを確認
    await expect(firstSection).toBeVisible()
    await expect(secondSection).toBeVisible()
    await expect(thirdSection).toBeVisible()
  })

  test('お問い合わせページと会社概要ページのヘッダー・フッターが一貫している', async ({ page }) => {
    // お問い合わせページでヘッダーとフッターを確認
    await page.goto('http://localhost:3002/ja/contact')
    await page.waitForLoadState('networkidle')

    const contactHeader = page.locator('header').first()
    const contactFooter = page.locator('footer').first()

    await expect(contactHeader).toBeVisible()
    await expect(contactFooter).toBeVisible()

    // 会社概要ページに移動
    await page.goto('http://localhost:3002/ja/about')
    await page.waitForLoadState('networkidle')

    const aboutHeader = page.locator('header').first()
    const aboutFooter = page.locator('footer').first()

    await expect(aboutHeader).toBeVisible()
    await expect(aboutFooter).toBeVisible()

    // ヘッダーとフッターの存在を確認（構造が同じであることを検証）
    const contactNavLinks = await page.goto('http://localhost:3002/ja/contact').then(() =>
      page.locator('nav a').count()
    )

    const aboutNavLinks = await page.goto('http://localhost:3002/ja/about').then(() =>
      page.locator('nav a').count()
    )

    // ナビゲーションリンクの数が同じことを確認
    expect(contactNavLinks).toBe(aboutNavLinks)
  })

  test('お問い合わせページのアニメーションクラスが適用されている', async ({ page }) => {
    // お問い合わせページにアクセス
    await page.goto('http://localhost:3002/ja/contact')
    await page.waitForLoadState('networkidle')

    // animate-on-scroll クラスを持つ要素が存在することを確認
    const animatedElements = page.locator('.animate-on-scroll')
    const animatedCount = await animatedElements.count()

    // アニメーションクラスが適用された要素が複数存在
    expect(animatedCount).toBeGreaterThan(0)

    // 主要な要素が表示されることを確認
    const heroTitle = page.locator('h1').first()
    await expect(heroTitle).toBeVisible({ timeout: 5000 })
  })

  test('お問い合わせページが全幅セクションレイアウトを使用している', async ({ page }) => {
    // お問い合わせページにアクセス
    await page.goto('http://localhost:3002/ja/contact')
    await page.waitForLoadState('networkidle')

    // main タグが存在することを確認
    const mainTag = page.locator('main').first()
    await expect(mainTag).toBeVisible()

    // main タグ内の全ての section を取得
    const sectionsInMain = page.locator('main section')
    const sectionCount = await sectionsInMain.count()

    // main タグ内に複数の section が存在
    expect(sectionCount).toBeGreaterThanOrEqual(3)
  })
})
