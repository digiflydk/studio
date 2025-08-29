
import { Linkedin, Facebook, Instagram, Twitter, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { getGeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';

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

  const footerStyle: React.CSSProperties = {};
  if (settings?.footerBackgroundColor) {
    const { h, s, l } = settings.footerBackgroundColor;
    footerStyle.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  const companyNameStyle: React.CSSProperties = {
    fontSize: settings?.footerCompanyNameSize ? `${settings.footerCompanyNameSize}px` : undefined,
  };
  const addressStyle: React.CSSProperties = {
     fontSize: settings?.footerAddressSize ? `${settings.footerAddressSize}px` : undefined,
  };
   const contactStyle: React.CSSProperties = {
     fontSize: settings?.footerContactSize ? `${settings.footerContactSize}px` : undefined,
  };

  const currentYear = new Date().getFullYear();
  const companyName = settings?.companyName || 'Digifly';

  const defaultTextColorClass = settings?.footerBackgroundColor && settings.footerBackgroundColor.l < 50 ? "text-white" : "text-secondary-foreground";
  const mutedTextColorClass = settings?.footerBackgroundColor && settings.footerBackgroundColor.l < 50 ? "text-gray-300" : "text-muted-foreground";

  return (
    <footer style={footerStyle} className={cn(defaultTextColorClass)}>
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <Logo 
                logoUrl={settings?.logoUrl} 
                logoAlt={settings?.logoAlt} 
                width={settings?.footerLogoWidth || 96}
                isDark={settings?.footerBackgroundColor && settings.footerBackgroundColor.l < 50}
            />
            <p className={cn("mt-2 text-sm", mutedTextColorClass)}>{settings?.footerTagline || 'Flow. Automatisér. Skalér.'}</p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
             <div className="space-y-1">
                {settings?.companyName && <p className={cn("font-semibold", settings.footerCompanyNameColor)} style={companyNameStyle}>{settings.companyName}</p>}
                {fullAddress && <p className={cn(settings.footerAddressColor)} style={addressStyle}>{fullAddress}</p>}
             </div>
            <div className={cn("flex items-center gap-4", settings.footerContactColor)} style={contactStyle}>
              {settings?.cvr && <span>CVR: {settings.cvr}</span>}
              {settings?.businessEmail && (
                 <Link href={`mailto:${settings.businessEmail}`} className="hover:text-primary transition-colors">{settings.businessEmail}</Link>
              )}
               {fullPhoneNumber && (
                  <Link href={`tel:${fullPhoneNumber.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                    Tlf: {fullPhoneNumber}
                  </Link>
                )}
            </div>
             {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <Link key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className={cn("h-6 w-6 hover:text-primary transition-colors", mutedTextColorClass)} />
                  </Link>
                ))}
              </div>
            )}
            <p className={cn("text-xs", mutedTextColorClass)}>&copy; {currentYear} {companyName}. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
