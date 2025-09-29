'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

const envMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function GoogleAnalyticsInner({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedMeasurementId = (measurementId ?? envMeasurementId)?.trim();
  const searchParamString = searchParams?.toString() ?? '';

  // クライアントサイドでのページ遷移を処理する
  useEffect(() => {
    if (!resolvedMeasurementId) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.gtag !== 'function') {
      return;
    }

    const pagePath = searchParamString ? `${pathname}?${searchParamString}` : pathname;

    window.gtag('config', resolvedMeasurementId, {
      page_path: pagePath,
    });
  }, [pathname, resolvedMeasurementId, searchParamString]);

  if (!resolvedMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${resolvedMeasurementId}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${resolvedMeasurementId}', {
              send_page_view: false,
              anonymize_ip: true,
              allow_google_signals: false,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner measurementId={measurementId} />
    </Suspense>
  );
}
