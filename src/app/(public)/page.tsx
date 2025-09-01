
import HeroSection from '@/components/sections/hero';
import FeatureSection from '@/components/sections/feature';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import StickyCta from '@/components/sticky-cta';
import { getGeneralSettings } from '@/services/settings';
import CustomersSection from '@/components/sections/customers';
import BlogSection from '@/components/sections/blog';

export default async function Home() {
  const settings = await getGeneralSettings();
  const visibility = settings?.sectionVisibility;

  return (
    <>
      <HeroSection settings={settings} />
      {visibility?.feature !== false && <FeatureSection settings={settings} />}
      {visibility?.services !== false && <ServicesSection settings={settings} />}
      {visibility?.aiProject !== false && <AiProjectSection settings={settings} />}
      {visibility?.cases !== false && <CasesSection settings={settings} />}
      {visibility?.about !== false && <AboutSection settings={settings} />}
      {visibility?.customers !== false && <CustomersSection settings={settings} />}
      {visibility?.blog !== false && <BlogSection settings={settings} />}
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
