'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import Logo from '@/components/logo';

type NavLink = { label: string; href: string };

function toHref(linkType?: 'internal' | 'external' | 'tel' | 'mailto', href?: string) {
  if (!href) return '#';
  switch (linkType) {
    case 'tel': return href.startsWith('tel:') ? href : `tel:${href}`;
    case 'mailto': return href.startsWith('mailto:') ? href : `mailto:${href}`;
    case 'internal': return href;
    default: return href;
  }
}

export default function Header({
  logoUrl,
  logoAlt,
  links = [],
}: {
  logoUrl?: string | null;
  logoAlt?: string | null;
  links?: NavLink[];
}) {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setSettings(j.data ?? {}))
      .catch(() => setSettings({}));
  }, []);

  const cta = settings?.header?.cta;
  const ctaFloating = settings?.header?.ctaFloating;

  const ctaClass = useMemo(() => {
    const v = cta?.variant ?? 'default';
    const s = cta?.size ?? 'md';
    return `btn btn--${v} btn--${s}`;
  }, [cta?.variant, cta?.size]);

  const ctaHref = toHref(cta?.linkType, cta?.href);

  return (
    <>
      <header className="site-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/">
              <Logo logoUrl={logoUrl ?? undefined} logoAlt={logoAlt ?? undefined} width={settings?.header?.logo?.width} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map(n => (
              <Link key={n.href} href={n.href} className="text-sm hover:opacity-80">{n.label}</Link>
            ))}

            {cta?.enabled && (
              cta?.linkType === 'internal' ? (
                <Link href={ctaHref} className={ctaClass}>{cta?.label ?? 'Kontakt'}</Link>
              ) : (
                <a href={ctaHref} className={ctaClass} target={cta?.linkType === 'external' ? '_blank' : undefined} rel="noopener noreferrer">
                  {cta?.label ?? 'Kontakt'}
                </a>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Floating CTA (mobil) */}
      {ctaFloating?.enabled && cta?.enabled && (
        <div
          className={`cta-float cta-pos--${
            ctaFloating.position ?? 'bottom-right'
          }`}
          // placering styres via CSS vars (offsets)
        >
          {cta?.linkType === 'internal' ? (
            <Link href={ctaHref} className={ctaClass}>{cta?.label ?? 'Kontakt'}</Link>
          ) : (
            <a href={ctaHref} className={ctaClass} target={cta?.linkType === 'external' ? '_blank' : undefined} rel="noopener noreferrer">
              {cta?.label ?? 'Kontakt'}
            </a>
          )}
        </div>
      )}
    </>
  );
}
