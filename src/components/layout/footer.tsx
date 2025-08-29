import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { getGeneralSettings } from '@/services/settings';

export default async function Footer() {
  const settings = await getGeneralSettings();

  const fullAddress = [settings?.streetAddress, settings?.postalCode, settings?.city].filter(Boolean).join(', ');
  const fullPhoneNumber = settings?.countryCode && settings.phoneNumber ? `${settings.countryCode} ${settings.phoneNumber}` : settings?.phoneNumber;


  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <Logo logoUrl={settings?.logoUrl} logoAlt={settings?.logoAlt} />
            <p className="mt-2 text-sm text-muted-foreground">Flow. Automatisér. Skalér.</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
             <div className="space-y-1 text-sm">
                {settings?.companyName && <p className="font-semibold">{settings.companyName}</p>}
                {fullAddress && <p className="text-muted-foreground">{fullAddress}</p>}
                 {fullPhoneNumber && (
                  <Link href={`tel:${fullPhoneNumber.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                    Tlf: {fullPhoneNumber}
                  </Link>
                )}
             </div>
            <div className="flex items-center gap-4 text-sm">
              {settings?.cvr && <span>CVR: {settings.cvr}</span>}
              {settings?.businessEmail && (
                 <Link href={`mailto:${settings.businessEmail}`} className="hover:text-primary transition-colors">{settings.businessEmail}</Link>
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
