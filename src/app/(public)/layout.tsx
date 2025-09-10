
import { ReactNode, Suspense } from 'react';
import Template from './template';
import { getGeneralSettings } from '@/services/settings';
import Header from '@/components/layout/header';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();
  const links = settings?.headerNavLinks ?? [];
  const logoUrl = settings?.logoUrl;
  const logoAlt = settings?.logoAlt;

  return (
    <>
      <Header links={links} logoUrl={logoUrl} logoAlt={logoAlt} />
      <Template settings={settings}>
        {children}
      </Template>
    </>
  );
}
