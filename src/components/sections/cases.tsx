'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getGeneralSettings, type Case, GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';


const defaultCases: Case[] = [
  {
    title: 'Automatiseret Fakturering',
    description: 'Udvikling af et system der sparede en mellemstor virksomhed for 20+ timer i manuelt tastearbejde om ugen.',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    link: '#',
    aiHint: 'invoice automation',
  },
  {
    title: 'Dynamisk Prissætnings-AI',
    description: 'En AI-model for en webshop der optimerede priser i realtid og øgede overskuddet med 12%.',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    link: '#',
    aiHint: 'pricing algorithm',
  },
  {
    title: 'Skalerbar Cloud Platform',
    description: 'Migration til en moderne cloud-arkitektur, der håndterede en 10x stigning i trafik uden problemer.',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    link: '#',
    aiHint: 'cloud platform',
  },
];

function CasesSectionContent() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettings().then(setSettings);
  }, []);

  const cases = settings?.cases && settings.cases.length > 0 ? settings.cases : defaultCases;
  const title = settings?.casesSectionTitle || "Vores Arbejde";
  const description = settings?.casesSectionDescription || "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.";

  const titleStyle: React.CSSProperties = {
    fontSize: settings?.casesSectionTitleSize ? `${settings.casesSectionTitleSize}px` : undefined,
  };
  const descriptionStyle: React.CSSProperties = {
    fontSize: settings?.casesSectionDescriptionSize ? `${settings.casesSectionDescriptionSize}px` : undefined,
  };

  return (
    <section id="cases" className="bg-background">
       <style>
        {`
          @media (max-width: 767px) {
            #cases {
              padding-top: ${settings?.sectionPadding?.cases?.topMobile ?? 64}px !important;
              padding-bottom: ${settings?.sectionPadding?.cases?.bottomMobile ?? 64}px !important;
            }
          }
           @media (min-width: 768px) {
            #cases {
              padding-top: ${settings?.sectionPadding?.cases?.top ?? 96}px !important;
              padding-bottom: ${settings?.sectionPadding?.cases?.bottom ?? 96}px !important;
            }
          }
        `}
      </style>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
           <h2 
            className={cn("text-h2 font-bold tracking-tight", settings?.casesSectionTitleColor || "text-black")}
            style={titleStyle}
          >
            {title}
          </h2>
          <p 
            className={cn("mt-4 max-w-2xl mx-auto text-body", settings?.casesSectionDescriptionColor || "text-muted-foreground")}
            style={descriptionStyle}
          >
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.title} className="flex flex-col overflow-hidden">
              <CardHeader>
                <div className="relative w-full h-48">
                  <Image
                    src={caseStudy.imageUrl}
                    alt={caseStudy.title}
                    data-ai-hint={caseStudy.aiHint}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="mb-2">{caseStudy.title}</CardTitle>
                <CardDescription>{caseStudy.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Link href={caseStudy.link} className={cn(buttonVariants({ variant: 'link' }), 'pl-0')}>
                    Læs mere
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CasesSection() {
    return <CasesSectionContent />;
}
