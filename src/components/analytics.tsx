
'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { getGeneralSettings, GeneralSettings } from '@/services/settings';

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
            {/* End Google Tag Manager */}
        </>
    );
}

function FBPixelDeclarations({ pixelId }: { pixelId: string }) {
     return (
        <>
            {/* Facebook Pixel Code */}
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
            <noscript>
                <img height="1" width="1" style={{display: 'none'}}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                />
            </noscript>
            {/* End Facebook Pixel Code */}
        </>
    )
}

function GA4Declarations({ gaId }: { gaId: string }) {
    return (
        <>
            <Script 
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `}
            </Script>
        </>
    )
}

export default function Analytics() {
    const [settings, setSettings] = useState<Partial<GeneralSettings> | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        async function loadSettings() {
            const loadedSettings = await getGeneralSettings();
            setSettings(loadedSettings);
        }
        loadSettings();
    }, []);

    // GTM Pageview
    useEffect(() => {
        if (pathname && settings?.gtmId) {
            (window as any).dataLayer?.push({
                event: 'pageview',
                page: pathname,
            });
        }
    }, [pathname, settings?.gtmId]);
    
    // FB Pixel Pageview
     useEffect(() => {
        if (pathname && settings?.facebookPixelId) {
            import('react-facebook-pixel')
                .then((x) => x.default)
                .then((ReactPixel) => {
                    ReactPixel.pageView();
                });
        }
    }, [pathname, settings?.facebookPixelId]);


    if (!settings) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            {settings.gtmId && <GTMDeclarations gtmId={settings.gtmId} />}
            {settings.googleAnalyticsId && <GA4Declarations gaId={settings.googleAnalyticsId} />}
            {settings.facebookPixelId && <FBPixelDeclarations pixelId={settings.facebookPixelId} />}
        </Suspense>
    );
}
