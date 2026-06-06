'use client'

import { useState } from 'react'
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
import { LoaderScreen } from './components/loader-screen'
import {
  WHY_NOW_ITEMS,
  WHY_WIN_ITEMS,
  BIGGEST_RISK,
  EXPECTED_OUTCOME,
  BLUEPRINT_CUSTOMER,
  BLUEPRINT_MODEL,
  BLUEPRINT_MVP,
  BLUEPRINT_POSITIONING,
  CONFIDENCE_ROWS,
  ASSUMPTIONS,
  CRITICAL_RISKS,
  TRUST_SIGNALS,
  FOUNDATION_CATEGORIES,
  MARKET_SIZING_CARDS,
  MARKET_SIZING_BASIS,
} from './summary.data'
import type { LabelValueRow } from './summary.types'

// ── Shared primitives ────────────────────────────────────────────────────────

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

// ── Inner sections ───────────────────────────────────────────────────────────

function LabelValueList({ rows }: { rows: LabelValueRow[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {rows.map((row) => (
        <li key={row.label}>
          <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-0.5">
            {row.label}
          </p>
          <p className="text-[13px] text-foreground/70 leading-snug font-medium">{row.value}</p>
        </li>
      ))}
    </ul>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function SummaryStep() {
  const router = useRouter()
  const { idea } = useFounderSessionStore()
  const [loaderDone, setLoaderDone] = useState(false)
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const handleGenerate = () => router.push('/generating')
  const handleRefine = () => router.push('/founder-session')

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary pb-[76px]">
      {!loaderDone && <LoaderScreen onDone={() => setLoaderDone(true)} />}

      <AnimatePresence>
        {loaderDone && (
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
                        82/100
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-[5px] bg-card border border-border rounded-md">
                      <span className="text-[9px] text-foreground/30 uppercase tracking-widest font-semibold hidden sm:block">
                        Confidence
                      </span>
                      <span className="text-[12px] font-bold text-primary tabular-nums leading-none">
                        87%
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-[5px] bg-primary/10 border border-primary/20 rounded-full text-[10px] font-semibold text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      Strong Opportunity
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
                {/* ── Opportunity assessment ── */}
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
                      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                        <div>
                          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold mb-1">
                            OPPORTUNITY ASSESSMENT
                          </p>
                          <h1 className="text-[38px] font-bold text-foreground tracking-tight leading-none">
                            Verdict: Strong Opportunity
                          </h1>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
                          <span className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold leading-none mb-1">
                            Confidence
                          </span>
                          <span className="text-[42px] font-bold text-primary tabular-nums leading-none tracking-tight">
                            87
                            <span className="text-[18px] font-medium text-primary/50">%</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-border">
                        <div className="lg:pr-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Why Now
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {WHY_NOW_ITEMS.map((item) => (
                              <li key={item.text} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                                <span className="text-[12px] text-foreground/55 leading-snug">
                                  {item.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="lg:px-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Why It Can Win
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {WHY_WIN_ITEMS.map((item) => (
                              <li key={item.text} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                                <span className="text-[12px] text-foreground/55 leading-snug">
                                  {item.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="lg:px-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Biggest Risk
                          </p>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-[1px]" />
                            <span className="text-[12px] text-foreground/55 leading-snug">
                              {BIGGEST_RISK}
                            </span>
                          </div>
                        </div>

                        <div className="lg:pl-5">
                          <p className="text-[9px] text-foreground/28 uppercase tracking-widest font-semibold mb-2.5">
                            Expected Outcome
                          </p>
                          <div className="bg-primary/[0.06] border border-primary/12 rounded-lg px-3 py-2.5">
                            <p className="text-[12px] text-foreground/55 leading-snug">
                              {EXPECTED_OUTCOME}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Startup blueprint ── */}
                <section>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-[13px] font-semibold text-foreground/75 tracking-tight">
                      Startup Blueprint
                    </h2>
                    <span className="text-[11px] text-foreground/22">
                      Customer · Model · Product · Position
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Customer Profile</SectionLabel>
                      <LabelValueList rows={BLUEPRINT_CUSTOMER} />
                    </SummaryCard>

                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Business Model</SectionLabel>
                      <LabelValueList rows={BLUEPRINT_MODEL} />
                    </SummaryCard>

                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Recommended MVP</SectionLabel>
                      <ul className="flex flex-col gap-2">
                        {BLUEPRINT_MVP.map((text, idx) => (
                          <li key={text} className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                              <span className="text-[9px] font-bold text-primary tabular-nums">
                                {idx + 1}
                              </span>
                            </span>
                            <span className="text-[13px] text-foreground/65 font-medium">{text}</span>
                          </li>
                        ))}
                      </ul>
                    </SummaryCard>

                    <SummaryCard className="p-4 col-span-1">
                      <SectionLabel>Competitive Position</SectionLabel>
                      <LabelValueList rows={BLUEPRINT_POSITIONING} />
                    </SummaryCard>
                  </div>
                </section>

                {/* ── Decision intelligence ── */}
                <section>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-[13px] font-semibold text-foreground/75 tracking-tight">
                      Decision Intelligence
                    </h2>
                    <span className="text-[11px] text-foreground/22">
                      Confidence · Assumptions · Risks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SummaryCard className="p-5">
                      <SectionLabel>Research Confidence</SectionLabel>
                      <div className="flex flex-col gap-0">
                        {CONFIDENCE_ROWS.map((row) => (
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
                          87
                          <span className="text-[13px] text-primary/50 font-medium">%</span>
                        </span>
                      </div>
                    </SummaryCard>

                    <SummaryCard className="p-5">
                      <div className="mb-4 pb-4 border-b border-border">
                        <SectionLabel>What Must Be True</SectionLabel>
                        <ul className="flex flex-col gap-1.5">
                          {ASSUMPTIONS.map((item) => (
                            <li key={item.text} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-primary/70 shrink-0" />
                              <span className="text-[12px] text-foreground/55 leading-none">
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <SectionLabel>Biggest Risks</SectionLabel>
                        <ul className="flex flex-col gap-2">
                          {CRITICAL_RISKS.map((item) => (
                            <li key={item.text} className="flex items-center gap-2">
                              <AlertTriangle
                                className={cn(
                                  'w-3 h-3 shrink-0',
                                  item.severity === 'high'
                                    ? 'text-amber-400'
                                    : 'text-amber-600/55',
                                )}
                              />
                              <span className="text-[12px] text-foreground/55 leading-none flex-1">
                                {item.text}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-[0.06em] uppercase shrink-0',
                                  item.severity === 'high'
                                    ? 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
                                    : 'bg-amber-950/40 text-amber-700/60 border border-amber-900/40',
                                )}
                              >
                                {item.severity === 'high' ? 'High' : 'Medium'}
                              </span>
                            </li>
                          ))}
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

                      <div className="mt-5 pt-4 border-t border-border">
                        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">
                          Market Sizing Analysis
                        </p>
                        <p className="text-[11px] text-foreground/30 leading-relaxed mb-4">
                          Xenysis estimates market potential using industry benchmarks, competitor
                          positioning, market segmentation, and founder session inputs.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                          {MARKET_SIZING_CARDS.map((card) => (
                            <div
                              key={card.label}
                              className="bg-background border border-border rounded-lg px-3.5 py-3"
                            >
                              <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-primary mb-0.5">
                                {card.label}
                              </p>
                              <p className="text-[10px] text-foreground/22 mb-2 leading-none">
                                {card.abbr}
                              </p>
                              <p className="text-[26px] font-bold text-foreground tabular-nums leading-none tracking-tight mb-2">
                                {card.value}
                              </p>
                              <p className="text-[11px] text-foreground/35 leading-snug">
                                {card.description}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-foreground/35">
                            Market Sizing Confidence
                          </span>
                          <span className="flex-1 border-b border-dotted border-border" />
                          <span className="text-[13px] font-semibold text-primary tabular-nums">
                            81%
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                          <span className="text-[10px] text-foreground/22">Based on:</span>
                          {MARKET_SIZING_BASIS.map((item) => (
                            <span
                              key={item.text}
                              className="text-[10px] text-foreground/30 flex items-center gap-1"
                            >
                              <span className="w-[3px] h-[3px] rounded-full bg-foreground/20 shrink-0" />
                              {item.text}
                            </span>
                          ))}
                        </div>

                        <p className="text-[10px] text-foreground/20 leading-relaxed italic">
                          Market sizing estimates are directional indicators, not guarantees. Actual
                          market opportunity depends on execution, adoption, competition, and market
                          conditions.
                        </p>
                      </div>
                    </SummaryCard>
                  )}
                </div>

                {/* ── Generate startup foundation ── */}
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
      </AnimatePresence>
    </div>
  )
}
