"use client";
import type { Brand } from "@/types/settings";

export default function FooterClient({ brand, theme }: { brand: Brand; theme?: any }) {
  return (
    <footer className="w-full" style={{ backgroundColor: "var(--of-footer-bg)", color: "var(--of-footer-text)" }}>
      <div className="mx-auto max-w-[1140px] px-4 py-6 text-sm flex items-center justify-between">
        <span>{brand.name}</span>
        <span>Powered by Digifly</span>
      </div>
    </footer>
  );
}
