'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ChevronDown,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useFounderSessionStore } from '@/store/founder-session'
import { LoaderScreen, type LoaderStageEntry } from './components/loader-screen'
import { TRUST_SIGNALS, FOUNDATION_CATEGORIES } from './summary.constants'
import {
  fetchOpportunityAssessment,
  streamOpportunityGeneration,
  ApiError,
  type OpportunityAssessmentContent,
  type OpportunityAssessmentResponse,
  type SSEStageEvent,
  type Rating,
  type RecommendationAction,
  type KeyRisk,
} from '../services/opportunity'
import type { ConfidenceRow } from './summary.types'

// ── Data helpers ──────────────────────────────────────────────────────────────

function verdictLabel(action: RecommendationAction): string {
  switch (action) {
    case 'proceed':              return 'Strong Opportunity'
    case 'proceed_with_caution': return 'Proceed With Caution'
    case 'validate_first':       return 'Validate Before Building'
    case 'pivot':                return 'Consider a Pivot'
    case 'pass':                 return 'Pass on This Idea'
  }
}

function ratingToScore(r: Rating): number {
  switch (r) {
    case 'very_high': return 95
    case 'high':      return 85
    case 'medium':    return 70
    case 'low':       return 50
  }
}

function ratingLabel(r: Rating): string {
  return r === 'very_high' ? 'Very High' : r.charAt(0).toUpperCase() + r.slice(1)
}

function toSentences(text: string, max: number): string[] {
  const matches = text.match(/[^.!?]+[.!?]*/g) ?? [text]
  return matches
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max)
}

function topRisk(risks: KeyRisk[]): KeyRisk | undefined {
  const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return [...risks].sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3))[0]
}

function buildConfidenceRows(c: OpportunityAssessmentContent): ConfidenceRow[] {
  return [
    { label: 'Market Potential',     pct: c.marketPotential.score },
    { label: 'Founder Domain Fit',   pct: ratingToScore(c.founderFit.domainExpertise) },
    { label: 'Execution Capability', pct: ratingToScore(c.founderFit.executionCapability) },
    { label: 'Competitive Position', pct: ratingToScore(c.competitiveAdvantage.defensibility) },
    { label: 'Customer Access',      pct: ratingToScore(c.founderFit.customerAccess) },
  ]
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-3">
      {children}
    </span>
  )
}

function SummaryCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('bg-card border border-border rounded-xl', className)}>
      {children}
    </div>
  )
}

