export async function getCmsHeaderClient() {
  const res = await fetch("/api/cms/header", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load CMS header");
  const json = await res.json();
  return json.data ?? null;
}
