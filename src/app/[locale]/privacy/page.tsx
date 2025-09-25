import type { Metadata } from 'next';
import { getServerTranslations } from '@/lib/translations'
import { generateLocalizedMetadata } from '@/lib/metadata'
import { type Locale, isValidLocale, defaultLocale } from '../../../../i18n.config'
import { notFound } from 'next/navigation'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale;
  
  return generateLocalizedMetadata({
    locale,
    pathname: locale === defaultLocale ? '/privacy' : `/${locale}/privacy`,
    page: 'privacy'
  });
}

export default async function LocalizedPrivacyPage({ params }: PrivacyPageProps) {
  const resolvedParams = await params;
  
  // Validate locale
  if (!isValidLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const t = await getServerTranslations(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <section className="bg-navy text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.privacy.title}</h1>
            <p className="text-slate-300 text-lg">{t.privacy.lastUpdated}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.overview.title}</h2>
            {t.privacy.sections.overview.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.collection.title}</h2>
            <h3 className="text-xl font-semibold text-navy mb-3">{t.privacy.sections.collection.personalInfo.title}</h3>
            <p className="text-gray leading-relaxed mb-4">{t.privacy.sections.collection.personalInfo.description}</p>
            <ul className="list-disc list-inside text-gray mb-6 space-y-2">
              {t.privacy.sections.collection.personalInfo.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-navy mb-3">{t.privacy.sections.collection.usage.title}</h3>
            <p className="text-gray leading-relaxed mb-4">
              {t.privacy.sections.collection.usage.description}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.usage.title}</h2>
            <ul className="list-disc list-inside text-gray space-y-2">
              {t.privacy.sections.usage.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.sharing.title}</h2>
            {t.privacy.sections.sharing.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.security.title}</h2>
            {t.privacy.sections.security.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.transfers.title}</h2>
            {t.privacy.sections.transfers.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.rights.title}</h2>
            <ul className="list-disc list-inside text-gray space-y-2">
              {t.privacy.sections.rights.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}:</strong> {item.description}
                </li>
              ))}
            </ul>
            <p className="text-gray leading-relaxed mt-4">
              {t.privacy.sections.rights.contact}
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.children.title}</h2>
            {t.privacy.sections.children.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-12 bg-slate-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.contact.title}</h2>
            <p className="text-gray leading-relaxed mb-4">
              {t.privacy.sections.contact.description}
            </p>
            <div className="text-gray space-y-2">
              <p><strong>{locale === 'ja' ? 'メール' : 'Email'}:</strong> {t.privacy.sections.contact.email}</p>
              <p><strong>{locale === 'ja' ? '電話' : 'Phone'}:</strong> {t.privacy.sections.contact.phone}</p>
              <div className="leading-relaxed">
                <strong>{locale === 'ja' ? '住所' : 'Address'}:</strong><br />
                <div className="whitespace-pre-line">{t.privacy.sections.contact.address}</div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">{t.privacy.sections.updates.title}</h2>
            {t.privacy.sections.updates.content.map((paragraph, index) => (
              <p key={index} className="text-gray leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}