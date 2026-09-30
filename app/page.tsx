import CinematicOrbitHero from "@/components/ui/cinematic-orbit-hero";
import { ContactSection } from "@/components/portfolio/contact-section";
import { HeroIntro } from "@/components/portfolio/hero-intro";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteNav } from "@/components/portfolio/site-nav";
import { StudioSection } from "@/components/portfolio/studio-section";
import { WorkSection } from "@/components/portfolio/work-section";

export default function Home() {
  return (
    <>
      {/* Fixed header + full-screen clip-path nav panel. */}
      <SiteNav />

      <main className="flex w-full flex-col">
        <HeroIntro />
        <CinematicOrbitHero />
        <WorkSection />
        <StudioSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  );
}
