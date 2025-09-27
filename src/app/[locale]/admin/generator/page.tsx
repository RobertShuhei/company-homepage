import { notFound } from 'next/navigation';
import AdminGeneratorClient from './AdminGeneratorClient';
import { getServerTranslations } from '@/lib/translations';
import { isValidLocale, type Locale } from '@/lib/i18n';

interface AdminGeneratorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminGeneratorPage({
  params,
}: AdminGeneratorPageProps) {
  const resolvedParams = await params;

  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;

  try {
    const translations = await getServerTranslations(locale);

    // Validate admin translations are loaded (only warn in development)
    if (!translations.admin && process.env.NODE_ENV === 'development') {
      console.warn('Admin translations missing for locale:', locale);
      console.warn('Available translation keys:', Object.keys(translations));
    }

    return (
      <AdminGeneratorClient
        locale={locale}
        translations={translations}
      />
    );
  } catch (error) {
    console.error('Failed to load translations:', error);

    // Try to load fallback translations directly
    try {
      const fallbackTranslations = await import(`@/locales/${locale}/common.json`);
      return (
        <AdminGeneratorClient
          locale={locale}
          translations={fallbackTranslations.default}
        />
      );
    } catch (fallbackError) {
      console.error('Failed to load fallback translations:', fallbackError);

      // Final fallback - return error state
      return (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-700">
            {locale === 'ja' ? '翻訳の読み込みに失敗しました' : 'Failed to load translations'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {locale === 'ja' ? 'ページを更新してください' : 'Please refresh the page'}
          </p>
        </div>
      );
    }
  }
}
