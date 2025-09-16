// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { fetchHeaderAppearance, computeHeaderStyles } from "@/services/header";

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
    <header id="site-header" style={styles.root}>
        <div
          className="
            mx-auto w-full
            max-w-screen-xl        /* matcher typisk sitebredde (kan hæves til -2xl hvis I bruger det i sektioner) */
            px-4 md:px-6 lg:px-8  /* matcher side-padding i øvrige sektioner */
          "
        >
          <div className="flex h-full items-center justify-between gap-6">
            {/* Venstre: Logo */}
            <a href="/" className="shrink-0 inline-flex items-center" aria-label={styles.logoAlt}>
              <img
                src={activeLogoSrc}
                alt={styles.logoAlt}
                style={{ maxWidth: styles.logoMaxWidth, height: "auto", display: "block" }} /* display:block fjerner inline-img whitespace */
                className="object-contain"
                onError={() => { setLogoOk(false); setActiveLogoSrc(FALLBACK_LOGO); }}
              />
            </a>

            {/* Højre: Nav */}
            <nav className="ml-auto">
              <ul className="flex items-center gap-8">
                {links?.map((l) => (
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
        </div>
    </header>
  );
}