
'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollManager() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
