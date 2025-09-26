

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
  const settings = await getSettingsAction();
  const s = settings ?? {};

  // Combine settings for Hero
  const heroSettings = {
      ...s,
      heroHeadline: home?.hero.headline ?? s.heroHeadline,
      heroDescription: home?.hero.description ?? s.heroDescription,
      heroCtaText: home?.hero.ctaText ?? s.heroCtaText,
      heroCtaLink: home?.hero.ctaLink ?? s.heroCtaLink,
      heroGridImage1Url: home?.hero.images?.tl,
      heroGridImage2Url: home?.hero.images?.tr,
      heroGridImage3Url: home?.hero.images?.bl,
      heroGridImage4Url: home?.hero.images?.br,
      heroLayout: 'textWithImageGrid', // Force this layout for now
  }

  let order: string[] = home?.sectionOrder ?? s.homePageSectionOrder ?? ["hero", "feature", "services", "aiProject", "cases", "about", "customers"];
  if (s.sectionVisibility?.hero && order[0] !== "hero") {
    order = ["hero", ...order.filter((x) => x !== "hero")];
  }

  return (
    <>
      {home ? <Hero home={home} /> : null}
    </>
  );
}
