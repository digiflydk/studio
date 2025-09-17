"use client";

import { useEffect, useRef } from "react";

type NavLink = { label: string; href: string };

export default function MobileDrawer({
  open,
  onClose,
  navLinks,
  title = "Menu",
}: {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  title?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock scroll + focus management
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = "hidden";

      // Fokusér første link når panel er animeret ind
      const t = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 150);

      return () => {
        html.style.overflow = prevOverflow;
        clearTimeout(t);
        previouslyFocused.current?.focus?.();
      };
    }
  }, [open]);

  // ESC luk
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-y-0 right-0 w-[85%] max-w-[360px] bg-background border-l shadow-xl
        transition-transform duration-200 will-change-transform
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-medium">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 hover:bg-muted"
            aria-label="Luk menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav className="px-2 py-2">
          <ul className="flex flex-col">
            {navLinks?.length ? (
              navLinks.map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    className="block rounded px-3 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={onClose}
                  >
                    {l.label}
                  </a>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">Ingen links</li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
