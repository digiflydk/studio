'use client';

import Link from 'next/link';
import { useEffect, useState, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import HeaderCTA from '@/components/common/HeaderCTA'; // vores CMS-styrede CTA
import MobileMenu from './MobileMenu';
import Logo from '../logo';
import type { NavLink } from '@/types/settings';
import { Button } from '../ui/button';

interface HeaderProps {
  links: NavLink[];
  logoUrl?: string;
  logoAlt?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ links, logoUrl, logoAlt = 'Digifly' }, ref) => {
    
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const n = document.querySelectorAll('[data-role="site-header"]').length;
        if (n > 1) console.warn(`[Header] Mounted ${n} times. Remove duplicates in layouts/pages.`);
      }, []);
    }

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
      <header
        ref={ref}
        data-role="site-header"
        className={cn(
          'sticky top-0 z-[100] backdrop-blur supports-[backdrop-filter]:bg-transparent',
          'border-b', // bund-linjen
        )}
        style={{
          // Border nederst (altid) – farve/tykkelse fra CMS
          borderBottomColor: 'var(--header-border-color)',
          borderBottomWidth: 'var(--header-border-h)',
          // Baggrund (initial/scrolled) – overlay ovenpå hero
          backgroundColor: scrolled
            ? `color-mix(in oklab, var(--header-bg-scrolled) calc(var(--header-bg-scrolled-alpha)*100%), transparent)`
            : `color-mix(in oklab, var(--header-bg-initial) calc(var(--header-bg-initial-alpha)*100%), transparent)`,
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
            style={{ height: 'var(--header-h)' }}>
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Forside">
            <Logo logoUrl={logoUrl} logoAlt={logoAlt} width={120} />
          </Link>

          {/* Desktop nav – kun én! */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Hovednavigation"
            data-testid="header-desktop-nav"
          >
            {links?.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-[15px] leading-none text-black/80 hover:text-black transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA (CMS-styret) – én instans */}
          <div className="hidden md:block">
            <HeaderCTA />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-black/10"
            aria-label="Åbn menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {/* simpel hamburger */}
            <div className="relative h-4 w-5">
              <span className="absolute inset-x-0 top-0 block h-0.5 bg-black"></span>
              <span className="absolute inset-x-0 top-1/2 block h-0.5 -translate-y-1/2 bg-black"></span>
              <span className="absolute inset-x-0 bottom-0 block h-0.5 bg-black"></span>
            </div>
          </button>
        </div>
        
        {/* Valgfri top-border (fra CMS) */}
        <div
          aria-hidden
          style={{
            display: 'var(--header-border-enabled)' as any ? 'block' : 'none',
            height: 0,
            borderTop: 'var(--header-border-h) solid var(--header-border-color)',
          }}
        />

        {/* Mobile menu – separat, så vi ikke dobbelt-renderer på desktop */}
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={links} />
      </header>
    );
  }
);
Header.displayName = 'Header';
export default Header;
