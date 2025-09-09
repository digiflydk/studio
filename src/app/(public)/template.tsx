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

    return (
        <ThemeProvider settings={settings}>
            <Header ref={headerRef} settings={settings} />
            <AnnouncementBanner ref={bannerRef} />
            <main>
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
