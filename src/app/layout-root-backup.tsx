import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://global-genex.com"),
  title: {
    default: "Global Genex Inc. - Retail & Manufacturing Consulting | Japan Market Entry",
    template: "%s | Global Genex Inc.",
  },
  description:
    "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services based in Fukuoka.",
  keywords: [
    "Global Genex",
    "Japan market entry",
    "cross-border consulting",
    "manufacturing consulting",
    "retail consulting",
    "AI consulting",
    "data analytics",
    "digital transformation",
    "DX consulting",
    "Fukuoka consulting",
    "bilingual consultant",
    "Japan business consultant",
  ],
  authors: [{ name: "Global Genex Inc.", url: "https://global-genex.com" }],
  creator: "Global Genex Inc.",
  publisher: "Global Genex Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://global-genex.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://global-genex.com",
    title: "Global Genex Inc. - Expert Consulting for Retail & Manufacturing",
    description:
      "Professional consulting services for retail & manufacturing companies. AI-driven analytics, Japan market entry, and digital transformation expertise.",
    siteName: "Global Genex Inc.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Global Genex Inc. - Retail & Manufacturing Consulting",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Genex Inc. - Expert Consulting for Retail & Manufacturing",
    description:
      "Professional consulting services for retail & manufacturing companies. AI-driven analytics, Japan market entry, and digital transformation expertise.",
    images: ["/og-image.png"],
    creator: "@globalgenex",
    site: "@globalgenex",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://global-genex.com/#organization",
              name: "Global Genex Inc.",
              alternateName: ["Global Genex", "グローバルジェネックス"],
              url: "https://global-genex.com",
              logo: {
                "@type": "ImageObject",
                url: "https://global-genex.com/logo.png",
                width: 512,
                height: 512,
              },
              image: "https://global-genex.com/og-image.png",
              description:
                "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services based in Fukuoka.",
              slogan: "Transform Your Operations with AI-Driven, Hands-On Consulting",
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
                name: "Shuhei Nakahara",
                givenName: "Shuhei",
                familyName: "Nakahara",
                jobTitle: "Representative Director",
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
              industry: ["Business Consulting", "Digital Transformation", "Data Analytics"],
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
              serviceType: [
                "Manufacturing Consulting",
                "Retail Consulting", 
                "Data Analytics",
                "Digital Transformation",
                "Market Entry Support",
                "Cross-border Business Consulting",
              ],
              knowsAbout: [
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
                  name: "Business Consulting Expertise",
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
                  urlTemplate: "https://global-genex.com/contact",
                  inLanguage: ["en", "ja"],
                },
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}