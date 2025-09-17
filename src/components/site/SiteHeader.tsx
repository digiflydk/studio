
// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { computeHeaderStyles } from "@/services/header";
import SiteContainer from "@/components/ui/SiteContainer";

export default function SiteHeader({ appearance }: { appearance: any }) {
  const FALLBACK_LOGO = `data:image/svg+xml;utf8,` +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='28' viewBox='0 0 140 28'>
  <rect width='140' height='28' rx='6' fill='#111827'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter,system-ui' font-size='14' font-weight='700'>Logo</text>
</svg>`);

  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  const styles = React.useMemo(() => computeHeaderStyles(appearance), [appearance]);
  const links = appearance?.navLinks ?? [];
  const headerCta = appearance?.cta;

  const [activeLogoSrc, setActiveLogoSrc] = React.useState<string>(styles.logoSrc ?? FALLBACK_LOGO);
  const [logoOk, setLogoOk] = React.useState(true); // Antager logo virker, indtil det modsatte er bevist

  React.useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const isScrolled = y > 10;
      const bg = isScrolled ? styles.scrolledBg : (styles.root.background as string);
      el.style.background = bg;
      el.style.backgroundColor = bg; // sikrer solid farve
      setActiveLogoSrc(isScrolled ? (styles.logoScrolledSrc ?? styles.logoSrc ?? FALLBACK_LOGO) : (styles.logoSrc ?? FALLBACK_LOGO));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [styles]);

  return (
    <>
    <header
      id="site-header"
      className="sticky top-0 z-[100] w-full border-b"
      style={styles.root}
    >
      <SiteContainer>
        <div className="flex h-full items-center justify-between gap-3">
          {/* Logo */}
          <a href="/" className="block shrink-0" aria-label={styles.logoAlt}>
            <img
              src={activeLogoSrc}
              alt={styles.logoAlt}
              className="block object-contain"
              style={{ maxWidth: styles.logoMaxWidth, height: "auto" }}
              onError={() => {
                if (logoOk) { // Undgå uendeligt loop
                  setLogoOk(false);
                  setActiveLogoSrc(FALLBACK_LOGO);
                }
              }}
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
                    style={{ color: styles.linkColor }}
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
