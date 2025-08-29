import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { getGeneralSettings } from '@/services/settings';

export default async function Footer() {
  const settings = await getGeneralSettings();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <Logo logoUrl={settings?.logoUrl} logoAlt={settings?.logoAlt} />
            <p className="mt-2 text-sm text-muted-foreground">Flow. Automatisér. Skalér.</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
            <div className="flex items-center gap-4">
              {settings?.cvr && <span className="text-sm">CVR: {settings.cvr}</span>}
              {settings?.businessEmail && (
                 <Link href={`mailto:${settings.businessEmail}`} className="text-sm hover:text-primary transition-colors">{settings.businessEmail}</Link>
              )}
            </div>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {settings?.companyName || 'Digifly'}. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
