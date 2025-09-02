
'use client';

import { ReactNode, Suspense } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getGeneralSettings } from '@/services/settings';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    
    return (
        <>
            <Suspense fallback={<header className="h-16 w-full"></header>}>
               <Header settings={settings} />
            </Suspense>
            
            {children}

            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} />
            </Suspense>
            
            <Analytics settings={settings} />
            <Toaster />
        </>
    )
}
