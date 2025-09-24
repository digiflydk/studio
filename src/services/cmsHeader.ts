export async function getCmsHeaderAppearance(): Promise<any | null> {
  const res = await fetch('/api/cms/pages/header/appearance', { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}
