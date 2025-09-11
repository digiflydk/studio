
'use client';

import Link from 'next/link';
import React from 'react';
import Logo from '@/components/logo';
import HeaderCTA from '@/components/common/HeaderCTA';
import type { NavLink } from '@/types/settings';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import MobileFloatingCTA from './MobileFloatingCTA';
import { cn } from '@/lib/utils';

export default function Header({
  logoUrl,
  logoAlt,
  links = [],
}: {
  logoUrl?: string | null;
  logoAlt?: string | null;
  links?: NavLink[];
}) {
  const { settings: headerSettings } = useHeaderSettings();

  const showBorder = headerSettings?.border?.enabled === true;

  return (
    <>
      <header className="site-header" data-testid="site-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo logoUrl={logoUrl ?? undefined} logoAlt={logoAlt ?? undefined} width={headerSettings?.logo?.maxWidth} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm hover:opacity-80">
                {n.label}
              </Link>
            ))}
            <HeaderCTA />
          </nav>
        </div>
        {showBorder && (
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 'var(--header-border-width)',
              backgroundColor: 'var(--header-border-color)',
            }}
          />
        )}
      </header>
      <MobileFloatingCTA />
    </>
  );
}
