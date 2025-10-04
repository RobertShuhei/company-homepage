import { test, expect } from '@playwright/test'

test.describe('ページ遷移時のアニメーション表示テスト', () => {
  test('ホームページから会社概要ページへの遷移時にコンテンツが正しく表示される', async ({ page }) => {
    // ホームページにアクセス（日本語）
    await page.goto('http://localhost:3002/ja')

    // 主要な要素が表示されることを確認（事業内容セクション）
    const servicesHeading = page.locator('h2').filter({ hasText: /事業内容|サービス/ }).first()
    await expect(servicesHeading).toBeVisible({ timeout: 10000 })

    // ヘッダーの「会社概要」リンクをクリック
    const aboutLink = page.locator('nav a').filter({ hasText: '会社概要' })
    await aboutLink.click()

    // 会社概要ページに遷移したことを確認
    await expect(page).toHaveURL(/\/ja\/about/)

    // 主要な要素が表示されることを確認（ページタイトルまたはセクション見出し）
    const pageContent = page.locator('h1, h2').first()
    await expect(pageContent).toBeVisible({ timeout: 10000 })
  })

  test('英語ページ：ホームページからAboutページへの遷移時にコンテンツが正しく表示される', async ({ page }) => {
    // ホームページにアクセス（英語）
    await page.goto('http://localhost:3002/en')

    // 主要な要素が表示されることを確認
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 10000 })

    // ヘッダーの「About」リンクをクリック
    const aboutLink = page.locator('nav a').filter({ hasText: 'About' })
    await aboutLink.click()

    // Aboutページに遷移したことを確認
    await expect(page).toHaveURL(/\/en\/about/)

    // 主要な要素が表示されることを確認
    const pageContent = page.locator('h1, h2').first()
    await expect(pageContent).toBeVisible({ timeout: 10000 })
  })

  test('サービスページからお問い合わせページへの遷移時にコンテンツが正しく表示される', async ({ page }) => {
    // サービスページにアクセス
    await page.goto('http://localhost:3002/ja/services')

    // ページが読み込まれたことを確認
    const servicesHeading = page.locator('h1, h2').first()
    await expect(servicesHeading).toBeVisible({ timeout: 10000 })

    // ヘッダーの「お問い合わせ」リンクをクリック
    const contactLink = page.locator('nav a').filter({ hasText: 'お問い合わせ' })
    await contactLink.click()

    // お問い合わせページに遷移したことを確認
    await expect(page).toHaveURL(/\/ja\/contact/)

    // フォームが表示されることを確認
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toBeVisible({ timeout: 10000 })

    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })

    const messageTextarea = page.locator('textarea[name="message"]')
    await expect(messageTextarea).toBeVisible({ timeout: 10000 })
  })
})
