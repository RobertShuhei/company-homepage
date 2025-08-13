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
    default: "Corporate Solutions",
    template: "%s | Corporate Solutions",
  },
  description: "We help businesses unlock their potential through strategic consulting, digital transformation, and process optimization.",
  keywords: ["business solutions", "professional services", "corporate consulting", "business consulting"],
  authors: [{ name: "Corporate Solutions" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://global-genex.com",
    title: "Corporate Solutions",
    description: "We help businesses unlock their potential through strategic consulting, digital transformation, and process optimization.",
    siteName: "Corporate Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Solutions",
    description: "We help businesses unlock their potential through strategic consulting, digital transformation, and process optimization.",
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
