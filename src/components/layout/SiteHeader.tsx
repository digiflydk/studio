
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

type NavLink = { label: string; href: string };
type Hsl = { h: number; s: number; l: number; opacity?: number };
type HeaderBg = { initial?: Hsl; scrolled?: Hsl };
type HeaderLogo = { src?: string; alt?: string; maxWidth?: number };

export type WebsiteHeaderConfig = {
  heightPx?: number;
  sticky: boolean;
  overlay: boolean;
  linkColor: string;
  navLinks: NavLink[];
  logo: HeaderLogo;
  bg?: HeaderBg;
  border?: { enabled?: boolean; widthPx?: number; colorHex?: string; color?: { h: number; s: number; l: number } };
  cta?: {
    enabled: boolean;
    label: string;
    href: string;
    variant?: "default" | "pill" | "outline";
    size?: "sm" | "md" | "lg";
  };
};

function hslToCss({ h = 0, s = 0, l = 100, opacity = 1 }: Partial<Hsl>) {
  return `hsla(${h} ${s}% ${l}% / ${opacity})`;
}

function ctaClass(variant: string | undefined) {
  if (variant === "outline") return "border border-primary text-primary bg-transparent";
  if (variant === "pill") return "bg-primary text-white";
  return "bg-gray-900 text-white";
}

function ctaPadding(size: string | undefined) {
  if (size === "sm") return "px-4 py-2 text-sm";
  if (size === "lg") return "px-6 py-3 text-base";
  return "px-5 py-2.5 text-sm";
}

export default function SiteHeader({
  config,
  scrolled,
}: {
  config: WebsiteHeaderConfig;
  scrolled: boolean;
}) {
  const bg = useMemo(
    () => (scrolled ? config.bg?.scrolled : config.bg?.initial) ?? {},
    [config.bg, scrolled]
  );

  const heightStyle: React.CSSProperties = { height: config.heightPx };
  const borderColor = config.border?.colorHex ?? hslToCss(config.border?.color ?? {});

  return (
    <header
      className={`${config.sticky ? "sticky top-0 z-50" : ""} w-full backdrop-blur-md`}
      style={{
        background: hslToCss(bg),
        borderBottom: config.border?.enabled ? `${config.border.widthPx}px solid ${borderColor}` : "none",
       }}
    >
      <div
        className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6"
        style={heightStyle}
      >
        <Link href="/" className="flex items-center">
          {config.logo?.src ? (
            <Image
              src={config.logo.src}
              alt={config.logo.alt ?? "Logo"}
              width={config.logo.maxWidth ?? 150}
              height={Math.round((config.logo.maxWidth ?? 150) * 0.27)}
              priority
              style={{ width: "100%", height: "auto", maxWidth: config.logo.maxWidth ?? 150 }}
            />
          ) : (
            <span className="font-semibold">{config.logo?.alt ?? "Digifly"}</span>
          )}
        </Link>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {config.navLinks?.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="font-medium transition-colors hover:opacity-80"
            >
              {item.label}
            </Link>
          ))}

          {config.cta?.enabled && (
            <Link
              href={config.cta.href}
              className={`rounded-full font-medium shadow-sm transition ${ctaClass(
                config.cta.variant
              )} ${ctaPadding(config.cta.size)}`}
            >
              {config.cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
