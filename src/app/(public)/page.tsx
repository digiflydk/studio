
import { getAdminHome } from "@/services/admin.server";
import Hero from "@/components/sections/Hero";

export default async function HomePage() {
  const home = await getAdminHome();
  if (!home?.hero?.enabled) return null;

  return (
      <main>
        <Hero hero={home.hero} />
      </main>
  );
}
