'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StickyCta() {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <Button asChild className="w-full shadow-lg" size="lg">
        <Link href="#ai-project">Fortæl os om dit projekt</Link>
      </Button>
    </div>
  );
}
