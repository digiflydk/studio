"use client";
import Link from "next/link";
import Image from "next/image";
import type { Brand, GeneralSettings, NavLink } from "@/types/settings";
import { cn } from "@/lib/utils";

export function Header({
  brand,
  logoUrl,
  logoAlt,
  settings,
  navLinks,
  linkClass,
  heightPx,
  logoWidthPx,
  sticky,
}: {
  brand?: Brand;
  logoUrl?: string | null;
  logoAlt?: string;
  settings: GeneralSettings | null;
  navLinks: NavLink[];
  linkClass?: string;
  heightPx?: number;
  logoWidthPx?: number;
  sticky?: boolean;
}) {
  const h = Math.max(56, heightPx ?? 80);
  const w = Math.max(80, logoWidthPx ?? 120);
  const finalLinkClass = linkClass || "text-white hover:text-primary";

  return (
    <header
      data-header
      className={cn("w-full border-b border-transparent", sticky && "backdrop-blur")}
      style={{ height: h }}
    >
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoUrl || brand?.logoUrl || "/digifly-logo-dark.svg"}
            alt={logoAlt || brand?.name || "Digifly"}
            width={w}
            height={Math.round(w / 3)}
            priority
            className="object-contain"
          />
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={cn("text-sm font-medium transition-colors", finalLinkClass)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
