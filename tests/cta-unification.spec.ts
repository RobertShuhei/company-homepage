import { test, expect } from '@playwright/test';

test.describe('CTA Section Visual Consistency', () => {
  test('Services page CTA should match Homepage CTA design', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3002/ja');

    // CTAセクションが表示されるまで待機（無料相談予約ボタンで識別）
    const homeCtaSection = page.locator('section').filter({ hasText: '無料相談予約' }).last();
    await expect(homeCtaSection).toBeVisible();

    // ホームページCTAセクションのスクリーンショットを撮影（基準）
    await expect(homeCtaSection).toHaveScreenshot('homepage-cta.png', {
      maxDiffPixels: 100, // 最大100ピクセルの差異を許容
    });

    // サービスページにアクセス
    await page.goto('http://localhost:3002/ja/services');

    // CTAセクションが表示されるまで待機（無料相談予約ボタンで識別）
    const servicesCtaSection = page.locator('section').filter({ hasText: '無料相談予約' }).last();
    await expect(servicesCtaSection).toBeVisible();

    // サービスページCTAセクションのスクリーンショットを撮影して比較
    await expect(servicesCtaSection).toHaveScreenshot('homepage-cta.png', {
      maxDiffPixels: 100,
    });
  });

  test('CTA sections should have consistent styling across all pages', async ({ page }) => {
    const pages = [
      { url: 'http://localhost:3002/ja', name: 'Homepage' },
      { url: 'http://localhost:3002/ja/about', name: 'About' },
      { url: 'http://localhost:3002/ja/services', name: 'Services' },
    ];

    for (const { url, name } of pages) {
      await page.goto(url);

      // CTAセクションを取得（無料相談予約ボタンで識別）
      const ctaSection = page.locator('section').filter({ hasText: '無料相談予約' }).last();
      await expect(ctaSection).toBeVisible();

      // 背景色がグレーグラデーションであることを確認
      const bgClass = await ctaSection.getAttribute('class');
      expect(bgClass).toContain('bg-gradient-to-br');
      expect(bgClass).toContain('from-slate-50');
      expect(bgClass).toContain('to-white');

      // 見出しがグラデーションテキストであることを確認
      const heading = ctaSection.locator('h2');
      const headingClass = await heading.getAttribute('class');
      expect(headingClass).toContain('bg-gradient-to-r');
      expect(headingClass).toContain('from-navy');
      expect(headingClass).toContain('to-teal');
      expect(headingClass).toContain('bg-clip-text');
      expect(headingClass).toContain('text-transparent');

      // プライマリボタンが存在することを確認
      const primaryButton = ctaSection.locator('a').filter({ hasText: '無料相談予約' }).first();
      await expect(primaryButton).toBeVisible();
      const primaryBtnClass = await primaryButton.getAttribute('class');
      expect(primaryBtnClass).toContain('btn-primary-elevated');

      // セカンダリボタンが存在することを確認（ページによってテキストが異なるので、2番目のボタンを取得）
      const secondaryButton = ctaSection.locator('a').nth(1);
      await expect(secondaryButton).toBeVisible();
      const secondaryBtnClass = await secondaryButton.getAttribute('class');
      expect(secondaryBtnClass).toContain('btn-secondary-solid');

      console.log(`✅ ${name} page CTA section verified successfully`);
    }
  });
});
