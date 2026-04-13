import { Navigation } from "@/components/sections/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutPreview } from "@/components/sections/about-preview";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { BusinessCTASection } from "@/components/sections/business-cta-section";
import { RecruiterSection } from "@/components/sections/recruiter-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 ">
      <Navigation />
      <HeroSection />
      <AboutPreview />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <BusinessCTASection />
      <RecruiterSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
