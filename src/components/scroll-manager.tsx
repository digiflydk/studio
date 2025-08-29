
'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollManager() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname === '/' && window.location.hash) {
      // Fjern kun hash – bevar sti + query, undgå fremtidige basepath issues
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
