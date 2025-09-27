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
  const translations = await getServerTranslations(locale);

  return (
    <AdminGeneratorClient
      locale={locale}
      translations={translations}
    />
  );
}
