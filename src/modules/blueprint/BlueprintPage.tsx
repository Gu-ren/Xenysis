'use client'

import { useState } from 'react'
import { AlertCircle, FileX, RefreshCw } from 'lucide-react'
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
import { useBlueprint } from './hooks/use-blueprint'
import { exportBlueprintAsPdf } from './utils/export-blueprint'

function trackEvent(event: string): void {
  console.log('[Xenysis Analytics]', event)
}

function BlueprintSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="h-[57px] border-b border-white/[0.06] bg-[#0a0a0a]/90" />
      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr_220px] gap-8 px-8 py-10">
        <div className="space-y-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
          ))}
        </div>
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-40 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-32 rounded-xl bg-white/[0.04] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="h-40 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlueprintError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">Failed to load blueprint</h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{error.message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] text-zinc-300 text-sm hover:border-white/[0.14] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      </div>
    </div>
  )
}

function BlueprintEmpty() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
          <FileX className="w-5 h-5 text-zinc-600" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">No blueprint yet</h2>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Complete a Founder Session to generate your startup blueprint.
        </p>
      </div>
    </div>
  )
}

export function BlueprintPage() {
  const activeSection = useActiveSection()
  const { user } = useAuth()
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const { blueprint, loading, error, refetch } = useBlueprint()

  const handleOpenWaitlist = () => {
    trackEvent('workspace_cta_clicked')
    setIsWaitlistOpen(true)
  }

  const handleExport = async () => {
    if (!blueprint) return
    trackEvent('blueprint_exported')
    const slug = (blueprint.content.overview.tagline ?? 'startup-blueprint')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    await exportBlueprintAsPdf(blueprint.content, `${slug}-blueprint`)
  }

  if (loading) return <BlueprintSkeleton />

  if (error) {
    return <BlueprintError error={error} onRetry={refetch} />
  }

  if (!blueprint) return <BlueprintEmpty />

  const { content } = blueprint

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/20 font-sans">
      <BlueprintHeader onOpenWaitlist={handleOpenWaitlist} onExport={handleExport} />

      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr_220px] gap-8 px-8 py-10">
        <NavSidebar activeSection={activeSection} />

        <main className="min-w-0 space-y-28">
          <OverviewSection
            overview={content.overview}
            customer={content.customer}
            businessModel={content.businessModel}
          />
          <ProblemSection problem={content.problem} />
          <CustomerSection customer={content.customer} />
          <SolutionSection solution={content.solution} />
          <BusinessModelSection businessModel={content.businessModel} />
          <PersonasSection personas={content.personas} />
          <UserJourneysSection userJourneys={content.userJourneys} />
          <MvpScopeSection mvpScope={content.mvpScope} />
          <RequirementsSection requirements={content.requirements} />
          <RoadmapSection roadmap={content.roadmap} />
          <RisksSection risks={content.risks} />
        </main>

        <MetricsSidebar metrics={content.metrics} />
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        userEmail={user?.email}
      />
    </div>
  )
}
