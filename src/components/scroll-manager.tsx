'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Kun på forsiden og kun hvis der er hash i URL (fx #cases)
    if (pathname === '/' && window.location.hash) {
      // Fjern hash uden reload
      history.replaceState(null, '', '/');
      // Undgå at browseren selv "genopretter" scrollposition
      window.history.scrollRestoration = 'manual';
      // Sikr top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
