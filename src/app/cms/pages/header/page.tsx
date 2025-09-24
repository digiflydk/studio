import CmsLayout from "@/app/cms/layout";
import { getCmsHeaderDoc } from "@/services/cmsHeader";

function toInitial(loaded: any) {
  if (!loaded) return null;
  if (loaded.appearance) return loaded.appearance;
  return loaded;
}

export default async function CmsHeaderPage() {
  const loaded = await getCmsHeaderDoc();
  const initial = toInitial(loaded);
  return (
    <CmsLayout>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Header</h1>
        <div data-testid="header-initial-json" className="mb-6 rounded border p-4 text-sm">
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(initial ?? {}, null, 2)}</pre>
        </div>
      </div>
    </CmsLayout>
  );
}
