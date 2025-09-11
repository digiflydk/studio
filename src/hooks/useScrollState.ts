'use client';
import { useState, useEffect } from 'react';

export function useScrollState() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrolled = document.documentElement.getAttribute('data-scrolled') === 'true';
      setIsScrolled(scrolled);
    };

    // Initial check
    checkScroll();

    // Use a MutationObserver to watch for attribute changes on <html>
    const observer = new MutationObserver(checkScroll);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-scrolled'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { isScrolled };
}
