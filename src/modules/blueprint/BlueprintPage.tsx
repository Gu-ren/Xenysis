'use client'

import { useState } from 'react'
import { useAuth } from '@/services/auth/use-auth'
import { BlueprintHeader } from './components/blueprint-header'
import { NavSidebar } from './components/nav-sidebar'
import { MetricsSidebar } from './components/metrics-sidebar'
import { WaitlistModal } from './components/waitlist-modal'
import { OverviewSection } from './sections/overview-section'
import { ProblemSection } from './sections/problem-section'
import { CustomerSection } from './sections/customer-section'
import { SolutionSection } from './sections/solution-section'
import { BusinessModelSection } from './sections/business-model-section'
import { PersonasSection } from './sections/personas-section'
import { UserJourneysSection } from './sections/user-journeys-section'
import { MvpScopeSection } from './sections/mvp-scope-section'
import { RequirementsSection } from './sections/requirements-section'
import { RoadmapSection } from './sections/roadmap-section'
import { RisksSection } from './sections/risks-section'
import { useActiveSection } from './hooks/use-active-section'

function trackEvent(event: string): void {
  console.log('[Xenysis Analytics]', event)
}

export function BlueprintPage() {
  const activeSection = useActiveSection()
  const { user } = useAuth()
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  const handleOpenWaitlist = () => {
    trackEvent('workspace_cta_clicked')
    setIsWaitlistOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/20 font-sans">
      <BlueprintHeader onOpenWaitlist={handleOpenWaitlist} />

      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr_220px] gap-8 px-8 py-10">
        <NavSidebar activeSection={activeSection} />

        <main className="min-w-0 space-y-28">
          <OverviewSection />
          <ProblemSection />
          <CustomerSection />
          <SolutionSection />
          <BusinessModelSection />
          <PersonasSection />
          <UserJourneysSection />
          <MvpScopeSection />
          <RequirementsSection />
          <RoadmapSection />
          <RisksSection />
        </main>

        <MetricsSidebar />
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        userEmail={user?.email}
      />
    </div>
  )
}
