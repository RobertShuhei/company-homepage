import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import BreadcrumbStructuredData from '@/components/BreadcrumbStructuredData';
import StructuredData from '@/components/StructuredData';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { generateLocalizedMetadata } from '@/lib/metadata';
import { extractFooterTranslations, extractNavigationTranslations } from '@/lib/translations';
import { defaultLocale, isValidLocale, type Locale } from '@/lib/i18n';

interface SiteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

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
    page: 'home',
  });
}

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const resolvedParams = await params;

  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const [navigationTranslations, footerTranslations] = await Promise.all([
    extractNavigationTranslations(locale),
    extractFooterTranslations(locale),
  ]);

  return (
    <>
      <GoogleAnalytics />
      <StructuredData locale={locale} />
      <BreadcrumbStructuredData locale={locale} />
      <Header navigationTranslations={navigationTranslations} locale={locale} />
      <main>{children}</main>
      <Footer translations={footerTranslations} />
    </>
  );
}
