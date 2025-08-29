
'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getGeneralSettings, type Service, GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const defaultServices: Service[] = [
  {
    title: 'Digital Strategi',
    description: 'Vi lægger en køreplan for jeres digitale transformation med fokus på ROI og forretningsmål.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    aiHint: 'strategy business',
  },
  {
    title: 'Softwareudvikling',
    description: 'Skræddersyede softwareløsninger, fra web-apps til komplekse systemintegrationer.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    aiHint: 'software development',
  },
  {
    title: 'AI & Automatisering',
    description: 'Implementering af kunstig intelligens og automatisering for at optimere jeres workflows.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    aiHint: 'artificial intelligence',
  },
  {
    title: 'Cloud Løsninger',
    description: 'Sikker og skalerbar cloud-infrastruktur, der understøtter jeres vækstambitioner.',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    aiHint: 'cloud infrastructure',
  },
];

function ServicesSectionContent() {
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettings().then(setSettings);
  }, []);

  const services = settings?.services && settings.services.length > 0 ? settings.services : defaultServices;
  const title = settings?.servicesSectionTitle || "Vores Services";
  const description = settings?.servicesSectionDescription || "Vi tilbyder en bred vifte af ydelser for at accelerere jeres digitale rejse.";

  const titleStyle: React.CSSProperties = {
    fontSize: settings?.servicesSectionTitleSize ? `${settings.servicesSectionTitleSize}px` : undefined,
  };
  const descriptionStyle: React.CSSProperties = {
    fontSize: settings?.servicesSectionDescriptionSize ? `${settings.servicesSectionDescriptionSize}px` : undefined,
  };

  const sectionStyle: React.CSSProperties = {};
  if (settings?.sectionPadding?.services) {
    const padding = settings.sectionPadding.services;
    sectionStyle.paddingTop = `${isMobile ? padding.topMobile : padding.top}px`;
    sectionStyle.paddingBottom = `${isMobile ? padding.bottomMobile : padding.bottom}px`;
  }

  return (
    <section id="services" className="bg-secondary" style={sectionStyle}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 
            className={cn("text-h2 font-bold tracking-tight", settings?.servicesSectionTitleColor || "text-black")}
            style={titleStyle}
          >
            {title}
          </h2>
          <p 
            className={cn("mt-4 max-w-2xl mx-auto text-body", settings?.servicesSectionDescriptionColor || "text-muted-foreground")}
            style={descriptionStyle}
          >
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    data-ai-hint={service.aiHint}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardTitle className="text-h4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesSection() {
    return <ServicesSectionContent />;
}
