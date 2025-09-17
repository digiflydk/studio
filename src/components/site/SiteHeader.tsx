// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { getGeneralSettings } from "@/services/settings";
import SiteContainer from "@/components/ui/SiteContainer";
import { resolveBgColor } from "@/lib/colors/resolveColor";
import type { GeneralSettings } from "@/types/settings";
import MobileDrawer from "@/components/site/MobileDrawer";

export default function SiteHeader({ appearance }: { appearance: any }) {
  const FALLBACK_LOGO = `data:image/svg+xml;utf8,` +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='28' viewBox='0 0 140 28'>
  <rect width='140' height='28' rx='6' fill='#111827'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter,system-ui' font-size='14' font-weight='700'>Logo</text>
</svg>`);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<GeneralSettings | null>(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    getGeneralSettings().then(setSettings);

    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = React.useMemo(() => {
    return (
      appearance?.navLinks ??
      settings?.headerNavLinks ??
      (settings as any)?.general?.headerNavLinks ??
      []
    );
  }, [appearance, settings]);

  const bgConf = scrolled ? appearance?.scrolledBg : appearance?.topBg;
  const bgColor = resolveBgColor({
    hex: bgConf?.hex,
    hsl: { h: bgConf?.h, s: bgConf?.s, l: bgConf?.l },
    opacity: bgConf?.opacity != null ? bgConf.opacity / 100 : 1,
  });

  const borderColor = resolveBgColor({
    hex: appearance?.border?.colorHex,
    hsl: appearance?.border?.color,
    opacity: 1,
  });
  const borderEnabled = !!appearance?.border?.enabled;
  const borderWidth = appearance?.border?.widthPx ?? 1;

  const logoNormal = settings?.logoUrl;
  const logoScroll = (settings as any)?.headerLogoScrollUrl;
  const logoSrc = scrolled && logoScroll ? logoScroll : logoNormal;
  
  const linkColor = appearance?.headerLinkColorHex ?? appearance?.headerLinkColor ?? "white";


  const headerCta = appearance?.cta;

  return (
    <>
    <header
      id="site-header"
      className="sticky top-0 z-[100] w-full border-b"
       style={{
        height: appearance?.headerHeight ?? 80,
        background: bgColor ?? "transparent",
        borderBottom: borderEnabled ? `${borderWidth}px solid ${borderColor ?? "transparent"}` : "none",
      }}
    >
      <SiteContainer>
        <div className="flex h-full items-center justify-between gap-3">
          {/* Logo */}
          <a href="/" className="block shrink-0" aria-label={appearance?.logo?.alt ?? 'Logo'}>
            <img
              src={logoSrc || FALLBACK_LOGO}
              alt={appearance?.logo?.alt ?? 'Logo'}
              className="block object-contain"
              style={{ maxWidth: appearance?.headerLogoWidth ?? 140, height: "auto" }}
            />
          </a>

           {/* HØJRE: CTA + NAV */}
          <div className="flex items-center gap-4">

            {/* Desktop nav (skjules på mobil) */}
            <nav className="hidden md:block">
                <ul className="flex items-center gap-6">
                {navLinks?.map((l: any, i: number) => (
                    <li key={`${l.href}-${i}`}>
                    <a href={l.href} className="text-sm hover:opacity-80" style={{ color: linkColor }}>
                        {l.label}
                    </a>
                    </li>
                ))}
                </ul>
            </nav>

            {/* Mobil hamburger (vises på md- og nedefter) */}
            <button
                type="button"
                className="md:hidden rounded p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Åbn mobilmenu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ color: linkColor }}>
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
          </div>
        </div>
      </SiteContainer>
    </header>

    <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        title="Menu"
      />
    </>
  );
}
