
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import type { NavLink, GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import { useEffect, useState, Suspense, forwardRef } from 'react';
import { usePathname } from 'next/navigation';

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

const HeaderInner = forwardRef<HTMLElement, { settings: GeneralSettings | null }>(({ settings }, ref) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navLinks = settings?.headerNavLinks && settings.headerNavLinks.length > 0 
    ? settings.headerNavLinks 
    : defaultNavLinks;
  
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const height = settings?.headerHeight || 64;

  const currentBgColor = isScrolled 
    ? settings?.headerScrolledBackgroundColor 
    : settings?.headerInitialBackgroundColor;

  const currentOpacity = isScrolled 
    ? (settings?.headerScrolledBackgroundOpacity ?? 95) / 100 
    : (settings?.headerInitialBackgroundOpacity ?? 0) / 100;

  const headerStyle: React.CSSProperties & { [key: string]: any } = {
    '--header-height': `${height}px`,
    height: 'var(--header-height)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
  };

  const bottomBorderStyle: React.CSSProperties = {};
  if (settings?.headerTopBorderEnabled && settings?.headerTopBorderColor) {
      const { h, s, l } = settings.headerTopBorderColor;
      bottomBorderStyle.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
      bottomBorderStyle.height = `1px`;
  }

  if (currentBgColor) {
    const { h, s, l } = currentBgColor;
    headerStyle.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${currentOpacity})`;
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
      ref={ref}
      className={cn(
        "w-full flex flex-col z-50",
        settings?.headerIsSticky !== false ? "fixed top-0" : "absolute top-0",
        isScrolled && 'shadow-md'
      )}
      style={headerStyle}
      >
      <div 
        className="w-full flex items-center h-full"
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
      </div>
      {settings?.headerTopBorderEnabled && (
         <div style={bottomBorderStyle} className="w-full"></div>
      )}
    </header>
  );
});
HeaderInner.displayName = "HeaderInner";


const Header = forwardRef<HTMLElement, { settings: GeneralSettings | null }>(({ settings }, ref) => {
    return (
        <Suspense fallback={<header ref={ref} className="h-16 w-full"></header>}>
            <HeaderInner ref={ref} settings={settings} />
        </Suspense>
    );
});
Header.displayName = "Header";

export default Header;
