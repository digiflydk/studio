

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

const defaultSectionOrder = ['feature', 'services', 'aiProject', 'cases', 'about', 'customers', 'tabs'];

export default async function Home() {
  const settings = await getGeneralSettings();
  const visibility = settings?.sectionVisibility;
  const order = (settings?.homePageSectionOrder || defaultSectionOrder).filter(id => id !== 'blog');

  const heroPad = settings?.sectionPadding?.hero;
  const padTop = heroPad?.top ?? 80;
  const padBottom = heroPad?.bottom ?? 80;
  const padTopMobile = heroPad?.topMobile ?? 64;
  const padBottomMobile = heroPad?.bottomMobile ?? 64;

  const sections: Record<string, React.ReactNode> = {
    feature: visibility?.feature !== false ? <FeatureSection settings={settings} /> : null,
    services: visibility?.services !== false ? <ServicesSection settings={settings} /> : null,
    aiProject: visibility?.aiProject !== false ? <AiProjectSection settings={settings} /> : null,
    cases: visibility?.cases !== false ? <CasesSection settings={settings} /> : null,
    about: visibility?.about !== false ? <AboutSection settings={settings} /> : null,
    customers: visibility?.customers !== false ? <CustomersSection settings={settings} /> : null,
    tabs: visibility?.tabs !== false ? <TabsSection settings={settings} /> : null,
  };
  
  return (
    <>
      <div 
        style={{ paddingTop: `${padTopMobile}px` }}
        className="hero-pad-wrapper-mobile"
      >
         <div 
            className="hero-pad-wrapper-desktop"
            style={{ paddingTop: `${padTop}px`}}
          >
            <HeroSection settings={settings} />
        </div>
        <style>{`
          .hero-pad-wrapper-desktop {
             padding-top: ${padTop}px;
          }
          @media (max-width: 639px) {
            .hero-pad-wrapper-desktop {
                display: none;
            }
          }
          @media (min-width: 640px) {
            .hero-pad-wrapper-mobile {
                display: none;
            }
          }
        `}</style>
      </div>

      {order.map(sectionKey => sections[sectionKey] ? (
        <div key={sectionKey}>{sections[sectionKey]}</div>
      ) : null)}
      <ContactSection settings={settings} />
      <StickyCta />
    </>
  );
}
