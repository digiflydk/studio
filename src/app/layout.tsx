
import './globals.css';
import '@/styles/design.css';
import { ReactNode } from 'react';
import { getGeneralSettings } from '@/lib/firestore/settings';
import { mapToCssVars } from '@/lib/design/mapToCssVars';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { ThemeProvider } from '@/context/ThemeContext';
import ScrollStateProvider from '@/components/providers/ScrollStateProvider';


export const metadata = { title: 'Digifly' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getGeneralSettings();
  const vars = mapToCssVars(settings);
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
