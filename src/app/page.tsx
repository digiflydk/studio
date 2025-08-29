import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import AiProjectSection from '@/components/sections/ai-project';
import CasesSection from '@/components/sections/cases';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/layout/footer';
import StickyCta from '@/components/sticky-cta';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AiProjectSection />
        <CasesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
