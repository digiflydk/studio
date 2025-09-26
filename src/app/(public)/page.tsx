

import { getSettingsAction } from "@/app/actions";
import Hero from "@/components/sections/Hero";
import FeatureSection from '@/components/sections/feature';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import StickyCta from '@/components/sticky-cta';
import CustomersSection from '@/components/sections/customers';
import TabsSection from '@/components/sections/tabs-section';


export default async function HomePage() {
  const settings = await getSettingsAction();
  const s = (settings as any) ?? {};

  // Respekter CMS-rækkefølge, men tving hero først hvis slået til
  let order: string[] = s.homePageSectionOrder ?? ["hero", "feature", "services", "aiProject", "cases", "about", "customers"];
  if (s.sectionVisibility?.hero && order[0] !== "hero") {
    order = ["hero", ...order.filter((x) => x !== "hero")];
  }

  return (
    <main>
      {order.map((key) => {
        switch (key) {
          case "hero":
            return s.sectionVisibility?.hero ? <Hero key="hero" settings={s} /> : null;
          case 'feature':
                return s.sectionVisibility?.feature !== false ? <FeatureSection key="feature" settings={s} /> : null;
            case 'services':
                return s.sectionVisibility?.services !== false ? <ServicesSection key="services" settings={s} /> : null;
            case 'aiProject':
                return s.sectionVisibility?.aiProject !== false ? <AiProjectSection key="aiProject" settings={s} /> : null;
            case 'cases':
                return s.sectionVisibility?.cases !== false ? <CasesSection key="cases" settings={s} /> : null;
            case 'about':
                return s.sectionVisibility?.about !== false ? <AboutSection key="about" settings={s} /> : null;
            case 'customers':
                return s.sectionVisibility?.customers !== false ? <CustomersSection key="customers" settings={s} /> : null;
            case 'tabs':
                return s.sectionVisibility?.tabs !== false ? <TabsSection key="tabs" settings={s} /> : null;
          default:
            return null;
        }
      })}
      <ContactSection settings={s} />
      <StickyCta />
    </main>
  );
}
