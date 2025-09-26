
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { WebsiteHeaderConfig } from "@/services/website.server";

/**
 * Forventet shape i WebsiteHeaderConfig:
 * - heightPx?: number
 * - logoUrl?: string
 * - logoAlt?: string
 * - logoWidthPx?: number
 * - navLinks?: { label: string; href: string }[]
 * - cta?: { enabled?: boolean; label?: string; href?: string }
 */
type Props = { config: WebsiteHeaderConfig };

export default function HeaderClient({ config }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const height = config.heightPx ?? 80;
  const logoW = config.logoWidthPx ?? 150;
  const logoH = Math.round(logoW * 0.27); // vandret logo, sikrer width+height-props

  const wrapperClass = cn(
    // sticky + overlay ovenpå hero
    "sticky top-0 z-50",
    // light bg + blur når man scroller
    scrolled
      ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      : "bg-white/90",
    // tynd bundkant
    "border-b border-black/10"
  );

  return (
    <div className={wrapperClass}>
      {/* HØJDE sættes på en almindelig div (så TS ikke brokker sig over style-prop) */}
      <div className="site-container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" style={{ height }}>
        <div className="h-full flex items-center justify-between gap-6">
          {/* Logo venstre */}
          <Link href="/" aria-label="Til forsiden" className="shrink-0 flex items-center">
            <Image
              src={config.logoUrl ?? "/logo.svg"}
              alt={config.logoAlt ?? "Digifly"}
              width={logoW}
              height={logoH}
              priority
              // CSS for at undgå Next/Image advarsel:
              style={{ height: "auto", width: "100%", maxWidth: logoW }}
            />
          </Link>

          {/* Navigation højre — inden for samme container-bredde */}
          <nav className="ml-auto hidden md:block">
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
        </div>
      </div>
    </div>
  );
}
