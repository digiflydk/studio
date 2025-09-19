
import PublicLayout from './(public)/layout';
import { getGeneralSettings } from '@/services/settings';
import Home from './(public)/page';

export default async function Page() {
  const settings = await getGeneralSettings();

  return (
    <PublicLayout settings={settings}>
      <Home />
    </PublicLayout>
  );
}
