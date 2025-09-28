import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import BreadcrumbStructuredData from '@/components/BreadcrumbStructuredData';
import StructuredData from '@/components/StructuredData';
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Link from 'next/link';
import { defaultLocale, isValidLocale, type Locale } from '@/lib/i18n';
import LogoutButton from './LogoutButton';
import { validateAdminSession } from '@/lib/adminSession';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// Generate metadata for admin routes
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: paramLocale } = await params
  const locale = isValidLocale(paramLocale) ? paramLocale : defaultLocale;
  const adminPath = locale === defaultLocale ? '/admin/generator' : `/${locale}/admin/generator`;

  return {
    title: 'Admin Panel - Global Genex Inc.',
    description: 'Administrative panel for Global Genex Inc. blog content generation',
    robots: 'noindex, nofollow', // Prevent admin pages from being indexed
    alternates: {
      canonical: adminPath,
    },
  };
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale: paramLocale } = await params
  if (!isValidLocale(paramLocale)) {
    notFound();
  }

  const locale = paramLocale as Locale;
  const isAuthenticated = await validateAdminSession()

  return (
    <>
      <GoogleAnalytics />
      <StructuredData locale={locale} />
      <BreadcrumbStructuredData locale={locale} />
      <div className="min-h-screen bg-gray-50">
        {/* Admin header with language switcher - NO main site Header/Footer */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <div className="text-lg font-semibold text-navy">
                  Admin Panel - Global Genex Inc.
                </div>
                <nav className="hidden md:flex space-x-6">
                  <Link
                    href={`/${locale}/admin/generator`}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    ブログ生成
                  </Link>
                  <Link
                    href={`/${locale}/admin/blog`}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    記事管理
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                {isAuthenticated ? <LogoutButton locale={locale} /> : null}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Admin breadcrumb */}
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <div>
                      <Link href={`/${locale}`} className="text-gray-400 hover:text-gray-500">
                        <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 10v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H8a1 1 0 00-1 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-8a1 1 0 01.293-.707l7-7z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-500">Admin</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
