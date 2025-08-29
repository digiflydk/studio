import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/layout/footer';
import StickyCta from '@/components/sticky-cta';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getGeneralSettings } from '@/services/settings';

export default async function Home() {
  const settings = await getGeneralSettings();

  return (
    <div className="flex flex-col min-h-screen">
       <Suspense fallback={<div className="h-16 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <Header />
      </Suspense>
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AiProjectSection />
        <CasesSection 
            cases={settings?.cases} 
            sectionData={settings}
        />
        <AboutSection />
        <ContactSection />
      </main>
      <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <Footer />
      </Suspense>
      <StickyCta />
    </div>
  );
}
