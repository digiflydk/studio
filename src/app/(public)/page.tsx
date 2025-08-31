
import HeroSection from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import StickyCta from '@/components/sticky-cta';
import { getGeneralSettings } from '@/services/settings';
import CustomersSection from '@/components/sections/customers';

export default async function Home() {
  const settings = await getGeneralSettings();

  return (
    <>
      <HeroSection settings={settings} />
      <ServicesSection settings={settings} />
      <AiProjectSection settings={settings} />
      <CasesSection
        settings={settings}
      />
      <CustomersSection settings={settings} />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
