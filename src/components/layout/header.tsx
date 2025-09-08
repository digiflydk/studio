
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import type { NavLink, GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import { useEffect, useState, Suspense, useRef } from 'react';
import { usePathname } from 'next/navigation';

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

function HeaderInner({ settings }: { settings: GeneralSettings | null }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navLinks = settings?.headerNavLinks && settings.headerNavLinks.length > 0 
    ? settings.headerNavLinks 
    : defaultNavLinks;
  
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50); // Juster tærsklen for, hvornår headeren bliver sticky
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('scroll-padding-top', `${headerHeight}px`);
    }
  }, []);

  const height = settings?.headerHeight || 64;

  const currentBgColor = isScrolled 
    ? settings?.headerScrolledBackgroundColor 
    : settings?.headerInitialBackgroundColor;

  const currentOpacity = isScrolled 
    ? (settings?.headerScrolledBackgroundOpacity ?? 95) / 100 
    : (settings?.headerInitialBackgroundOpacity ?? 0) / 100;

  const headerStyle: React.CSSProperties = {
    height: `${height}px`,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
  };

  if (currentBgColor) {
    const { h, s, l } = currentBgColor;
    headerStyle.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${currentOpacity})`;
    if (currentOpacity > 0.8 && isScrolled) {
        headerStyle.borderColor = `hsla(${h}, ${s}%, ${l-10}%, ${currentOpacity})`;
    }
  } else {
     headerStyle.backgroundColor = 'transparent';
  }
  
  const linkStyle: React.CSSProperties = {
    fontSize: settings?.headerLinkSize ? `${settings.headerLinkSize}px` : undefined,
  };

  const navLinkClasses = cn(
    "font-medium transition-colors",
    settings?.headerLinkColor || "text-foreground/70",
    `hover:${settings?.headerLinkHoverColor || 'text-foreground'}`
  );
  
  const mobileNavLinkClasses = cn(
    "text-lg font-medium transition-colors",
    settings?.headerLinkColor || "text-foreground",
    `hover:${settings?.headerLinkHoverColor || 'text-primary'}`
  );
  
  const menuIconClasses = cn(
    "h-6 w-6",
    settings?.headerMenuIconColor || "text-foreground"
  );
  
  const getLinkHref = (href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
        return `/${href}`;
    }
    return href;
  }

  return (
    <header 
      ref={headerRef}
      className={cn(
        "w-full flex items-center z-50",
        isScrolled ? "sticky top-0 border-b border-border/40 shadow-sm" : "absolute top-0 border-b border-transparent"
      )}
      style={headerStyle}
      >
      <div className="container mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo 
              logoUrl={settings?.logoUrl} 
              logoAlt={settings?.logoAlt} 
              width={settings?.headerLogoWidth || 96}
              isDark={!isScrolled || (currentBgColor ? currentBgColor.l < 50 : false)}
            />
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
             <Link
                key={link.href}
                href={getLinkHref(link.href)}
                className={navLinkClasses}
                style={linkStyle}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className={menuIconClasses} />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetTitle className="sr-only">{settings?.logoAlt || 'Menu'}</SheetTitle>
                <SheetDescription className="sr-only">
                    Hovednavigation med links til sidens sektioner.
                </SheetDescription>
              <div className="flex flex-col p-6">
                <div className="mb-8">
                  <Link href="/" className="flex items-center gap-2">
                    <Logo 
                        logoUrl={settings?.logoUrl} 
                        logoAlt={settings?.logoAlt}
                        width={settings?.headerLogoWidth || 96}
                    />
                  </Link>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                     <Link
                        key={link.href}
                        href={getLinkHref(link.href)}
                        className={mobileNavLinkClasses}
                        style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}


export default function Header({ settings }: { settings: GeneralSettings | null }) {
    return (
        <Suspense fallback={<header className="h-16 w-full"></header>}>
            <HeaderInner settings={settings} />
        </Suspense>
    );
}
