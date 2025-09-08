
'use client';

import { Badge } from '@/components/ui/badge';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useLayoutEffect } from 'react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isVisible && bannerRef.current) {
        root.style.setProperty('--announcement-banner-height', `${bannerRef.current.offsetHeight}px`);
    } else {
        root.style.setProperty('--announcement-banner-height', '0px');
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={bannerRef} className="relative bg-primary text-primary-foreground transition-all duration-300 ease-in-out">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-2.5 text-sm font-medium">
        <div className="flex items-center justify-center text-center">
          <Badge variant="secondary" className="bg-white/20 text-white mr-3 hidden sm:inline-flex">NEW</Badge>
          <p className="flex items-center flex-wrap justify-center">
            <span className="mr-1">Digifly Handheld POS is now LIVE. Combine orders, payments and loyalty in one portable device</span>
            <Link href="#" className="ml-1 inline-flex items-center group whitespace-nowrap">
              <span className="group-hover:underline">
                Learn more
              </span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full text-primary-foreground hover:bg-black/10 hidden md:inline-flex"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
