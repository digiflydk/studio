
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import type { NavLink, GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Header({ settings }: { settings: GeneralSettings | null }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState(settings?.headerNavLinks && settings.headerNavLinks.length > 0 ? settings.headerNavLinks : defaultNavLinks);

  useEffect(() => {
    if (!settings) return;
    const baseNavLinks = settings.headerNavLinks && settings.headerNavLinks.length > 0 ? settings.headerNavLinks : defaultNavLinks;
    const hasBlog = settings.blogPosts && settings.blogPosts.length > 0;
    
    let newNavLinks = [...baseNavLinks];

    // Add blog link if it doesn't exist and there are posts
    if (hasBlog && !newNavLinks.some(link => link.href === '/blog')) {
      newNavLinks.push({ href: '/blog', label: 'Blog' });
    }
    
    // Remove blog link if it exists and there are no posts
    if (!hasBlog) {
        newNavLinks = newNavLinks.filter(link => link.href !== '/blog');
    }

    setNavLinks(newNavLinks);

  }, [settings]);
  
  useEffect(() => {
    if (!settings?.headerIsSticky) return;
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [settings?.headerIsSticky]);

  const isSticky = settings?.headerIsSticky ?? true;
  const height = settings?.headerHeight || 64;

  const currentBgColor = isScrolled 
    ? settings?.headerScrolledBackgroundColor 
    : settings?.headerInitialBackgroundColor;

  const currentOpacity = isScrolled 
    ? (settings?.headerScrolledBackgroundOpacity ?? 95) / 100 
    : (settings?.headerInitialBackgroundOpacity ?? 0) / 100;

  const headerStyle: React.CSSProperties = {
    height: `${height}px`,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  };

  if (currentBgColor) {
    const { h, s, l } = currentBgColor;
    headerStyle.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${currentOpacity})`;
    if (currentOpacity > 0.8 && isScrolled) {
        headerStyle.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
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
      className={cn(
        "top-0 left-0 w-full z-50 flex items-center border-b",
        isSticky && "fixed",
        isScrolled ? "border-border/40" : "border-transparent"
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
              isDark={currentBgColor ? currentBgColor.l < 50 : true}
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
