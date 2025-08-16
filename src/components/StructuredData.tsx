'use client';

import { type Locale } from '../../i18n.config';

interface StructuredDataProps {
  locale: Locale;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://global-genex.com/#organization",
    name: locale === 'ja' ? "株式会社グローバルジェネックス" : "Global Genex Inc.",
    alternateName: locale === 'ja' ? ["グローバルジェネックス", "Global Genex"] : ["Global Genex", "グローバルジェネックス"],
    url: "https://global-genex.com",
    logo: {
      "@type": "ImageObject",
      url: "https://global-genex.com/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://global-genex.com/og-image.png",
    description: locale === 'ja' 
      ? "日本とグローバルな小売・製造業向けの専門コンサルティング。福岡を拠点に、AIを活用したデータ分析、市場参入支援、デジタル変革サービスを提供。"
      : "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services based in Fukuoka.",
    slogan: locale === 'ja'
      ? "AIを活用した実践的コンサルティングで業務変革を実現"
      : "Transform Your Operations with AI-Driven, Hands-On Consulting",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5F-B, ParkFront, 1-23-2 Hakata Ekimae",
      addressLocality: "Fukuoka",
      addressRegion: "Fukuoka Prefecture",
      postalCode: "812-0011",
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5904,
      longitude: 130.4017,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+81-70-8361-4870",
        email: "info@global-genex.com",
        availableLanguage: ["English", "Japanese"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
          validFrom: "2025-01-01",
        },
      },
    ],
    founder: {
      "@type": "Person",
      "@id": "https://global-genex.com/about#shuhei-nakahara",
      name: locale === 'ja' ? "中原 修平" : "Shuhei Nakahara",
      givenName: "Shuhei",
      familyName: "Nakahara",
      jobTitle: locale === 'ja' ? "代表取締役" : "Representative Director",
      worksFor: {
        "@id": "https://global-genex.com/#organization",
      },
      nationality: "Japanese",
      knowsLanguage: ["Japanese", "English"],
      alumniOf: "Tokyo Institute of Technology",
    },
    foundingDate: "2024-10",
    foundingLocation: {
      "@type": "Place",
      name: "Fukuoka, Japan",
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "1-10",
    },
    industry: locale === 'ja' 
      ? ["ビジネスコンサルティング", "デジタル変革", "データ分析"]
      : ["Business Consulting", "Digital Transformation", "Data Analytics"],
    areaServed: [
      {
        "@type": "Country",
        name: "Japan",
      },
      {
        "@type": "Place",
        name: "Global",
      },
    ],
    serviceType: locale === 'ja'
      ? [
          "製造業コンサルティング",
          "小売業コンサルティング",
          "データ分析",
          "デジタル変革",
          "市場参入支援",
          "国際ビジネスコンサルティング",
        ]
      : [
          "Manufacturing Consulting",
          "Retail Consulting", 
          "Data Analytics",
          "Digital Transformation",
          "Market Entry Support",
          "Cross-border Business Consulting",
        ],
    knowsAbout: locale === 'ja'
      ? [
          "小売業務",
          "製造業最適化",
          "AIアナリティクス",
          "データサイエンス",
          "デジタル変革",
          "日本市場参入",
          "国際ビジネス",
          "サプライチェーン管理",
          "在庫管理",
          "需要計画",
        ]
      : [
          "Retail Operations",
          "Manufacturing Optimization",
          "AI Analytics",
          "Data Science", 
          "Digital Transformation",
          "Japan Market Entry",
          "Cross-border Business",
          "Supply Chain Management",
          "Inventory Management",
          "Demand Planning",
        ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: locale === 'ja' ? "ビジネスコンサルティング専門知識" : "Business Consulting Expertise",
        credentialCategory: "Professional Experience",
      },
    ],
    sameAs: [
      "https://linkedin.com/company/global-genex-inc",
      "https://twitter.com/globalgenex",
    ],
    potentialAction: {
      "@type": "ContactAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://global-genex.com${locale === 'ja' ? '/ja' : ''}/contact`,
        inLanguage: [locale],
      },
    },
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}