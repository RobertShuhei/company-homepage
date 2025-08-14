import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Global Genex Inc.",
    template: "%s | Global Genex Inc.",
  },
  description:
    "Retail & Manufacturing × AI & Data Analytics × Global Expansion. We bridge Japan and global markets with AI-driven consulting, market entry support, and DX for manufacturing.",
  keywords: [
    "Global Genex",
    "Japan market entry",
    "cross-border",
    "manufacturing",
    "retail",
    "AI",
    "data analytics",
    "DX",
    "Fukuoka",
  ],
  authors: [{ name: "Global Genex Inc." }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://global-genex.com",
    title: "Global Genex Inc.",
    description:
      "Retail & Manufacturing × AI & Data Analytics × Global Expansion.",
    siteName: "Global Genex Inc.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Genex Inc.",
    description:
      "Retail & Manufacturing × AI & Data Analytics × Global Expansion.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
