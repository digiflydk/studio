

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
import TabsSection from '@/components/sections/tabs-section';

const defaultSectionOrder = ['hero', 'feature', 'services', 'aiProject', 'cases', 'about', 'customers', 'tabs'];

export default async function Home() {
  const settings = await getGeneralSettings();
  const visibility = settings?.sectionVisibility ?? {};
  
  const order = settings?.homePageSectionOrder && settings.homePageSectionOrder.length > 0 
    ? settings.homePageSectionOrder.filter(id => id !== 'blog')
    : defaultSectionOrder;

  const sections: Record<string, React.ReactNode> = {
    hero: visibility.hero !== false ? <HeroSection settings={settings} /> : null,
    feature: visibility.feature !== false ? <FeatureSection settings={settings} /> : null,
    services: visibility.services !== false ? <ServicesSection settings={settings} /> : null,
    aiProject: visibility.aiProject !== false ? <AiProjectSection settings={settings} /> : null,
    cases: visibility.cases !== false ? <CasesSection settings={settings} /> : null,
    about: visibility.about !== false ? <AboutSection settings={settings} /> : null,
    customers: visibility.customers !== false ? <CustomersSection settings={settings} /> : null,
    tabs: visibility.tabs !== false ? <TabsSection settings={settings} /> : null,
  };
  
  return (
    <>
      {order.map(sectionKey => {
        if (visibility[sectionKey as keyof typeof visibility] === false) return null;
        switch (sectionKey) {
            case 'hero':
                return <HeroSection key="hero" settings={settings} />;
            case 'feature':
                return <FeatureSection key="feature" settings={settings} />;
            case 'services':
                return <ServicesSection key="services" settings={settings} />;
            case 'aiProject':
                return <AiProjectSection key="aiProject" settings={settings} />;
            case 'cases':
                return <CasesSection key="cases" settings={settings} />;
            case 'about':
                return <AboutSection key="about" settings={settings} />;
            case 'customers':
                return <CustomersSection key="customers" settings={settings} />;
            case 'tabs':
                return <TabsSection key="tabs" settings={settings} />;
            default:
                return null;
        }
      })}
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
