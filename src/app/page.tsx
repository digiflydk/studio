export const dynamic = "force-dynamic";
export const revalidate = 0;

import PublicHomePage from "./(public)/page";
import PublicLayout from "./(public)/layout";

export default function Root() {
  return (
    <PublicLayout>
      <PublicHomePage />
    </PublicLayout>
  );
}
