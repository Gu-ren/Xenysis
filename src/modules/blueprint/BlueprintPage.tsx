'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, FileX, RefreshCw } from 'lucide-react'
import { useAuth } from '@/services/auth/use-auth'
import { useStartupStore } from '@/store/startup'
import { BlueprintHeader } from './components/blueprint-header'
import { NavSidebar } from './components/nav-sidebar'
import { FloatingChat } from './components/floating-chat'
import { SuggestionReviewModal } from './components/suggestion-review-modal'
import { VersionHistoryPanel } from './components/version-history-panel'
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
import { CustomSections } from './sections/custom-sections'
import { CustomBlocksSection } from './sections/custom-blocks-section'
import { SectionHeading } from './ui/section-heading'
import { useActiveSection } from './hooks/use-active-section'
import { useBlueprint } from './hooks/use-blueprint'
import type { ChatSuggestion } from './hooks/use-blueprint-chat'
import {
  analyzeBlueprintChanges,
  heartbeatBlueprintPresence,
  regenerateOpportunityFromBlueprint,
  saveBlueprint,
} from './services/blueprint'
import { exportBlueprintAsPdf } from './utils/export-blueprint'
import { computeAllSectionScores } from './utils/section-scores'
import type {
  AnalyzeChangesResult,
  BlueprintContent,
  BlueprintSaveSource,
  BlueprintVersionHeader,
  PresencePeer,
} from './types/blueprint-api'

const SECTION_ID_MAP: Record<string, string> = {
  businessModel: 'business-model',
  userJourneys: 'user-journeys',
  mvpScope: 'mvp-scope',
  customSections: 'custom-sections',
  customBlocks: 'custom-blocks',
}

function getSectionId(path: string): string {
  return SECTION_ID_MAP[path] ?? path
}

