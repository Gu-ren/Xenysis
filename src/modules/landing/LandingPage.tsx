import { HeroSection } from "./components/hero-section"
import { FounderSessionSection } from "./components/founder-session-section"
import { SystemAssemblySection } from "./components/system-assembly-section"
import { WorkspaceSection } from "./components/workspace-section"
import { DeploySection } from "./components/deploy-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { Footer } from "./components/footer"

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FounderSessionSection />
      <SystemAssemblySection />
      <WorkspaceSection />
      <DeploySection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
