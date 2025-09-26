"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { WebsiteHeaderConfig } from "@/services/website.server";

// Valgfri fallback hvis logo mangler
const FALLBACK_LOGO = "/logo.svg";

function hslBg({ h, s, l, opacity }: { h: number; s: number; l: number; opacity: number }) {
  const a = Math.max(0, Math.min(1, opacity));
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

function hslBorder({ h, s, l, opacity }: { h: number; s: number; l: number; opacity?: number }) {
  const a = opacity == null ? 1 : Math.max(0, Math.min(1, opacity / 100));
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

type Props = { config: WebsiteHeaderConfig };

export default function HeaderClient({ config }: Props) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bg = scrolled ? config.bg.scrolled : config.bg.top;
  const headerStyle: React.CSSProperties = {
    background: hslBg(bg),
    borderBottom: config.border.enabled
      ? `${config.border.widthPx}px solid ${hslBorder(config.border.color)}`
      : undefined,
    height: config.heightPx,
  };

  const positionClass = config.overlay
    ? "absolute top-0 left-0 right-0"
    : config.sticky
    ? "sticky top-0"
    : "";

  const containerClass =
    "mx-auto w-full max-w-7xl px-4 md:px-6";

  const logoW = Math.max(24, Math.min(config.logoWidthPx ?? 150, 320));
  const logoH = Math.round(logoW * 0.27);

  const logoUrl = scrolled ? (config.logoScrolledUrl || config.logoUrl) : config.logoUrl;

  return (
    <div className={cn(positionClass, "z-50 w-full")} style={headerStyle}>
      <div className={containerClass}>
        <div
          className="flex items-center gap-4"
          style={{
            minHeight: config.heightPx,
          }}
        >
          <Link href="/" className="shrink-0" aria-label="Gå til forsiden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={config.logoAlt ?? "Logo"}
                width={logoW}
                height={logoH}
                priority
                style={{ width: "100%", maxWidth: logoW, height: "auto" }}
              />
            ) : (
              <span className="font-semibold">Brand</span>
            )}
          </Link>

          <div className="ml-auto flex items-center gap-6">
            <nav aria-label="Main" className="hidden md:block">
              <ul className={cn("flex items-center gap-6", config.linkClass ?? "")}>
                {config.navLinks?.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:opacity-80 transition-opacity text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {config.cta?.enabled && config.cta.href && config.cta.label ? (
              <Link
                href={config.cta.href}
                target={config.cta.href.startsWith("http") ? "_blank" : undefined}
                rel={config.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-foreground text-background hover:opacity-90 transition"
              >
                {config.cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
