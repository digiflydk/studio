'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { WebsiteHeaderConfig } from '@/services/website.server';
import SiteContainer from '@/components/ui/SiteContainer';

function hsla(bg: WebsiteHeaderConfig['topBg']) {
  return `hsla(${bg.h} ${bg.s}% ${bg.l}% / ${bg.opacity})`;
}

export default function HeaderClient({ config }: { config: WebsiteHeaderConfig }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bg = scrolled ? config.scrolledBg : config.topBg;

  return (
    <header
      className={`w-full z-50 ${config.sticky ? 'sticky top-0' : ''}`}
      style={{
        background: hsla(bg),
        borderBottom: config.border.enabled ? `${config.border.widthPx}px solid ${config.border.colorHex}` : 'none',
      }}
    >
      <SiteContainer
        className="flex items-center justify-between"
        style={{ height: config.heightPx }}
      >
        <Link href="/" className="flex items-center gap-2" aria-label="Gå til forsiden">
          <Image
            src={config.logoUrl || '/digifly-logo-dark.svg'}
            alt={config.logoAlt || 'Digifly'}
            width={config.logoWidthPx}
            height={Math.round(config.logoWidthPx / 3)}
            priority
            style={{ height: 'auto' }}
          />
        </Link>
        <nav className="hidden gap-6 md:flex">
          {config.navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${config.linkClass}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </SiteContainer>
    </header>
  );
}
