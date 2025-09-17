// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { getGeneralSettings } from "@/services/settings";
import SiteContainer from "@/components/ui/SiteContainer";
import { resolveBgColor } from "@/lib/colors/resolveColor";
import type { GeneralSettings } from "@/types/settings";

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
  
  const links = appearance?.navLinks ?? [];
  const linkColor = appearance?.headerLinkColorHex ?? appearance?.headerLinkColor ?? "white";


  // Lås body scroll når mobilmenu er åben
  React.useEffect(() => {
    if (mobileOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = orig; };
    }
  }, [mobileOpen]);

  // Luk med ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

          {/* Desktop-nav (skjules på mobil) */}
          <nav className="ml-auto hidden md:block" aria-label="Hovedmenu">
            <ul className="flex items-center gap-8">
              {links?.map((l: any) => (
                <li key={`${l.href}-${l.label}`}>
                  <a
                    href={l.href}
                    className="inline-flex items-center font-medium"
                    style={{ color: linkColor }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobil: Hamburger (kun < md) */}
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted"
            aria-label="Åbn menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </SiteContainer>
    </header>

    {/* ==== MOBIL DRAWER (slide-in fra højre) ==== */}
    <div
      className={`fixed inset-0 z-[101] bg-black/40 transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={() => setMobileOpen(false)}
      aria-hidden={!mobileOpen}
    />

    <aside
      className={`fixed right-0 top-0 z-[102] h-dvh w-[80vw] max-w-[360px] bg-white shadow-xl transition-transform duration-300
      ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobilmenu"
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <span className="text-sm font-semibold">Menu</span>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
          onClick={() => setMobileOpen(false)}
          aria-label="Luk menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="px-4 py-3" aria-label="Mobil navigation">
        <ul className="space-y-1">
          {links?.map((l: any) => (
            <li key={`m-${l.href}-${l.label}`}>
              <a
                href={l.href}
                className="block rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
                onClick={() => setMobileOpen(false)}
                style={{ color: "#111827" }} // Mobilmenu links er altid mørke
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {headerCta?.enabled && (
        <div className="mt-auto px-4 pb-4 pt-2">
          <a
            href={headerCta?.href}
            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-3 text-base font-semibold hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            {headerCta?.label ?? "Book et møde"}
          </a>
        </div>
      )}
    </aside>
    </>
  );
}
