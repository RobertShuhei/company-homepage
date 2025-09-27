import type { Metadata } from "next";
import { generateLocalizedMetadata } from '@/lib/metadata';
import { type Locale, isValidLocale, defaultLocale } from '../../../i18n.config';
import { extractNavigationTranslations, extractFooterTranslations } from '@/lib/translations';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import BreadcrumbStructuredData from '@/components/BreadcrumbStructuredData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// Generate metadata for localized routes
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: `/${locale}`,
    page: 'home'
  });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;

  // Validate locale
  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;

  // Fetch navigation and footer translations for server-side rendering
  const navigationTranslations = await extractNavigationTranslations(locale);
  const footerTranslations = await extractFooterTranslations(locale);

  return (
    <>
      <GoogleAnalytics />
      <StructuredData locale={locale} />
      <BreadcrumbStructuredData locale={locale} />
      <Header navigationTranslations={navigationTranslations} locale={locale} />
      <main>
        {children}
      </main>
      <Footer translations={footerTranslations} />
    </>
  );
}