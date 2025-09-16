"use client";

import * as React from "react";
import { fetchHeaderAppearance, computeHeaderStyles } from "@/services/header";

export default function SiteHeader() {
  const [styles, setStyles] = React.useState<ReturnType<typeof computeHeaderStyles> | null>(null);
  const [links, setLinks] = React.useState<{label:string; href:string}[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const a = await fetchHeaderAppearance();
      if (!mounted) return;
      const s = computeHeaderStyles(a);
      setStyles(s);
      setLinks(Array.isArray((a as any).navLinks) ? (a as any).navLinks : []);
    })();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (!styles) return;
    const el = document.getElementById("site-header");
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      el.style.background = y > 10 ? styles.scrolledBg : (styles.root.background as string);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [styles]);

  if (!styles) return <div id="site-header" style={{ height: 72 }} />;

  // Container-bredde (matcher typisk site container)
  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  // Logo-styles: bevar aspect ratio; begræns bredde
  const logoStyle: React.CSSProperties = {
    maxWidth: styles.logoMaxWidth,
    height: "auto",
    display: "block",
  };

  // robust: fallback hvis logo-src fejler
  const [logoOk, setLogoOk] = React.useState(true);

  return (
    <header id="site-header" style={styles.root}>
      <div style={containerStyle}>
        {logoOk ? (
          <img
            src={styles.logoSrc}
            alt={styles.logoAlt}
            style={logoStyle}
            onError={() => setLogoOk(false)}
          />
        ) : (
          <div style={{ fontWeight: 700 }}>Logo</div>
        )}

        <nav style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              style={{ color: styles.linkColor, textDecoration: "none", fontWeight: 500 }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
