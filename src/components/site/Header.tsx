// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { fetchHeaderAppearance, computeHeaderStyles } from "@/services/header";
import SiteContainer from "@/components/ui/SiteContainer";

export default function SiteHeader() {
  const FALLBACK_LOGO = `data:image/svg+xml;utf8,` +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='28' viewBox='0 0 140 28'>
  <rect width='140' height='28' rx='6' fill='#111827'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Inter,system-ui' font-size='14' font-weight='700'>Logo</text>
</svg>`);

  // 1) Hooks først — altid samme rækkefølge
  const [styles, setStyles] = React.useState<ReturnType<typeof computeHeaderStyles> | null>(null);
  const [links, setLinks] = React.useState<{label:string; href:string}[]>([]);
  const [activeLogoSrc, setActiveLogoSrc] = React.useState<string>(FALLBACK_LOGO);
  const [logoOk, setLogoOk] = React.useState(true);

  // 2) Effects
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const a = await fetchHeaderAppearance();
      if (!mounted) return;
      const s = computeHeaderStyles(a);
      setStyles(s);
      setLinks(Array.isArray((a as any).navLinks) ? (a as any).navLinks : []);
      setActiveLogoSrc(s.logoSrc ?? FALLBACK_LOGO);
    })();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (!styles) return;
    const el = document.getElementById("site-header");
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const bg = y > 10 ? styles.scrolledBg : (styles.root.background as string);
      el.style.background = bg;
      el.style.backgroundColor = bg;                // sikrer solid farve
      setActiveLogoSrc(y > 10 ? (styles.logoScrolledSrc ?? styles.logoSrc ?? FALLBACK_LOGO)
                              : (styles.logoSrc ?? FALLBACK_LOGO));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [styles]);

  // 3) Første conditional return kommer først HER
  if (!styles) return <div id="site-header" style={{ height: 72 }} />;

  // 4) Render logik
  return (
    <header
      id="site-header"
      // VIGTIGT: ingen px-* her — padding styres af SiteContainer
      className="sticky top-0 z-50 border-b"
      style={styles.root}
    >
      <SiteContainer>
        <div className="flex h-full items-center justify-between gap-6">
          {/* VENSTRE: LOGO */}
          <a href="/" className="block shrink-0" aria-label={styles.logoAlt}>
            <img
              src={activeLogoSrc}
              alt={styles.logoAlt}
              className="block object-contain"
              style={{ maxWidth: styles.logoMaxWidth, height: "auto" }}
              onError={() => { setLogoOk(false); setActiveLogoSrc(FALLBACK_LOGO); }}
            />
          </a>

          {/* HØJRE: NAV */}
          <nav className="ml-0">
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
        </div>
      </SiteContainer>
    </header>
  );
}
