import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const cases = [
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

export default function CasesSection() {
  return (
    <section id="cases" className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-black">Vores Arbejde</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.title} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
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
                <p className="text-muted-foreground">{caseStudy.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="pl-0">
                  <Link href={caseStudy.link}>Læs mere</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
