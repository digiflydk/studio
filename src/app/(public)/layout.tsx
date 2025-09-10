
import { ReactNode } from 'react';
import Template from './template';
import { getGeneralSettings } from '@/services/settings';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();

  return (
      <Template settings={settings}>
        {children}
      </Template>
  );
}
