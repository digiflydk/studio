'use client';
import { useEffect } from 'react';

export default function ScrollStateProvider() {
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 6;
      document.documentElement.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
}