function trackEvent(event: string): void {
  console.log('[Xenysis Analytics]', event)
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function BlueprintSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="h-[57px] border-b border-white/[0.06] bg-[#0a0a0a]/90" />
      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr] gap-8 px-8 py-10">
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
  const [actionError, setActionError] = useState<string | null>(null)
  const { blueprint, loading, error, refetch } = useBlueprint()
  const startupId = useStartupStore((s) => s.startupId)

  const [committedContent, setCommittedContent] = useState<BlueprintContent | null>(null)
  const [draftContent, setDraftContent] = useState<BlueprintContent | null>(null)
  const [versionNumber, setVersionNumber] = useState(1)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [regeneratingOa, setRegeneratingOa] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalyzeChangesResult | null>(null)
  const [reviewMode, setReviewMode] = useState<'analyze' | 'chat'>('analyze')
  const [peers, setPeers] = useState<PresencePeer[]>([])
  const [compareNote, setCompareNote] = useState<string | null>(null)

  const patchedSectionsRef = useRef<string[]>([])
  const chatNoteRef = useRef<((text: string) => void) | null>(null)

  useEffect(() => {
    if (blueprint?.content) {
      setCommittedContent(blueprint.content)
      setDraftContent(blueprint.content)
      setVersionNumber(blueprint.versionNumber)
    }
  }, [blueprint])

  const dirty =
    Boolean(committedContent && draftContent && !deepEqual(committedContent, draftContent))

  const persist = useCallback(
    async (content: BlueprintContent, source: BlueprintSaveSource) => {
      const id = startupId ?? blueprint?.blueprintId
      if (!id) throw new Error('Missing startup id')
      setSaving(true)
      setActionError(null)
      try {
        const saved = await saveBlueprint(id, content, source, versionNumber)
        setCommittedContent(saved.content)
        setDraftContent(saved.content)
        setVersionNumber(saved.versionNumber)
        chatNoteRef.current?.(
          `Blueprint updated (${source === 'ai_apply' ? 'AI apply' : source}). Context refreshed.`,
        )
        trackEvent('blueprint_saved')
        return saved
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save blueprint'
        if (message.includes('VERSION_CONFLICT') || message.includes('409')) {
          setActionError(
            'Someone else saved a newer version. Reload the page or discard and retry.',
          )
        } else {
          setActionError(message)
        }
        throw err
      } finally {
        setSaving(false)
      }
    },
    [startupId, blueprint?.blueprintId, versionNumber],
  )

  const handleContentPatch = useCallback((path: string, value: unknown) => {
    // Preview patches from streaming chat — apply to draft only for visual feedback
    setDraftContent((prev) => {
      if (!prev) return prev
      return { ...prev, [path]: value } as BlueprintContent
    })
    patchedSectionsRef.current.push(path)
    const el = document.getElementById(getSectionId(path))
    if (el) {
      el.classList.remove('ai-highlight')
      void el.offsetWidth
      el.classList.add('ai-highlight')
      setTimeout(() => el.classList.remove('ai-highlight'), 2100)
    }
  }, [])

  const handleContentReplace = useCallback((content: BlueprintContent) => {
    // Do not auto-commit; keep as draft preview until Apply
    setDraftContent(content)
    const firstPath = patchedSectionsRef.current[0]
    if (firstPath) {
      document
        .getElementById(getSectionId(firstPath))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    patchedSectionsRef.current = []
  }, [])

  const handleChatSuggestion = useCallback((suggestion: ChatSuggestion) => {
    setReviewMode('chat')
    setAnalysis({
      summary: suggestion.summary,
      rationale: suggestion.rationale,
      suggestion: suggestion.patch,
      previewContent: suggestion.previewContent,
    })
    setReviewOpen(true)
  }, [])

  const handleDiscard = () => {
    if (committedContent) setDraftContent(committedContent)
    setActionError(null)
  }

  const handleSave = async () => {
    if (!draftContent) return
    await persist(draftContent, 'manual')
  }

  const handleReviewWithAi = async () => {
    const id = startupId ?? blueprint?.blueprintId
    if (!id || !committedContent || !draftContent) return
    setReviewMode('analyze')
    setReviewOpen(true)
    setReviewLoading(true)
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const result = await analyzeBlueprintChanges(id, committedContent, draftContent)
      setAnalysis(result)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Analysis failed')
      setReviewOpen(false)
    } finally {
      setReviewLoading(false)
      setAnalyzing(false)
    }
  }

  const handleApplySuggestion = async () => {
    if (!analysis?.previewContent) return
    setReviewOpen(false)
    await persist(analysis.previewContent, 'ai_apply')
    setAnalysis(null)
  }

  const handleKeepEdits = async () => {
    if (!draftContent) return
    setReviewOpen(false)
    await persist(draftContent, reviewMode === 'chat' ? 'manual' : 'manual')
    setAnalysis(null)
  }

  const handleRestore = async (content: BlueprintContent) => {
    setHistoryOpen(false)
    setDraftContent(content)
    await persist(content, 'restore')
  }

  const handleCompare = (content: BlueprintContent, meta: BlueprintVersionHeader) => {
    const a = content as unknown as Record<string, unknown>
    const b = (draftContent ?? {}) as unknown as Record<string, unknown>
    const changed = Object.keys(a).filter((k) => {
      if (k.startsWith('_')) return false
      return !deepEqual(a[k], b[k])
    })
    setCompareNote(
      `v${meta.versionNumber} vs current draft — differing sections: ${
        changed.length ? changed.join(', ') : 'none'
      }`,
    )
  }

  const handleRerunOa = async () => {
    const id = startupId ?? blueprint?.blueprintId
    if (!id || !committedContent || dirty) return
    if (
      !window.confirm(
        'Re-run Opportunity Assessment from the current blueprint? This creates a new OA version.',
      )
    ) {
      return
    }
    setRegeneratingOa(true)
    setActionError(null)
    try {
      await regenerateOpportunityFromBlueprint(id, committedContent, () => {})
      trackEvent('oa_regenerated_from_blueprint')
      chatNoteRef.current?.('Opportunity Assessment regenerated from blueprint.')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to regenerate OA')
    } finally {
      setRegeneratingOa(false)
    }
  }

  const handleOpenWaitlist = () => {
    trackEvent('workspace_cta_clicked')
    setIsWaitlistOpen(true)
  }

  const handleExport = async () => {
    if (!draftContent || isExporting) return
    setExportError(null)
    setIsExporting(true)
    const slug = (draftContent.overview.tagline ?? 'startup-blueprint')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    try {
      await exportBlueprintAsPdf(draftContent, `${slug}-blueprint`, {
        generatedAt: blueprint?.generatedAt ?? new Date().toISOString(),
      })
      trackEvent('blueprint_exported')
    } catch (err) {
      trackEvent('blueprint_export_failed')
      setExportError(
        err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.',
      )
    } finally {
      setIsExporting(false)
    }
  }

  // Presence heartbeat
  useEffect(() => {
    const id = startupId ?? blueprint?.blueprintId
    if (!id || !user) return
    let cancelled = false
    const tick = async () => {
      try {
        const list = await heartbeatBlueprintPresence(
          id,
          user.email?.split('@')[0] ?? 'Editor',
          activeSection,
        )
        if (!cancelled) setPeers(list)
      } catch {
        // non-fatal
      }
    }
    tick()
    const interval = setInterval(tick, 15_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [startupId, blueprint?.blueprintId, user, activeSection])

  if (loading) return <BlueprintSkeleton />
  if (error) return <BlueprintError error={error} onRetry={refetch} />
  if (!blueprint || !draftContent || !committedContent) return <BlueprintEmpty />

  const scores = computeAllSectionScores(draftContent)
  const chatStartupId = startupId ?? blueprint.blueprintId

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/20 font-sans">
      <BlueprintHeader
        onOpenWaitlist={handleOpenWaitlist}
        onExport={handleExport}
        isExporting={isExporting}
        dirty={dirty}
        saving={saving}
        analyzing={analyzing}
        regeneratingOa={regeneratingOa}
        versionNumber={versionNumber}
        peers={peers}
        onSave={() => void handleSave()}
        onDiscard={handleDiscard}
        onReviewWithAi={() => void handleReviewWithAi()}
        onOpenHistory={() => setHistoryOpen(true)}
        onRerunOa={() => void handleRerunOa()}
      />

      {(exportError || actionError || compareNote) && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-8 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <p className={`text-sm ${compareNote && !actionError && !exportError ? 'text-zinc-300' : 'text-red-400'}`}>
              {actionError ?? exportError ?? compareNote}
            </p>
            <button
              onClick={() => {
                setExportError(null)
                setActionError(null)
                setCompareNote(null)
              }}
              className="text-zinc-500 hover:text-zinc-300 text-xs shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto grid grid-cols-[200px_1fr] gap-8 px-8 py-10 pb-32">
        <NavSidebar activeSection={activeSection} peers={peers} />

        <main className="min-w-0 space-y-28">
          <OverviewSection
            overview={draftContent.overview}
            customer={draftContent.customer}
            businessModel={draftContent.businessModel}
            percentage={scores['overview']}
            editable
            onChange={(overview) => setDraftContent({ ...draftContent, overview })}
          />
          <ProblemSection
            problem={draftContent.problem}
            percentage={scores['problem']}
            editable
            onChange={(problem) => setDraftContent({ ...draftContent, problem })}
          />
          <CustomerSection
            customer={draftContent.customer}
            percentage={scores['customer']}
            editable
            onChange={(customer) => setDraftContent({ ...draftContent, customer })}
          />
          <SolutionSection
            solution={draftContent.solution}
            percentage={scores['solution']}
            editable
            onChange={(solution) => setDraftContent({ ...draftContent, solution })}
          />
          <BusinessModelSection
            businessModel={draftContent.businessModel}
            percentage={scores['business-model']}
            editable
            onChange={(businessModel) => setDraftContent({ ...draftContent, businessModel })}
          />
          <PersonasSection
            personas={draftContent.personas}
            percentage={scores['personas']}
            editable
            onChange={(personas) => setDraftContent({ ...draftContent, personas })}
          />
          <UserJourneysSection
            userJourneys={draftContent.userJourneys}
            percentage={scores['user-journeys']}
            editable
            onChange={(userJourneys) => setDraftContent({ ...draftContent, userJourneys })}
          />
          <MvpScopeSection
            mvpScope={draftContent.mvpScope}
            percentage={scores['mvp-scope']}
            editable
            onChange={(mvpScope) => setDraftContent({ ...draftContent, mvpScope })}
          />
          <RequirementsSection
            requirements={draftContent.requirements}
            percentage={scores['requirements']}
            editable
            onChange={(requirements) => setDraftContent({ ...draftContent, requirements })}
          />
          <RoadmapSection
            roadmap={draftContent.roadmap}
            percentage={scores['roadmap']}
            editable
            onChange={(roadmap) => setDraftContent({ ...draftContent, roadmap })}
          />
          <RisksSection
            risks={draftContent.risks}
            percentage={scores['risks']}
            editable
            onChange={(risks) => setDraftContent({ ...draftContent, risks })}
          />

          <section id="custom-sections">
            <SectionHeading number="12" title="Custom Sections" />
            <CustomSections
              sections={draftContent.customSections ?? []}
              editable
              onChange={(customSections) =>
                setDraftContent({ ...draftContent, customSections })
              }
            />
          </section>

          <section id="custom-blocks">
            <SectionHeading number="13" title="Structured Sections" />
            <CustomBlocksSection
              blocks={draftContent.customBlocks ?? []}
              editable
              onChange={(customBlocks) => setDraftContent({ ...draftContent, customBlocks })}
            />
          </section>
        </main>
      </div>

      <FloatingChat
        startupId={chatStartupId}
        content={committedContent}
        disabled={dirty}
        disabledReason="Save or Review with AI before chatting — chat uses the committed blueprint."
        onContentPatch={handleContentPatch}
        onContentReplace={handleContentReplace}
        onSuggestion={handleChatSuggestion}
        onReady={(api) => {
          chatNoteRef.current = api.appendSystemNote
        }}
      />

      <SuggestionReviewModal
        open={reviewOpen}
        loading={reviewLoading}
        title={reviewMode === 'chat' ? 'AI chat suggestion' : 'Review your edits'}
        analysis={analysis}
        draft={draftContent}
        onApplySuggestion={() => void handleApplySuggestion()}
        onKeepEdits={() => void handleKeepEdits()}
        onCancel={() => {
          setReviewOpen(false)
          setAnalysis(null)
          if (reviewMode === 'chat' && committedContent) {
            setDraftContent(committedContent)
          }
        }}
      />

      <VersionHistoryPanel
        open={historyOpen}
        startupId={chatStartupId}
        currentVersionNumber={versionNumber}
        onClose={() => setHistoryOpen(false)}
        onRestore={(content) => void handleRestore(content)}
        onCompare={handleCompare}
      />

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
