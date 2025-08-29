
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StickyCta() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <Button asChild className="w-full shadow-lg" size="lg" data-cta="tell_us_about_project_sticky">
        <Link href="#ai-project">Fortæl os om dit projekt</Link>
      </Button>
    </div>
  );
}
