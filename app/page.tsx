import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { AboutPreview } from '@/components/about-preview'
import { ExperienceSection } from '@/components/experience-section'
import { ProjectsSection } from '@/components/projects-section'
import { SkillsSection } from '@/components/skills-section'
import { BusinessCTASection } from '@/components/business-cta-section'
import { RecruiterSection } from '@/components/recruiter-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
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
  )
}
