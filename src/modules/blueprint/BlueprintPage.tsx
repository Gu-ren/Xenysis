'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, FileX, RefreshCw } from 'lucide-react'
import { useAuth } from '@/services/auth/use-auth'
import { useStartupStore } from '@/store/startup'
import { BlueprintHeader } from './components/blueprint-header'
import { NavSidebar } from './components/nav-sidebar'
import { AIChatPanel } from './components/ai-chat-panel'
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
import { computeAllSectionScores } from './utils/section-scores'
import type { BlueprintContent } from './types/blueprint-api'

// Maps BlueprintContent top-level keys to the DOM id on each <section> element.
const SECTION_ID_MAP: Record<string, string> = {
  businessModel: 'business-model',
  userJourneys:  'user-journeys',
  mvpScope:      'mvp-scope',
  // All other keys match their section id 1-to-1
}

function getSectionId(path: string): string {
  return SECTION_ID_MAP[path] ?? path
}

function trackEvent(event: string): void {
  console.log('[Xenysis Analytics]', event)
}

function BlueprintSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="h-[57px] border-b border-white/[0.06] bg-[#0a0a0a]/90" />
      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr_360px] gap-8 px-8 py-10">
        <div className="space-y-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
          ))}
        </div>
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-2 w-full rounded bg-white/[0.04] animate-pulse" />
              <div className="h-6 w-40 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-32 rounded-xl bg-white/[0.04] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-10 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="flex-1 h-[400px] rounded-xl bg-white/[0.02] animate-pulse" />
          <div className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
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
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const { blueprint, loading, error, refetch } = useBlueprint()
  const startupId = useStartupStore((s) => s.startupId)

  // Live blueprint content — updated optimistically by AI chat patches
  const [liveContent, setLiveContent] = useState<BlueprintContent | null>(null)

  // Tracks which sections were patched during a streaming session so we can
  // scroll to the first changed section when the stream completes.
  const patchedSectionsRef = useRef<string[]>([])

  // Sync liveContent whenever the fetched blueprint changes
  useEffect(() => {
    if (blueprint?.content) {
      setLiveContent(blueprint.content)
    }
  }, [blueprint])

  // Patch a single top-level section key from AI chat
  const handleContentPatch = useCallback((path: string, value: unknown) => {
    setLiveContent((prev) => {
      if (!prev) return prev
      return { ...prev, [path]: value } as BlueprintContent
    })
    // Track patched section and flash an emerald glow on it
    patchedSectionsRef.current.push(path)
    const el = document.getElementById(getSectionId(path))
    if (el) {
      el.classList.remove('ai-highlight')  // reset if already animating
      // Force reflow so the animation restarts cleanly
      void el.offsetWidth
      el.classList.add('ai-highlight')
      setTimeout(() => el.classList.remove('ai-highlight'), 2100)
    }
  }, [])

  // Replace full content when AI chat stream completes — scroll to first changed section
  const handleContentReplace = useCallback((content: BlueprintContent) => {
    setLiveContent(content)
    const firstPath = patchedSectionsRef.current[0]
    if (firstPath) {
      document.getElementById(getSectionId(firstPath))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    patchedSectionsRef.current = []
  }, [])

  const handleOpenWaitlist = () => {
    trackEvent('workspace_cta_clicked')
    setIsWaitlistOpen(true)
  }

  const handleExport = async () => {
    if (!liveContent || isExporting) return
    setExportError(null)
    setIsExporting(true)
    const slug = (liveContent.overview.tagline ?? 'startup-blueprint')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    try {
      await exportBlueprintAsPdf(liveContent, `${slug}-blueprint`, {
        generatedAt: blueprint?.generatedAt ?? new Date().toISOString(),
      })
      trackEvent('blueprint_exported')
    } catch (err) {
      trackEvent('blueprint_export_failed')
      setExportError(err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) return <BlueprintSkeleton />

  if (error) {
    return <BlueprintError error={error} onRetry={refetch} />
  }

  if (!blueprint || !liveContent) return <BlueprintEmpty />

  const scores = computeAllSectionScores(liveContent)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/20 font-sans">
      <BlueprintHeader
        onOpenWaitlist={handleOpenWaitlist}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {exportError && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-8 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <p className="text-red-400 text-sm">{exportError}</p>
            <button
              onClick={() => setExportError(null)}
              className="text-red-400/70 hover:text-red-300 text-xs shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr_360px] gap-8 px-8 py-10">
        <NavSidebar activeSection={activeSection} />

        <main className="min-w-0 space-y-28">
          <OverviewSection
            overview={liveContent.overview}
            customer={liveContent.customer}
            businessModel={liveContent.businessModel}
            percentage={scores['overview']}
          />
          <ProblemSection problem={liveContent.problem} percentage={scores['problem']} />
          <CustomerSection customer={liveContent.customer} percentage={scores['customer']} />
          <SolutionSection solution={liveContent.solution} percentage={scores['solution']} />
          <BusinessModelSection businessModel={liveContent.businessModel} percentage={scores['business-model']} />
          <PersonasSection personas={liveContent.personas} percentage={scores['personas']} />
          <UserJourneysSection userJourneys={liveContent.userJourneys} percentage={scores['user-journeys']} />
          <MvpScopeSection mvpScope={liveContent.mvpScope} percentage={scores['mvp-scope']} />
          <RequirementsSection requirements={liveContent.requirements} percentage={scores['requirements']} />
          <RoadmapSection roadmap={liveContent.roadmap} percentage={scores['roadmap']} />
          <RisksSection risks={liveContent.risks} percentage={scores['risks']} />
        </main>

        <AIChatPanel
          startupId={startupId ?? blueprint.blueprintId}
          content={liveContent}
          onContentPatch={handleContentPatch}
          onContentReplace={handleContentReplace}
        />
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        userEmail={user?.email}
        startupId={startupId}
        blueprintId={blueprint?.blueprintId ?? null}
      />
    </div>
  )
}

