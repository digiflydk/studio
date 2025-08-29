
'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import type { Case, GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';

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

interface CasesSectionProps {
    cases: Case[] | undefined;
    sectionData: Partial<Pick<GeneralSettings, 'casesSectionTitle' | 'casesSectionDescription' | 'casesSectionTitleColor' | 'casesSectionTitleSize' | 'casesSectionDescriptionColor' | 'casesSectionDescriptionSize' | 'sectionPadding'>> | null
}

export default function CasesSection({ cases: propCases, sectionData }: CasesSectionProps) {
  const cases = propCases && propCases.length > 0 ? propCases : defaultCases;
  const title = sectionData?.casesSectionTitle || "Vores Arbejde";
  const description = sectionData?.casesSectionDescription || "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.";

  const titleStyle: React.CSSProperties = {
    fontSize: sectionData?.casesSectionTitleSize ? `${sectionData.casesSectionTitleSize}px` : undefined,
  };
  const descriptionStyle: React.CSSProperties = {
    fontSize: sectionData?.casesSectionDescriptionSize ? `${sectionData.casesSectionDescriptionSize}px` : undefined,
  };
  
  const sectionPadding = sectionData?.sectionPadding?.cases;
  const style: React.CSSProperties = sectionPadding ? {
    '--padding-top': `${sectionPadding.top}px`,
    '--padding-bottom': `${sectionPadding.bottom}px`,
    '--padding-top-mobile': `${sectionPadding.topMobile}px`,
    '--padding-bottom-mobile': `${sectionPadding.bottomMobile}px`,
  } as any : {};

  return (
    <section 
        id="cases" 
        className="bg-background py-[var(--padding-top-mobile)] md:py-[var(--padding-top)]" 
        style={style}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
           <h2 
            className={cn("text-h2 font-bold tracking-tight", sectionData?.casesSectionTitleColor || "text-black")}
            style={titleStyle}
          >
            {title}
          </h2>
          <p 
            className={cn("mt-4 max-w-2xl mx-auto text-body", sectionData?.casesSectionDescriptionColor || "text-muted-foreground")}
            style={descriptionStyle}
          >
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.title} className="flex flex-col overflow-hidden">
                <div className="relative w-full h-48">
                  <Image
                    src={caseStudy.imageUrl}
                    alt={caseStudy.title}
                    data-ai-hint={caseStudy.aiHint}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              <CardHeader>
                <CardTitle className="mb-2">{caseStudy.title}</CardTitle>
                <CardDescription>{caseStudy.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
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
