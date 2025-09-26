// src/app/cms/pages/header/page.tsx
// Server Component: ingen Firestore her!
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";
import FirestoreProbe from "@/components/cms/FirestoreProbeClient";

export const dynamic = "force-dynamic";

export default async function CmsHeaderPage() {
  // Evt. server-side fetch af CMS data, hold det simpelt eller tomt
  const data: Partial<CmsHeaderDoc> = {};
  return (
    <>
      <h1>Header Settings</h1>
      <section className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 text-lg font-semibold">Firestore Client Probe</h3>
        <p className="mb-3 text-sm">
          Dette viser resultatet af et direkte read fra Firestore i browseren.
        </p>
        <FirestoreProbe />
      </section>
    </>
  );
}
