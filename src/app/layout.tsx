
import './globals.css';
import '@/styles/design.css';
import { ReactNode } from 'react';
import { getGeneralSettings } from '@/services/settings';
import { mapToCssVars } from '@/lib/design/mapToCssVars';
import ScrollStateProvider from '@/components/providers/ScrollStateProvider';


export const metadata = { title: 'Digifly' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getGeneralSettings();
  const vars = mapToCssVars(settings || {});
  const css = Object.entries(vars).map(([k,v]) => `${k}:${v}`).join(';');

  return (
    <html lang="da">
      <head>
        <style id="design-vars">{`:root{${css}}`}</style>
      </head>
      <body>
        <ScrollStateProvider />
        {children}
      </body>
    </html>
  );
}

