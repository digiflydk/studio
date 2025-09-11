'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type NavLink = { label: string; href: string };

type Props = {
  logoUrl?: string;
  siteTitle?: string;
  nav?: NavLink[]; // udfyldes i DF-249 (Navigation)
};

export default function Header({ logoUrl, siteTitle, nav = [] }: Props) {
  return (
    <header className="site-header" data-role="site-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteTitle || 'Logo'} className="logo" />
          ) : (
            <span className="text-lg font-semibold">{siteTitle || 'Digifly'}</span>
          )}
        </div>

        {/* Nav/CTA kommer i DF-249/DF-250 */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm hover:opacity-80">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
