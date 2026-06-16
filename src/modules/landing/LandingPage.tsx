import { HeroSection } from "./components/hero-section"
import { FounderSessionSection } from "./components/founder-session-section"
import { Footer } from "./components/footer"

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <div id="session"><FounderSessionSection /></div>
      <Footer />
    </main>
  )
}
