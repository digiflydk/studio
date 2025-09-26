// src/app/cms/pages/header/page.tsx
// Server Component: ingen Firestore her!
import HeaderEditorClient from "./HeaderEditorClient";

export const dynamic = "force-dynamic"; // valgfrit, hvis nødvendigt for SSR

export default function CmsHeaderPage() {
  return (
    <>
      <h1>Header Settings</h1>
      <HeaderEditorClient />
    </>
  );
}
