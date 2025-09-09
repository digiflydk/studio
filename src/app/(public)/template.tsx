
'use client';

import { ReactNode, Suspense, useRef, useLayoutEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { ThemeProvider } from '@/context/ThemeContext';
import AnnouncementBanner from '@/components/announcement-banner';

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    const mainRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const mainEl = mainRef.current;
        const headerEl = headerRef.current;
        const bannerEl = bannerRef.current;
    
        const calculatePadding = () => {
            if (mainEl && headerEl && bannerEl) {
                const headerHeight = headerEl.offsetHeight || 0;
                const bannerHeight = bannerEl.offsetHeight || 0;
                mainEl.style.paddingTop = `${headerHeight + bannerHeight}px`;
            }
        };

        calculatePadding();

        const resizeObserver = new ResizeObserver(calculatePadding);
        if (headerEl) resizeObserver.observe(headerEl);
        if (bannerEl) resizeObserver.observe(bannerEl);

        return () => {
            if (headerEl) resizeObserver.unobserve(headerEl);
            if (bannerEl) resizeObserver.unobserve(bannerEl);
        };
    }, [settings?.headerIsSticky]);

    return (
        <ThemeProvider settings={settings}>
            <Header ref={headerRef} settings={settings} />
            <AnnouncementBanner ref={bannerRef} />
            <main ref={mainRef}>
                {children}
            </main>

            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} />
            </Suspense>
            
            <Analytics settings={settings} />
            <Toaster />
        </ThemeProvider>
    )
}
