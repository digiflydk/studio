
// src/components/site/Header.tsx
"use client";

import * as React from "react";
import { fetchHeaderAppearance, computeHeaderStyles } from "@/services/header";

export default function SiteHeader() {
  const [styles, setStyles] = React.useState<ReturnType<typeof computeHeaderStyles> | null>(null);
  const [links, setLinks] = React.useState<{label:string; href:string}[]>([]);
  const [logoMaxWidth, setLogoMaxWidth] = React.useState<string>("140px");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const a = await fetchHeaderAppearance();
      if (!mounted) return;
      const s = computeHeaderStyles(a);
      setStyles(s);
      setLinks(Array.isArray(a.navLinks) ? a.navLinks : []);
      setLogoMaxWidth(s.logoMaxWidth);
    })();
    return () => { mounted = false; };
  }, []);

  // Simple scroll effect: når man scroller, skift bg til scrolledBg
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

  if (!styles) {
    return <div id="site-header" style={{ height: 72 }} />;
  }

  return (
    <header id="site-header" style={styles.root}>
      <div style={{ display:"flex", alignItems:"center", height:"100%", padding:"0 16px", gap:16 }}>
        <img
          src="/logo.svg"
          alt="Logo"
          style={{ maxWidth: logoMaxWidth, height: "auto" }}
        />
        <nav style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href} style={{ color: styles.linkColor, textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
