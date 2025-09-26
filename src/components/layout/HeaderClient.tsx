"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { WebsiteHeaderConfig } from "@/services/website.server";
import HeaderCTA from "../common/HeaderCTA";
import { Menu } from "lucide-react";
import MobileDrawer from "../site/MobileDrawer";
import SiteContainer from "../ui/SiteContainer";

// Valgfri fallback hvis logo mangler
const FALLBACK_LOGO = "/logo.svg";

type Props = {
  config: WebsiteHeaderConfig;
};

function hsla(bg: WebsiteHeaderConfig['topBg']) {
  if (!bg) return 'transparent';
  return `hsla(${bg.h} ${bg.s}% ${bg.l}% / ${bg.opacity})`;
}

export default function HeaderClient({ config }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bg = scrolled ? config.scrolledBg : config.topBg;
  const logoUrl = scrolled
    ? (config as any)?.logoScrolledUrl || config.logoUrl || FALLBACK_LOGO
    : config.logoUrl || FALLBACK_LOGO;

  const logoW = config.logoWidthPx ?? 150;
  const logoH = Math.round(logoW * 0.27); // bevar aspektforhold

  return (
    <>
      <header
        className={[
          "w-full border-b",
          config.sticky ? "sticky top-0 z-50" : "",
          scrolled ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60" : "bg-transparent",
        ].join(" ")}
        style={{ 
          height: config.heightPx,
          borderColor: scrolled ? (config.border?.colorHex ?? 'transparent') : 'transparent',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <SiteContainer className="flex h-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0" aria-label="Digifly – Forside">
              <Image
                src={logoUrl}
                alt={config.logoAlt ?? "Digifly"}
                width={logoW}
                height={logoH}
                priority
                style={{ height: "auto", width: "auto", maxWidth: logoW }}
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {(config.navLinks ?? []).map((l) => (
                <Link
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  className={config.linkClass ?? "text-sm font-medium text-foreground hover:opacity-80"}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
                <HeaderCTA />
            </div>
             <button className="md:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                <Menu className={config.linkClass}/>
            </button>
        </SiteContainer>
      </header>
      <MobileDrawer 
         open={isMobileMenuOpen}
         onClose={() => setMobileMenuOpen(false)}
         navLinks={config.navLinks}
         title="Navigation"
       />
    </>
  );
}
