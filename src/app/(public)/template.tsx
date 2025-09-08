
'use client';

import { ReactNode, Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { ThemeProvider } from '@/context/ThemeContext';
import AnnouncementBanner from '@/components/announcement-banner';

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    
    return (
        <ThemeProvider settings={settings}>
            <Header settings={settings} />
            <AnnouncementBanner />
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