function LabelValueItem({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-[13px] text-foreground/70 leading-snug font-medium">{value}</p>
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SummaryStep() {
  const router = useRouter()
  const { idea, startupId, sessionId } = useFounderSessionStore()

  const [loaderDone, setLoaderDone]     = useState(false)
  const [stages, setStages]             = useState<LoaderStageEntry[]>([])
  const [progress, setProgress]         = useState(0)
  const [phase, setPhase]               = useState<'generating' | 'done' | 'error'>('generating')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [assessment, setAssessment]     = useState<OpportunityAssessmentResponse | null>(null)
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const hasStarted = useRef(false)

  // Upsert a stage entry by stageId — pending events are not shown in the UI.
  const upsertStage = useCallback((event: SSEStageEvent) => {
    if (event.state === 'pending') return
    setStages((prev) => {
      const idx   = prev.findIndex((s) => s.stageId === event.stageId)
      const entry: LoaderStageEntry = {
        stageId: event.stageId,
        label:   event.label,
        state:   event.state as 'active' | 'done',
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx]  = entry
        return next
      }
      return [...prev, entry]
    })
  }, [])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    async function init() {
      // Guard: store must have both IDs before generation can start.
      if (!startupId || !sessionId) {
        setErrorMessage(
          'Session context is missing. Return to the founder session to continue.',
        )
        setPhase('error')
        return
      }

      // Fast path: assessment already exists (page refresh / revisit).
      // Skip the loader entirely — render the report immediately.
      try {
        const existing = await fetchOpportunityAssessment(startupId)
        setAssessment(existing)
        setLoaderDone(true)
        setPhase('done')
        return
      } catch (e) {
        if (!(e instanceof ApiError && e.status === 404)) {
          setErrorMessage('Unable to load the opportunity assessment. Please try again.')
          setPhase('error')
          return
        }
        // 404 → no existing assessment, continue to generation
      }

      // Slow path: stream a new generation via SSE.
      try {
        await streamOpportunityGeneration(startupId, sessionId, {
          onStage:    upsertStage,
          onProgress: (pct) => setProgress(pct),
          onComplete: async (_artifactId, _versionId) => {
            try {
              const result = await fetchOpportunityAssessment(startupId)
              setAssessment(result)
              setProgress(100)
              setPhase('done')
            } catch {
              setErrorMessage(
                'Assessment was generated but could not be loaded. Please refresh the page.',
              )
              setPhase('error')
            }
          },
          onError: (_code, msg) => {
            setErrorMessage(
              msg || 'Opportunity assessment generation failed. Please try again.',
            )
            setPhase('error')
          },
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'An unexpected error occurred.'
        setErrorMessage(msg)
        setPhase('error')
      }
    }

    void init()
  }, [startupId, sessionId, upsertStage])

  const handleGenerate = () => router.push('/generating')
  const handleRefine   = () => router.push('/founder-session')

  const content = assessment?.content ?? null
  const verdict = content ? verdictLabel(content.recommendation.action) : ''
  const top      = content ? topRisk(content.keyRisks) : undefined

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary pb-[76px]">

      {/* ── Loader (unmounts once loaderDone = true) ── */}
      {!loaderDone && (
        <LoaderScreen
          stages={stages}
          progress={progress}
          done={phase !== 'generating'}
          onExited={() => setLoaderDone(true)}
          errorMessage={phase === 'error' ? errorMessage : null}
        />
      )}

      <AnimatePresence>

        {/* ── Success: full report ── */}
        {loaderDone && phase === 'done' && content && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* ── Header ── */}
            <header className="border-b border-border bg-background sticky top-0 z-40">
              <div className="max-w-[1400px] mx-auto px-6 pt-3 pb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <motion.div className="flex gap-2">
                    <Image
                      className="rounded-lg"
                      src="/logo.svg"
                      alt="Xenysis"
                      width={28}
                      height={28}
                      priority
                    />
                    <span className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                      Xenysis
                    </span>
                  </motion.div>
                  <div className="w-px h-4 bg-foreground/[0.07] shrink-0" />
                  <span className="text-[11px] text-foreground/30 font-medium hidden sm:block shrink-0">
                    Founder Decision Report
                  </span>
                  {idea && (
                    <span className="text-[11px] text-foreground/20 italic hidden md:block truncate max-w-[300px]">
                      &ldquo;{idea}&rdquo;
                    </span>
                  )}
                  <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
                    <div className="flex items-center gap-1.5 px-2 py-[5px] bg-card border border-border rounded-md">
                      <span className="text-[9px] text-foreground/30 uppercase tracking-widest font-semibold hidden sm:block">
                        Opportunity
                      </span>
                      <span className="text-[12px] font-bold text-primary tabular-nums leading-none">
                        {content.opportunityScore}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-[5px] bg-card border border-border rounded-md">
                      <span className="text-[9px] text-foreground/30 uppercase tracking-widest font-semibold hidden sm:block">
                        Confidence
                      </span>
                      <span className="text-[12px] font-bold text-primary tabular-nums leading-none">
                        {content.confidenceScore}%
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-[5px] bg-primary/10 border border-primary/20 rounded-full text-[10px] font-semibold text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {verdict}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-foreground/18 mt-1.5 leading-none">
                  Generated from market signals, competitor intelligence, startup benchmarks, and
                  Founder Session responses
                </p>
              </div>
            </header>

            {/* ── Page content ── */}
            <main className="max-w-[1400px] mx-auto px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5"
              >

                {/* ── Opportunity Assessment hero ── */}
                <section>
                  <div
                    className="relative rounded-2xl border border-primary/20 bg-background overflow-hidden"
                    style={{
                      boxShadow:
                        '0 0 60px 0 rgba(79,250,176,0.06), inset 0 0 0 1px rgba(79,250,176,0.12)',
                    }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-2xl" />

                    <div className="pl-7 pr-6 pt-6 pb-6">
                      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                        <div>
                          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold mb-1">
                            OPPORTUNITY ASSESSMENT
                          </p>
                          <h1 className="text-[38px] font-bold text-foreground tracking-tight leading-none">
                            Verdict: {verdict}
                          </h1>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
                          <span className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold leading-none mb-1">
                            Confidence
                          </span>
                          <span className="text-[42px] font-bold text-primary tabular-nums leading-none tracking-tight">
                            {content.confidenceScore}
                            <span className="text-[18px] font-medium text-primary/50">%</span>
                          </span>
                        </div>
                      </div>

                      {/* Executive summary */}
                      <p className="text-[13px] text-foreground/50 leading-relaxed mb-5 max-w-[800px]">
                        {content.executiveSummary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-border">
                        {/* Col 1: Market signals from narrative */}
                        <div className="lg:pr-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Market Signals
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {toSentences(content.marketPotential.narrative, 3).map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                                <span className="text-[12px] text-foreground/55 leading-snug">
                                  {s}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 2: Competitive differentiators */}
                        <div className="lg:px-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Why It Can Win
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {content.competitiveAdvantage.differentiators.map((d) => (
                              <li key={d} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                                <span className="text-[12px] text-foreground/55 leading-snug">
                                  {d}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 3: Top risk */}
                        <div className="lg:px-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Biggest Risk
                          </p>
                          {top && (
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-[1px]" />
                              <span className="text-[12px] text-foreground/55 leading-snug">
                                {top.description}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Col 4: Expected outcome */}
                        <div className="lg:pl-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Expected Outcome
                          </p>
                          <div className="bg-primary/[0.06] border border-primary/12 rounded-lg px-3 py-2.5">
                            <p className="text-[12px] text-foreground/55 leading-snug">
                              {content.recommendation.rationale}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Assessment Breakdown ── */}
                <section>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-[13px] font-semibold text-foreground/75 tracking-tight">
                      Assessment Breakdown
                    </h2>
                    <span className="text-[11px] text-foreground/22">
                      Market · Fit · Next Steps · Competitive Edge
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Market Potential */}
                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Market Potential</SectionLabel>
                      <ul className="flex flex-col gap-3.5">
                        <LabelValueItem
                          label="Market Size"
                          value={ratingLabel(content.marketPotential.size)}
                        />
                        <LabelValueItem
                          label="Growth Rate"
                          value={ratingLabel(content.marketPotential.growth)}
                        />
                        <LabelValueItem
                          label="Potential Score"
                          value={`${content.marketPotential.score}/100`}
                        />
                      </ul>
                    </SummaryCard>

                    {/* Founder Fit */}
                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Founder Fit</SectionLabel>
                      <ul className="flex flex-col gap-3.5">
                        <LabelValueItem
                          label="Domain Expertise"
                          value={ratingLabel(content.founderFit.domainExpertise)}
                        />
                        <LabelValueItem
                          label="Customer Access"
                          value={ratingLabel(content.founderFit.customerAccess)}
                        />
                        <LabelValueItem
                          label="Execution Capability"
                          value={ratingLabel(content.founderFit.executionCapability)}
                        />
                      </ul>
                    </SummaryCard>

                    {/* Next Steps */}
                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Next Steps</SectionLabel>
                      <ul className="flex flex-col gap-2">
                        {content.recommendation.nextSteps.map((step, idx) => (
                          <li key={step} className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-bold text-primary tabular-nums">
                                {idx + 1}
                              </span>
                            </span>
                            <span className="text-[13px] text-foreground/65 font-medium">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </SummaryCard>

                    {/* Competitive Edge */}
                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Competitive Edge</SectionLabel>
                      <ul className="flex flex-col gap-3.5">
                        <LabelValueItem
                          label="Moat"
                          value={content.competitiveAdvantage.moat ?? '—'}
                        />
                        <LabelValueItem
                          label="Defensibility"
                          value={ratingLabel(content.competitiveAdvantage.defensibility)}
                        />
                        <LabelValueItem
                          label="Top Advantage"
                          value={content.competitiveAdvantage.differentiators[0] ?? '—'}
                        />
                      </ul>
                    </SummaryCard>
                  </div>
                </section>

                {/* ── Decision Intelligence ── */}
                <section>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-[13px] font-semibold text-foreground/75 tracking-tight">
                      Decision Intelligence
                    </h2>
                    <span className="text-[11px] text-foreground/22">
                      Confidence · Validation · Risks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SummaryCard className="p-5">
                      <SectionLabel>Research Confidence</SectionLabel>
                      <div className="flex flex-col gap-0">
                        {buildConfidenceRows(content).map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center gap-2 py-[7px] border-b border-border last:border-b-0"
                          >
                            <span className="text-[12px] text-foreground/45 shrink-0 w-[148px]">
                              {row.label}
                            </span>
                            <span className="flex-1 border-b border-dotted border-border" />
                            <span className="text-[13px] font-semibold text-primary tabular-nums shrink-0">
                              {row.pct}%
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">
                          Overall Confidence
                        </span>
                        <span className="text-[26px] font-bold text-primary tabular-nums leading-none">
                          {content.confidenceScore}
                          <span className="text-[13px] text-primary/50 font-medium">%</span>
                        </span>
                      </div>
                    </SummaryCard>

                    <SummaryCard className="p-5">
                      <div className="mb-4 pb-4 border-b border-border">
                        <SectionLabel>What Must Be True</SectionLabel>
                        <ul className="flex flex-col gap-1.5">
                          {content.validationPlan.map((step) => (
                            <li key={step.action} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-primary/70 shrink-0" />
                              <span className="text-[12px] text-foreground/55 leading-none">
                                {step.action}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <SectionLabel>Biggest Risks</SectionLabel>
                        <ul className="flex flex-col gap-2">
                          {content.keyRisks.map((risk) => {
                            const isHigh =
                              risk.severity === 'critical' || risk.severity === 'high'
                            return (
                              <li key={risk.title} className="flex items-center gap-2">
                                <AlertTriangle
                                  className={cn(
                                    'w-3 h-3 shrink-0',
                                    isHigh ? 'text-amber-400' : 'text-amber-600/55',
                                  )}
                                />
                                <span className="text-[12px] text-foreground/55 leading-none flex-1">
                                  {risk.title}
                                </span>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-[0.06em] uppercase shrink-0',
                                    isHigh
                                      ? 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
                                      : 'bg-amber-950/40 text-amber-700/60 border border-amber-900/40',
                                  )}
                                >
                                  {isHigh ? 'High' : 'Medium'}
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </SummaryCard>
                  </div>
                </section>

                {/* ── Methodology accordion ── */}
                <div>
                  <button
                    onClick={() => setMethodologyOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-background border border-border rounded-xl hover:bg-card transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-primary">
                        Methodology
                      </span>
                      <span className="text-[11px] text-foreground/25">
                        How Xenysis Generated This Recommendation
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-foreground/20 transition-transform duration-200 shrink-0',
                        methodologyOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {methodologyOpen && (
                    <SummaryCard className="mt-1 px-5 py-4 rounded-t-none border-t-0">
                      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-8 flex-wrap">
                        {TRUST_SIGNALS.map((signal) => (
                          <li key={signal.text} className="flex items-center gap-2">
                            <span className="text-foreground/25">{signal.icon}</span>
                            <span className="text-[12px] text-foreground/45">{signal.text}</span>
                          </li>
                        ))}
                      </ul>
                    </SummaryCard>
                  )}
                </div>

                {/* ── Generate Startup Foundation CTA ── */}
                <section>
                  <div
                    className="rounded-2xl border border-primary/20 bg-background overflow-hidden"
                    style={{
                      boxShadow:
                        '0 0 40px 0 rgba(79,250,176,0.05), inset 0 0 0 1px rgba(79,250,176,0.10)',
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
                      <div className="p-7 sm:p-9">
                        <SectionLabel>Next Step</SectionLabel>
                        <h2 className="text-[28px] font-bold text-foreground tracking-tight leading-tight mb-2">
                          Generate Startup Foundation
                        </h2>
                        <p className="text-[13px] text-foreground/38 leading-relaxed mb-8 max-w-[440px]">
                          Transform your validated idea into a complete startup foundation. Xenysis
                          will generate the product structure, business model, application
                          architecture, and operational blueprint needed to begin building.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                          {FOUNDATION_CATEGORIES.map((category) => (
                            <div key={category.label}>
                              <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-primary/70 mb-2.5">
                                {category.label}
                              </p>
                              <ul className="flex flex-col gap-1.5">
                                {category.items.map((item) => (
                                  <li key={item} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                                    <span className="text-[13px] text-foreground/75 font-medium leading-none">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-7 sm:p-9 flex flex-col justify-center gap-4">
                        <button
                          onClick={handleGenerate}
                          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-primary hover:bg-primary-hover active:bg-primary/80 transition-colors rounded-xl text-[15px] font-bold text-background"
                        >
                          Generate Startup Foundation
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <p className="text-[11px] text-foreground/28 leading-relaxed text-center px-2">
                          This will create your startup workspace and generate the foundational
                          components of your product, system, and business.
                        </p>

                        <button
                          onClick={handleRefine}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-transparent hover:bg-foreground/[0.04] transition-colors border border-foreground/12 rounded-xl text-[13px] font-semibold text-foreground/55"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Refine Startup
                        </button>

                        <div className="mt-1 pt-4 border-t border-border">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-foreground/20">
                              Next
                            </span>
                            <span className="w-px h-3 bg-foreground/[0.07]" />
                            <span className="text-[13px] font-semibold text-foreground/55">
                              Launch Workspace
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-primary/60 ml-auto shrink-0" />
                          </div>
                          <p className="text-[11px] text-foreground/22 leading-relaxed mt-1.5">
                            View generated modules, architecture, workflows, and startup assets.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Footer ── */}
                <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rotate-45 rounded-[2px]" />
                    <span className="text-[11px] font-bold text-foreground/28 tracking-[0.12em] uppercase">
                      Xenysis
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/16 leading-relaxed max-w-[520px] sm:text-right">
                    This report is based on available market signals and founder inputs. Xenysis
                    provides decision support, not guarantees. Scores and recommendations do not
                    constitute financial or investment advice.
                  </p>
                </footer>
              </motion.div>
            </main>
          </motion.div>
        )}

        {/* ── Error state (rendered after loader exits) ── */}
        {loaderDone && phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="flex flex-col items-center gap-4 text-center max-w-[400px]">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <h2 className="text-[20px] font-semibold text-foreground">Assessment Failed</h2>
              <p className="text-[13px] text-foreground/45 leading-relaxed">
                {errorMessage ??
                  'An unexpected error occurred while generating your opportunity assessment.'}
              </p>
              <button
                onClick={handleRefine}
                className="mt-2 inline-flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl text-[13px] font-semibold text-foreground/70 hover:bg-foreground/[0.04] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Return to Founder Session
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
