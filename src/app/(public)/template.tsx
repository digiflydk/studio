'use client';

import { ReactNode, Suspense, useRef, useLayoutEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { ThemeProvider } from '@/context/ThemeContext';
import AnnouncementBanner from '@/components/announcement-banner';
import { cn } from '@/lib/utils';

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    const headerRef = useRef<HTMLElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const headerEl = headerRef.current;
        const bannerEl = bannerRef.current;
        if (!headerEl) return;

        const headerH = headerEl.getBoundingClientRect().height ?? 0;
        const bannerH = bannerEl?.getBoundingClientRect().height ?? 0;
        const totalOffset = Math.max(0, headerH + bannerH);

        const root = document.documentElement;
        root.style.setProperty('--header-offset', `${totalOffset}px`);
        root.style.scrollPaddingTop = `${totalOffset + 8}px`; // 8px luft
    }, []);

    return (
        <ThemeProvider settings={settings}>
            <Header ref={headerRef} settings={settings} />
            <AnnouncementBanner ref={bannerRef} />
            <main className="pt-[var(--header-offset)]">
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
