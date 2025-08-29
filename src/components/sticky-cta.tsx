
'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  
  const handleClick = () => {
    const section = document.getElementById('ai-project');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] md:hidden">
      <Button 
        className="w-full shadow-lg" 
        size="lg" 
        data-cta="tell_us_about_project_sticky"
        onClick={handleClick}
      >
        Fortæl os om dit projekt
      </Button>
    </div>
  );
}
