
import HeroSection from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import StickyCta from '@/components/sticky-cta';
import { getGeneralSettings } from '@/services/settings';

export default async function Home() {
  const settings = await getGeneralSettings();

  return (
    <>
      <HeroSection />
      <ServicesSection settings={settings} />
      <AiProjectSection />
      <CasesSection
        cases={settings?.cases}
        sectionData={settings}
      />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
