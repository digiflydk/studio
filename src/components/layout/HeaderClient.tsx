
"use client";
import { useEffect, useState, useMemo } from "react";
import { Header } from "./header";
import type { WebsiteHeaderConfig } from "@/services/website";
import type { GeneralSettings, Brand, NavLink } from "@/types/settings";
import { usePathname } from "next/navigation";

function toHsla(h: number, s: number, l: number, opacity: number) {
  const a = Math.max(0, Math.min(1, opacity / 100));
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

export default function HeaderClient({
  brand,
  settings,
  config,
}: {
  brand?: Brand;
  settings: GeneralSettings | null;
  config: WebsiteHeaderConfig;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgTop = useMemo(() => toHsla(config.topBg.h, config.topBg.s, config.topBg.l, config.topBg.opacity), [config]);
  const bgScrolled = useMemo(() => toHsla(config.scrolledBg.h, config.scrolledBg.s, config.scrolledBg.l, config.scrolledBg.opacity), [config]);

  const vars = useMemo(() => {
    return {
      ["--header-height" as any]: `${config.heightPx}px`,
      ["--logo-width" as any]: `${config.logoWidthPx}px`,
      ["--bg-top" as any]: bgTop,
      ["--bg-scrolled" as any]: bgScrolled,
    } as React.CSSProperties;
  }, [config, bgTop, bgScrolled]);

  const isStickyActive = !!config.sticky && scrolled;

  const navLinks: NavLink[] = (settings?.header?.navLinks?.length ? settings.header.navLinks : [
    { href: "/#services", label: "Services" },
    { href: "/#cases", label: "Cases" },
    { href: "/#om-os", label: "Om os" },
    { href: "/#kontakt", label: "Kontakt" },
  ]);

  const isHomepage = pathname === "/";
  const logoUrl = isHomepage ? settings?.logoUrl : brand?.logoUrl;
  const logoAlt = isHomepage ? (settings?.websiteTitle || "Digifly") : (brand?.name || "Digifly");
  const linkClass = config.linkClass || "text-white hover:text-primary";

  const configKey = useMemo(() => {
    return [
      config.heightPx,
      config.logoWidthPx,
      config.linkClass,
      config.topBg.h, config.topBg.s, config.topBg.l, config.topBg.opacity,
      config.scrolledBg.h, config.scrolledBg.s, config.scrolledBg.l, config.scrolledBg.opacity,
    ].join("|");
  }, [config]);

  return (
    <div key={configKey} style={vars}>
      {isStickyActive && <div aria-hidden style={{ height: `var(--header-height)` }} />}
      <div
        data-header-wrap
        className={isStickyActive ? "fixed top-0 left-0 right-0 z-[60]" : ""}
        style={isStickyActive ? { background: "var(--bg-scrolled)" } : { background: 'var(--bg-top)' }}
      >
        <Header
          brand={brand}
          logoUrl={logoUrl || "/digifly-logo-dark.svg"}
          logoAlt={logoAlt}
          settings={settings}
          navLinks={navLinks}
          linkClass={linkClass}
          heightPx={config.heightPx}
          logoWidthPx={config.logoWidthPx}
          sticky={!!config.sticky}
        />
      </div>

    </div>
  );
}

