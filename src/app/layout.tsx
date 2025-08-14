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
              name: "Global Genex Inc.",
              alternateName: "Global Genex",
              url: "https://global-genex.com",
              logo: "https://global-genex.com/logo.png",
              description:
                "Expert consulting for retail & manufacturing companies in Japan and globally. AI-driven data analytics, market entry support, and digital transformation services based in Fukuoka.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Fukuoka",
                addressRegion: "Fukuoka",
                addressCountry: "Japan",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Business",
                email: "info@global-genex.com",
                availableLanguage: ["English", "Japanese"],
              },
              founder: {
                "@type": "Person",
                name: "Shuhei Nakahara",
                jobTitle: "Representative Director",
              },
              foundingDate: "2025",
              industry: "Business Consulting",
              serviceArea: ["Japan", "Global"],
              knowsAbout: [
                "Retail Consulting",
                "Manufacturing Consulting",
                "AI Analytics",
                "Data Analytics", 
                "Digital Transformation",
                "Japan Market Entry",
                "Cross-border Business",
              ],
              sameAs: [
                "https://linkedin.com/company/global-genex-inc",
                "https://twitter.com/globalgenex",
              ],
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
