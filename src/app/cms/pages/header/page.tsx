import { getCmsHeader } from "@/services/website.server";
import CmsHeaderForm from "@/components/cms/CmsHeaderForm";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";
import FirestoreProbeClient from "../../debug/FirestoreProbeClient";

export const dynamic = "force-dynamic";

export default async function CmsHeaderPage() {
  const header = (await getCmsHeader()) as CmsHeaderDoc | null;

  // Fallback hvis dokument ikke findes
  const initial: CmsHeaderDoc =
    header ?? {
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Header Settings</h1>
          <p className="text-muted-foreground mb-6">Manage the appearance and content of the website header.</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-background">
            <h2 className="text-lg font-semibold mb-2">Firestore Client Probe</h2>
            <p className="text-sm text-muted-foreground mb-4">This panel shows the result of a direct client-side read from Firestore to debug connection or permission issues.</p>
            <FirestoreProbeClient />
        </div>

        <CmsHeaderForm initial={initial} />
      </div>
    </div>
  );
}
