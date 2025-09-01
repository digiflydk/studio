
'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import type { GeneralSettings } from '@/types/settings';

declare global {
  interface Window {
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

// Helper to push events to dataLayer
function pushToDataLayer(event: object) {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
}

function GTMDeclarations({ gtmId }: { gtmId: string }) {
    return (
      <>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
            `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      </>
    );
}

function FBPixelDeclarations({ pixelId }: { pixelId: string }) {
     return (
        <Script id="fb-pixel-script" strategy="afterInteractive">
            {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
            `}
        </Script>
    )
}

function GA4Declarations({ gaId }: { gaId: string }) {
    return (
        <Script 
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
    )
}

export default function Analytics({ settings }: { settings: GeneralSettings | null }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Pageview event on path change
    useEffect(() => {
        if (pathname && settings) {
            pushToDataLayer({
                event: 'page_view',
                page_path: pathname + (searchParams?.toString() ? '?' + searchParams.toString() : ''),
                page_title: document.title,
            });

            if (settings.enableFacebookPixel && settings.facebookPixelId && window.fbq) {
                window.fbq('track', 'PageView');
            }
        }
    }, [pathname, searchParams, settings]);

    // Delegated event listeners for tracking
    useEffect(() => {
        const handleCtaClick = (e: MouseEvent) => {
            const el = (e.target as HTMLElement).closest('[data-cta]');
            if (!el) return;

            pushToDataLayer({
                event: 'cta_click',
                cta_name: el.getAttribute('data-cta')
            });
        };

        const handleFormSubmit = (e: Event) => {
            const form = (e.target as HTMLFormElement).closest('[data-form]');
            if (!form) return;

            pushToDataLayer({
                event: 'form_submit',
                form_name: form.getAttribute('data-form')
            });
        };

        document.addEventListener('click', handleCtaClick);
        document.addEventListener('submit', handleFormSubmit);

        return () => {
            document.removeEventListener('click', handleCtaClick);
            document.removeEventListener('submit', handleFormSubmit);
        }
    }, []);


    if (!settings) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            {settings.enableGtm && settings.gtmId && <GTMDeclarations gtmId={settings.gtmId} />}
            {settings.enableGoogleAnalytics && settings.googleAnalyticsId && <GA4Declarations gaId={settings.googleAnalyticsId} />}
            {settings.enableFacebookPixel && settings.facebookPixelId && <FBPixelDeclarations pixelId={settings.facebookPixelId} />}
            {/* Google Ads can be loaded via GTM, but if a direct tag is needed, it would be added here */}
        </Suspense>
    );
}
