
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
        const calculatePadding = () => {
            if (mainRef.current) {
                const headerHeight = headerRef.current?.offsetHeight || 0;
                const bannerHeight = bannerRef.current?.offsetHeight || 0;
                mainRef.current.style.paddingTop = `${headerHeight + bannerHeight}px`;
            }
        };

        calculatePadding();

        const resizeObserver = new ResizeObserver(calculatePadding);
        if (headerRef.current) resizeObserver.observe(headerRef.current);
        if (bannerRef.current) resizeObserver.observe(bannerRef.current);

        return () => {
            if (headerRef.current) resizeObserver.unobserve(headerRef.current);
            if (bannerRef.current) resizeObserver.unobserve(bannerRef.current);
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
