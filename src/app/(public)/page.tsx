
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

const defaultSectionOrder = ['feature', 'services', 'aiProject', 'cases', 'about', 'customers', 'blog'];

export default async function Home() {
  const settings = await getGeneralSettings();
  const visibility = settings?.sectionVisibility;
  const order = settings?.homePageSectionOrder || defaultSectionOrder;

  const sections: Record<string, React.ReactNode> = {
    feature: visibility?.feature !== false && <FeatureSection settings={settings} />,
    services: visibility?.services !== false && <ServicesSection settings={settings} />,
    aiProject: visibility?.aiProject !== false && <AiProjectSection settings={settings} />,
    cases: visibility?.cases !== false && <CasesSection settings={settings} />,
    about: visibility?.about !== false && <AboutSection settings={settings} />,
    customers: visibility?.customers !== false && <CustomersSection settings={settings} />,
    blog: visibility?.blog !== false && <BlogSection settings={settings} />,
  };
  
  return (
    <>
      <HeroSection settings={settings} />
      {order.map(sectionKey => (
        <div key={sectionKey}>{sections[sectionKey]}</div>
      ))}
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
