
'use client';

import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { ThemeContextWrapper } from '@/context/ThemeContextWrapper';
import AnnouncementBanner from '@/components/announcement-banner';
import { cn } from '@/lib/utils';

function StickyHeaderManager({ children }: { children: ReactNode }) {
    const bannerRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        if (!bannerRef.current) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Sæt sticky, når toppen af banneret er *over* toppen af viewporten
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            { threshold: [0], rootMargin: "0px" }
        );

        observer.observe(bannerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={bannerRef} className="relative z-50">
                <AnnouncementBanner />
            </div>
            <div className={cn("sticky top-0 z-40", isSticky ? "shadow-md" : "")}>
                <Suspense fallback={<header className="h-16 w-full"></header>}>
                    <Header settings={useGeneralSettings()} isSticky={isSticky} />
                </Suspense>
            </div>
            {children}
        </>
    );
}

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    
    return (
        <ThemeContextWrapper settings={settings}>
            <StickyHeaderManager>
                {children}
            </StickyHeaderManager>

            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} />
            </Suspense>
            
            <Analytics settings={settings} />
            <Toaster />
        </ThemeContextWrapper>
    )
}
