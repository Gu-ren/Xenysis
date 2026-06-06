import { HeroSection } from "./components/hero-section"
import { FounderSessionSection } from "./components/founder-session-section"
import { SystemAssemblySection } from "./components/system-assembly-section"
import { WorkspaceSection } from "./components/workspace-section"
import { DeploySection } from "./components/deploy-section"
import { Footer } from "./components/footer"

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <div id="session"><FounderSessionSection /></div>
      <div id="blueprint"><SystemAssemblySection /></div>
      <div id="workspace"><WorkspaceSection /></div>
      <div id="launch"><DeploySection /></div>
      <Footer />
    </main>
  )
}
