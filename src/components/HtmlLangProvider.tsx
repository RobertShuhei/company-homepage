'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isValidLocale, defaultLocale, type Locale } from '../../i18n.config';

export default function HtmlLangProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const potentialLocale = pathSegments[0];
    
    const locale: Locale = isValidLocale(potentialLocale) 
      ? (potentialLocale as Locale) 
      : defaultLocale;

    // Update the HTML lang attribute
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}