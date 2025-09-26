"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { WebsiteHeaderConfig } from "@/services/website.server";
import HeaderCTA from "../common/HeaderCTA";
import { Menu } from "lucide-react";
import MobileDrawer from "../site/MobileDrawer";
import SiteContainer from "../ui/SiteContainer";

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

  const logoUrl = scrolled
    ? config.logoScrolledUrl || config.logoUrl
    : config.logoUrl;

  const logoW = config.logoWidthPx ?? 150;
  const logoH = Math.round(logoW * 0.27); // bevar aspektforhold

  const wrapperClass = [
    "sticky top-0 z-50",
    scrolled
      ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      : "bg-white/90",
    "border-b border-black/10"
  ].join(" ");

  return (
    <>
    <div className={wrapperClass}>
      <div className="site-container" style={{ height: config.heightPx }}>
        <div className="h-full flex items-center justify-between gap-6">
          <Link href="/" aria-label="Til forsiden" className="shrink-0 flex items-center">
            <Image
              src={logoUrl ?? "/logo.svg"}
              alt={config.logoAlt ?? "Digifly"}
              width={logoW}
              height={logoH}
              priority
              style={{ height: "auto", width: "100%", maxWidth: logoW }}
            />
          </Link>

          <nav className="hidden md:flex ml-auto">
             <ul className="flex items-center gap-6 text-[15px]">
              {(config.navLinks ?? []).map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("/") || l.href.startsWith("#") ? (
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="hover:underline" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
              {config.cta?.enabled && (
                <li>
                  <a
                    href={config.cta.href ?? "#"}
                    className="inline-flex items-center rounded-full px-4 py-2 border border-black/10 hover:border-black/30 transition"
                  >
                    {config.cta.label ?? "Kontakt"}
                  </a>
                </li>
              )}
            </ul>
          </nav>
            
             <button className="md:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
                <Menu className={config.linkClass}/>
            </button>
        </div>
      </div>
    </div>
     <MobileDrawer 
         open={isMobileMenuOpen}
         onClose={() => setMobileMenuOpen(false)}
         navLinks={config.navLinks}
         title="Navigation"
       />
    </>
  );
}
