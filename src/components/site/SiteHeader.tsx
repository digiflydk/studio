"use client";

import Link from "next/link";
import Image from "next/image";

type Nav = { label: string; href: string };

export default function SiteHeader({
  logoUrl = "/digifly-logo-dark.svg",
  logoAlt = "Digifly",
  logoWidth = 120,
  height = 80,
  navLinks = [],
  linkClass = "text-black hover:text-gray-700",
}: {
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  height?: number;
  navLinks?: Nav[];
  linkClass?: string;
}) {
  return (
    <header className="w-full border-b border-black/10 sticky top-0 z-50" style={{ height }}>
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Gå til forsiden">
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={logoWidth}
            height={Math.round(logoWidth / 3)}
            priority
            style={{ height: "auto" }}
          />
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${linkClass}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
