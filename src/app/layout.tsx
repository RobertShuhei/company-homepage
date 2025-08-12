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
    default: "Corporate Solutions | Professional Business Services",
    template: "%s | Corporate Solutions",
  },
  description: "Leading provider of professional business solutions, delivering exceptional results through innovative services and expert consultation.",
  keywords: ["business solutions", "professional services", "corporate consulting", "business consulting"],
  authors: [{ name: "Corporate Solutions" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://corporate-solutions.com",
    title: "Corporate Solutions | Professional Business Services",
    description: "Leading provider of professional business solutions, delivering exceptional results through innovative services and expert consultation.",
    siteName: "Corporate Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Solutions | Professional Business Services",
    description: "Leading provider of professional business solutions, delivering exceptional results through innovative services and expert consultation.",
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
