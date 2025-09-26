

import { getAdminHome } from "@/services/admin.server";
import Hero from "@/components/sections/Hero";
import { getSettingsAction } from "@/app/actions";
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
  const home = await getAdminHome();

  return (
    <>
      {home ? <Hero home={home} /> : null}
    </>
  );
}
