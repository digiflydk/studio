
import { getAdminHome } from "@/services/admin.server";
import Hero from "@/components/sections/Hero";
import Link from 'next/link';

export default async function HomePage() {
  const home = await getAdminHome();

  return (
    <main>
      {home?.hero?.enabled ? (
        <Hero hero={home.hero} />
      ) : (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-xl font-semibold mb-2">Hero disabled/empty</h2>
          <p className="text-gray-600">
            Åbn <Link href="/api/admin/home" className="underline">/api/admin/home</Link> i en ny fane og verificér at data returneres.
            Se også <code>admin/pages/home/home</code> i Firestore.
          </p>
        </section>
      )}
    </main>
  );
}
