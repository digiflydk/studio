
import { Linkedin, Facebook, Instagram, Twitter, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { getGeneralSettings } from '@/services/settings';

const socialIcons = {
  linkedinUrl: { icon: Linkedin, label: 'LinkedIn' },
  facebookUrl: { icon: Facebook, label: 'Facebook' },
  instagramUrl: { icon: Instagram, label: 'Instagram' },
  twitterUrl: { icon: Twitter, label: 'X/Twitter' },
  tiktokUrl: { icon: Clapperboard, label: 'TikTok' },
} as const;

export default async function Footer() {
  const settings = await getGeneralSettings();

  const fullAddress = [settings?.streetAddress, settings?.postalCode, settings?.city].filter(Boolean).join(', ');
  const fullPhoneNumber = settings?.countryCode && settings.phoneNumber ? `${settings.countryCode} ${settings.phoneNumber}` : settings?.phoneNumber;
  
  const socialLinks = Object.entries(socialIcons)
    .map(([key, { icon, label }]) => {
      const url = settings?.[key as keyof typeof settings];
      if (typeof url === 'string' && url) {
        return { url, icon: icon, label };
      }
      return null;
    })
    .filter((link): link is { url: string; icon: React.ElementType; label: string } => link !== null);

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
             {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <Link key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {settings?.companyName || 'Digifly'}. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
