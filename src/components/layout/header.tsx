
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import { type NavLink, type GeneralSettings } from '@/services/settings';
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
  const [navLinks, setNavLinks] = useState(settings?.headerNavLinks && settings.headerNavLinks.length > 0 ? settings.headerNavLinks : defaultNavLinks);

  useEffect(() => {
    const baseNavLinks = settings?.headerNavLinks && settings.headerNavLinks.length > 0 ? settings.headerNavLinks : defaultNavLinks;
    const hasBlog = settings?.blogPosts && settings.blogPosts.length > 0;
    
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

  }, [settings?.headerNavLinks, settings?.blogPosts]);


  const isSticky = settings?.headerIsSticky ?? true;
  const opacity = (settings?.headerBackgroundOpacity ?? 95) / 100;
  const height = settings?.headerHeight || 64;

  const headerStyle: React.CSSProperties = {
    height: `${height}px`,
  };
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
      // If we are not on the home page, first navigate there
      if (pathname !== '/') {
        window.location.href = `/${href}`;
        return;
      }
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
          const headerOffset = height; // Use dynamic height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
    }
  };


  return (
    <header 
      className={cn(
        "top-0 z-50 w-full flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isSticky && "sticky"
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
              isDark={settings?.headerBackgroundColor && settings.headerBackgroundColor.l < 50}
            />
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
             <Link
                key={link.href}
                href={link.href}
                className={navLinkClasses}
                style={linkStyle}
                onClick={(e) => handleScrollLinkClick(e, link.href)}
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
                        href={link.href}
                        className={mobileNavLinkClasses}
                        style={linkStyle}
                        onClick={(e) => handleScrollLinkClick(e, link.href)}
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
