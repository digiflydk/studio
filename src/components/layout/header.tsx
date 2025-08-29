
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import { type NavLink, type GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '@/services/settings';

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Header() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  
  useEffect(() => {
    async function load() {
        const s = await getGeneralSettings();
        setSettings(s);
    }
    load();
  }, [])
  
  const navLinks = settings?.headerNavLinks && settings.headerNavLinks.length > 0 ? settings.headerNavLinks : defaultNavLinks;

  const isSticky = settings?.headerIsSticky ?? true;
  const opacity = (settings?.headerBackgroundOpacity ?? 95) / 100;

  const headerStyle: React.CSSProperties = {};
  if (settings?.headerBackgroundColor) {
    const { h, s, l } = settings.headerBackgroundColor;
    headerStyle.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
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
  
  const handleScrollLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      history.replaceState(null, '', '/');
    }
  }


  return (
    <header 
      className={cn(
        "top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isSticky && "sticky"
      )}
      style={headerStyle}
      >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo 
              logoUrl={settings?.logoUrl} 
              logoAlt={settings?.logoAlt} 
              width={settings?.headerLogoWidth || 96}
              isDark={settings?.headerBackgroundColor && settings.headerBackgroundColor.l < 50}
            />
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
             <a
                key={link.href}
                href={link.href}
                className={navLinkClasses}
                style={linkStyle}
                onClick={(e) => {
                    if (link.href?.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(link.href);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      history.replaceState(null, '', '/');
                    }
                  }}
            >
              {link.label}
            </a>
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
              <div className="flex flex-col p-6">
                <div className="mb-8">
                  <Logo 
                    logoUrl={settings?.logoUrl} 
                    logoAlt={settings?.logoAlt}
                    width={settings?.headerLogoWidth || 96}
                  />
                </div>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                     <a
                        key={link.href}
                        href={link.href}
                        className={mobileNavLinkClasses}
                        style={linkStyle}
                        onClick={(e) => {
                            if (link.href?.startsWith('#')) {
                              e.preventDefault();
                              const el = document.querySelector(link.href);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                              history.replaceState(null, '', '/');
                            }
                          }}
                    >
                      {link.label}
                    </a>
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
