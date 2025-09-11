'use client';
import Link from 'next/link';
import React from 'react';
import Logo from '@/components/logo';
import HeaderCTA from '@/components/common/HeaderCTA';
import MobileMenu from './MobileMenu';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollState } from '@/hooks/useScrollState';

type NavLink = { label: string; href: string };

type Props = {
  logoUrl?: string | null;
  logoAlt?: string | null;
  links?: NavLink[];
};

export default function Header({ logoUrl, logoAlt, links = [] }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { settings } = useHeaderSettings();
  const isMobile = useIsMobile();
  const { isScrolled } = useScrollState();

  const headerHeight = settings?.headerHeight ?? 72;
  
  React.useEffect(() => {
    document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
  }, [headerHeight]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header data-testid="site-header" className="site-header" data-scrolled={isScrolled}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={closeMenu}>
          <Logo logoUrl={logoUrl ?? undefined} logoAlt={logoAlt ?? undefined} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links?.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="text-sm hover:opacity-80">
              {l.label}
            </Link>
          ))}
          <HeaderCTA />
        </nav>

        <div className="md:hidden">
          <Button size="icon" variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMobile && <MobileMenu open={menuOpen} onClose={closeMenu} links={links} />}
    </header>
  );
}
