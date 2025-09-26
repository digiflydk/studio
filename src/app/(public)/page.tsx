
import { getAdminHome } from "@/services/admin.server";
import Hero from "@/components/sections/Hero";

export default async function HomePage() {
  const home = await getAdminHome();

  return (
      <>
        {home?.hero?.enabled ? (
            <Hero home={home} />
        ) : (
            <section className="container py-20">
            <h1 className="text-4xl font-bold">Flow. Automatisér. Skalér.</h1>
            <p className="mt-4 text-lg">Vi hjælper virksomheder med at bygge skalerbare digitale løsninger…</p>
            </section>
        )}
      </>
  );
}
