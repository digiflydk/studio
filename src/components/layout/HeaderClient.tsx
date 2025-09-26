"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };
type HeaderCTA = {
  enabled?: boolean;
  label?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pill" | "outline";
};

export type WebsiteHeaderConfig = {
  heightPx?: number;
  sticky?: boolean;
  overlay?: boolean;
  linkColor?: "black" | "white";
  logoUrl?: string;
  logoAlt?: string;
  logoMaxWidth?: number;
  logoScrolledUrl?: string;
  navLinks?: NavLink[];
  border?: { enabled?: boolean; widthPx?: number; color?: { h: number; s: number; l: number } };
  topBg?: { h: number; s: number; l: number; opacity?: number };
  scrolledBg?: { h: number; s: number; l: number; opacity?: number };
  cta?: HeaderCTA;
};

function hslCss({ h, s, l, opacity }: { h: number; s: number; l: number; opacity?: number }) {
  const a = typeof opacity === "number" ? opacity : 1;
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

export default function HeaderClient({ config }: { config: WebsiteHeaderConfig }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const height = config.heightPx ?? 80;
  const stickyCls = config.sticky ? "sticky top-0 z-50" : "";
  const borderWidth = config.border?.widthPx ?? 1;
  const borderColor = config.border?.color ? hslCss({ ...config.border.color, opacity: 1 }) : "rgba(0,0,0,0.08)";

  const bg = scrolled ? config.scrolledBg ?? config.topBg : config.topBg;
  const bgStyle =
    bg ? { backgroundColor: hslCss(bg) } : config.overlay ? { backgroundColor: "transparent" } : { backgroundColor: "white" };

  const linkBase =
    config.linkColor === "white" ? "text-white hover:text-white/80" : "text-slate-800 hover:text-slate-950";

  const LOGO_W = config.logoMaxWidth ?? 150;
  const LOGO_H = Math.max(1, Math.round(LOGO_W * 0.27)); // ratio-sikker

  const logoSrc = scrolled ? config.logoScrolledUrl || config.logoUrl : config.logoUrl;


  return (
    <header
      className={`${stickyCls}`}
      style={{
        borderBottom: config.border?.enabled ? `${borderWidth}px solid ${borderColor}` : undefined,
      }}
    >
      <div className="w-full backdrop-blur-md" style={bgStyle}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ height }}>
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <Link href="/" aria-label="Forside" className="shrink-0 flex items-center gap-3">
              <Image
                src={logoSrc ?? "/logo.svg"}
                alt={config.logoAlt ?? "Logo"}
                width={LOGO_W}
                height={LOGO_H}
                priority
                style={{ width: "100%", maxWidth: LOGO_W, height: "auto" }}
              />
            </Link>

            {/* Nav + CTA */}
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-8">
                {(config.navLinks ?? []).map((l) => (
                  <Link
                    key={`${l.href}|${l.label}`}
                    href={l.href}
                    className={`${linkBase} text-sm font-medium relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all hover:after:w-full`}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {config.cta?.enabled && config.cta?.href && config.cta?.label && (
                <Link
                  href={config.cta.href}
                  className={`inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-semibold transition
                  ${
                    config.cta.variant === "outline"
                      ? "bg-transparent text-slate-900 border-slate-300 hover:bg-slate-50"
                      : config.cta.variant === "pill"
                      ? "bg-slate-900 text-white hover:bg-slate-800 rounded-full"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {config.cta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
