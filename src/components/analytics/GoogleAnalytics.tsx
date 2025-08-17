'use client';

import { useEffect } from 'react';
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

export default function GoogleAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // クライアントサイドでのページ遷移を処理する
  useEffect(() => {
    // 測定IDがない、またはブラウザ環境でない場合は終了
    if (!measurementId || typeof window === 'undefined' || !window.gtag) {
      return;
    }

    // パス名とクエリパラメータからページパスを作成
    const pagePath = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;

    // ページビューイベントを手動で送信
    window.gtag('config', measurementId, {
      page_path: pagePath,
    });
  }, [measurementId, pathname, searchParams]);

  // 初期スクリプトの読み込み
  if (!measurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics: No measurement ID provided');
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        id="google-analytics-script"
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              send_page_view: false, // 自動ページビュー送信を無効化
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