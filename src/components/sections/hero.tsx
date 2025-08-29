
import Image from 'next/image';
import { getGeneralSettings } from '@/services/settings';

export default async function HeroSection() {
  const settings = await getGeneralSettings();

  const headline = settings?.heroHeadline || 'Flow. Automatisér. Skalér.';
  const description = settings?.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.';
  const imageUrl = settings?.heroImageUrl || 'https://picsum.photos/1920/1280';


  return (
    <section
      id="hero"
      className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] flex items-center justify-center text-center py-0"
    >
      <Image
        src={imageUrl}
        alt="Tech background"
        data-ai-hint="tech background"
        fill
        className="object-cover -z-10 brightness-50"
        priority
      />
      <div className="container px-4 md:px-6 text-white">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-h1 font-bold tracking-tight font-headline">
            {headline}
          </h1>
          <p className="max-w-[700px] text-body text-primary-foreground/80">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
