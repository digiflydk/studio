"use client";

import React, { useEffect, useRef } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import IconButton from "@/components/ui/IconButton";

type NavLink = { label: string; href: string };

type CTA =
  | {
      enabled: boolean;
      label: string;
      href: string;
      size?: "sm" | "md" | "lg";
      variant?: "default" | "pill" | "outline";
      linkType?: "external" | "internal";
    }
  | undefined;

export default function MobileMenu({
  open,
  onClose,
  links,
  cta,
  headerLinkColor = "text-black",
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  cta?: CTA;
  headerLinkColor?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Klik udenfor lukker
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "fixed right-0 top-0 z-[61] h-dvh w-[84%] max-w-[360px] bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
        ref={panelRef}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-sm font-medium">Menu</span>
          <IconButton aria-label="Luk menu" onClick={onClose}>
            ✕
          </IconButton>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {links?.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn("block py-3 text-base font-medium", headerLinkColor)}
                  onClick={onClose}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {cta?.enabled && cta.label && cta.href ? (
            <div className="pt-4">
              <Link
                href={cta.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold w-full",
                  cta.variant === "outline"
                    ? "border border-neutral-300"
                    : "bg-black text-white"
                )}
                onClick={onClose}
              >
                {cta.label}
              </Link>
            </div>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
