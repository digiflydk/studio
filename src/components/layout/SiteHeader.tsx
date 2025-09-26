
import Image from "next/image";
import Link from "next/link";
import { getAdminHeader } from "@/services/admin.server";

export default async function SiteHeader() {
  const header = await getAdminHeader();
  if (!header) return null;

  const { logo, nav, cta, height, sticky, overlay, linkColor, border, bg } = header;

  return (
    <header
      className={[
        sticky ? "sticky top-0 z-50" : "",
        overlay ? "backdrop-blur" : "",
        "w-full"
      ].join(" ")}
      style={{
        borderBottom: border?.enabled ? `${border.widthPx ?? 1}px solid ${border.colorHex ?? "#000"}` : "none",
        backgroundColor: `hsla(${bg?.initial?.h ?? 0} ${bg?.initial?.s ?? 0}% ${bg?.initial?.l ?? 100}% / ${bg?.initial?.opacity ?? 1})`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6" style={{ height }}>
        <div className="h-full flex items-center justify-between gap-6">
          <Link href="/" aria-label="Forside" className="flex items-center">
            {logo?.src ? (
              <Image
                src={logo.src}
                alt={logo?.alt || "Digifly"}
                width={logo?.maxWidth ?? 150}
                height={Math.round((logo?.maxWidth ?? 150) * 0.27)}
                priority
                style={{ height: "auto", width: "100%", maxWidth: logo?.maxWidth ?? 150 }}
              />
            ) : (
              <span className="text-lg font-semibold">Digifly</span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {(nav ?? []).map((i) => (
              <Link
                key={`${i.label}-${i.href}`}
                href={i.href}
                className={linkColor === "white" ? "text-white" : "text-black"}
              >
                {i.label}
              </Link>
            ))}

            {cta?.enabled ? (
              <Link
                href={cta.href}
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-2 font-medium",
                  cta.variant === "pill" ? "bg-blue-600 text-white" :
                  cta.variant === "outline" ? "border border-current" : "bg-black text-white",
                  cta.size === "lg" ? "text-base" : cta.size === "sm" ? "text-sm" : "text-[15px]"
                ].join(" ")}
              >
                {cta.label}
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
