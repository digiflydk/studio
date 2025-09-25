
import { loadHeaderAction } from "./actions";
import CmsHeaderForm from "@/components/cms/CmsHeaderForm";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";

export const dynamic = "force-dynamic";

export default async function CmsHeaderPage() {
  const doc = (await loadHeaderAction()) as CmsHeaderDoc | null;

  // Fallback hvis dokument ikke findes
  const initial: CmsHeaderDoc =
    doc ?? {
      version: 1,
      appearance: {
        headerHeight: 80,
        headerIsSticky: true,
        headerLinkColor: "black",
        isOverlay: false,
        headerLogoWidth: 150,
        logo: { src: "", alt: "Logo", maxWidth: 150 },
        topBg: { h: 0, s: 0, l: 100, opacity: 1 },
        scrolledBg: { h: 0, s: 0, l: 100, opacity: 1 },
        border: {
          enabled: true,
          widthPx: 1,
          colorHex: "#E5E7EB",
          color: { h: 220, s: 13, l: 91, opacity: 100 },
        },
        navLinks: [],
      },
    };

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Header Settings</h1>
        <p className="text-muted-foreground mb-6">Manage the appearance and content of the website header.</p>
        <CmsHeaderForm initial={initial} />
      </div>
    </div>
  );
}
