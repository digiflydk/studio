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

  // 4) Render logik (unchanged)
  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  const logoStyle: React.CSSProperties = {
    maxWidth: styles.logoMaxWidth,
    height: "auto",
    display: "block",
  };

  return (
    <header id="site-header" style={styles.root}>
      <div style={containerStyle}>
        {logoOk ? (
          <img
            src={activeLogoSrc}
            alt={styles.logoAlt}
            style={logoStyle}
            onError={() => { setLogoOk(false); setActiveLogoSrc(FALLBACK_LOGO); }}
          />
        ) : (
          <img src={FALLBACK_LOGO} alt="Logo" style={logoStyle} />
        )}

        <nav style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href} style={{ color: styles.linkColor, textDecoration: "none", fontWeight: 500 }}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
