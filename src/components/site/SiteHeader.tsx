
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/site/MobileMenu";
import IconButton from "@/components/ui/IconButton";
import { getGeneralSettings } from "@/services/settings";
import { getHeaderAppearance } from "@/lib/server/header";

export default function SiteHeader({ appearance, settings }: { appearance: any, settings: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 1) Primært fra settings/general
  const sgLogo = settings?.logoUrl as string | undefined;
  const sgLogoScrolled = settings?.logoScrolledUrl as string | undefined;
  const sgAlt = settings?.logoAlt ?? "Logo";

  // 2) Fallback fra cms/pages/header
  const cmsLogo = appearance?.logo?.src || appearance?.logoUrl;
  const cmsAlt = appearance?.logo?.alt || settings?.logoAlt || "Logo";

  const chosenLogo = scrolled
    ? sgLogoScrolled || sgLogo || cmsLogo
    : sgLogo || cmsLogo;
  
  const navLinks = appearance?.navLinks ?? [];
  const cta = appearance?.cta ?? undefined;
  const linkColor = appearance?.headerLinkColor === "white" ? "text-white" : "text-black";

  const maxW =
    appearance?.headerLogoWidth ??
    settings?.headerLogoWidth ??
    150;
  
  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="shrink-0 inline-flex items-center gap-2">
             {chosenLogo ? (
                <img src={chosenLogo} alt={sgAlt || cmsAlt} style={{ maxWidth: maxW, height: "auto" }} />
             ) : (
                <span className="text-base font-semibold">Logo</span>
             )}
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((l: any) => (
              <Link key={l.href} href={l.href} className={cn("text-sm font-medium", linkColor)}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA (desktop) + Burger (mobil) */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            {cta?.enabled && (
              <Link
                href={cta.href}
                className={cn(
                  "hidden lg:inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
                  cta.variant === "outline"
                    ? "border border-neutral-300"
                    : "bg-black text-white"
                )}
              >
                {cta.label}
              </Link>
            )}

            {/* Burger (mobil) */}
            <div className="lg:hidden">
              <IconButton
                aria-label="Åbn menu"
                onClick={() => setOpen(true)}
                className="border-neutral-300"
              >
                {/* simple burger */}
                <span aria-hidden>☰</span>
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        links={navLinks}
        cta={cta}
        headerLinkColor={linkColor}
      />
    </>
  );
}
