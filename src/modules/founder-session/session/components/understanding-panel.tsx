'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUnderstanding } from '../hooks/use-understanding'
import {
  ORDERED_CATEGORIES,
  CATEGORY_DISPLAY,
  FOCUS_LABEL,
  type CategoryStatus,
  type UnderstandingCategory,
  type CategoryWarning,
  type FounderUnderstanding,
} from '../../types/understanding'

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusColor(status: CategoryStatus): string {
  if (status === 'complete') return '#4FFAB0'
  if (status === 'partial')  return '#F59E0B'
  return 'rgba(239,68,68,0.70)'
}

function statusIcon(status: CategoryStatus): string {
  if (status === 'complete') return '✓'
  if (status === 'partial')  return '~'
  return '⚠'
}

function labelColor(status: CategoryStatus): string {
  if (status === 'complete') return 'rgba(255,255,255,0.90)'
  if (status === 'partial')  return 'rgba(255,255,255,0.80)'
  return 'rgba(255,255,255,0.40)'
}

// ── Overall confidence bar ────────────────────────────────────────────────────

function OverallBar({ confidence }: { confidence: number }) {
  const barColor = confidence >= 75 ? '#4FFAB0' : confidence >= 40 ? '#F59E0B' : 'rgba(239,68,68,0.70)'
  return (
    <div className="px-5 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="font-semibold tracking-[-0.02em]"
          style={{ fontSize: 22, color: barColor }}
        >
          {confidence}%
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '-0.005em' }}>
          understood
        </span>
      </div>
      <div
        className="h-[4px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

// ── Current Focus card ────────────────────────────────────────────────────────

function CurrentFocusCard({ category }: { category: UnderstandingCategory }) {
  return (
    <div className="px-5 py-3 shrink-0">
      <div
        className="rounded-[8px] px-3.5 py-2.5"
        style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span
          className="block font-mono uppercase mb-1"
          style={{ fontSize: 9, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.28)' }}
        >
          Current Focus
        </span>
        <span
          className="tracking-[-0.01em] font-medium"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}
        >
          {FOCUS_LABEL[category]}
        </span>
      </div>
    </div>
  )
}

// ── Category row (two-line: label primary, confidence secondary) ───────────────

function CategoryRow({
  category,
  status,
  confidence,
  delay,
}: {
  category: UnderstandingCategory
  status: CategoryStatus
  confidence: number
  delay: number
}) {
  const { label } = CATEGORY_DISPLAY[category]
  const secText = confidence > 0 ? `${confidence}% confidence` : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-2.5 py-[9px]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Status icon — fixed 16px column, vertically centred to label */}
      <span
        className="shrink-0 font-mono font-bold leading-[1.4] mt-px"
        style={{
          fontSize: status === 'complete' ? 13 : 12,
          color: statusColor(status),
          width: 16,
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        {statusIcon(status)}
      </span>

      {/* Label + secondary */}
      <div className="flex flex-col min-w-0">
        <span
          className="tracking-[-0.01em] leading-[1.4]"
          style={{ fontSize: 13, color: labelColor(status) }}
        >
          {label}
        </span>
        {secText && (
          <span
            className="font-mono leading-[1.3]"
            style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}
          >
            {secText}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ── Empty / pre-session state ─────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-start justify-center h-full px-6 pb-8"
    >
      <p
        className="font-semibold tracking-[-0.02em] mb-2"
        style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }}
      >
        Xenysis is listening.
      </p>
      <p
        className="leading-relaxed"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 240, lineHeight: 1.65 }}
      >
        Answer a few questions to begin building your startup model.
      </p>
    </motion.div>
  )
}

// ── Active state ──────────────────────────────────────────────────────────────

function ActiveState({ understanding }: { understanding: FounderUnderstanding }) {
  const { overallConfidence, weakestCategory, categories } = understanding
  const categoryRows = ORDERED_CATEGORIES.map((cat) => ({
    category: cat,
    status: categories[cat].status,
    confidence: categories[cat].confidence,
  }))

  return (
    <div className="flex flex-col h-full">
      <OverallBar confidence={overallConfidence} />
      {weakestCategory && <CurrentFocusCard category={weakestCategory} />}
      <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ paddingTop: weakestCategory ? 4 : 8 }}>
        {categoryRows.map(({ category, status, confidence }, i) => (
          <CategoryRow
            key={category}
            category={category}
            status={status}
            confidence={confidence}
            delay={i * 0.04}
          />
        ))}
      </div>
    </div>
  )
}

// ── Complete state ────────────────────────────────────────────────────────────

function WarningRow({ warning }: { warning: CategoryWarning }) {
  const { label } = CATEGORY_DISPLAY[warning.category]
  return (
    <div
      className="flex items-start gap-2.5 py-[9px]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span
        className="shrink-0 font-mono font-bold leading-[1.4] mt-px"
        style={{ fontSize: 12, color: 'rgba(239,68,68,0.70)', width: 16, textAlign: 'center', display: 'inline-block' }}
      >
        ⚠
      </span>
      <div className="flex flex-col min-w-0">
        <span
          className="tracking-[-0.01em] leading-[1.4]"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </span>
        <span
          className="font-mono leading-[1.3]"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)', marginTop: 1 }}
        >
          Needs validation
        </span>
      </div>
    </div>
  )
}

function CompleteState({
  understanding,
  onGenerateReport,
}: {
  understanding: FounderUnderstanding
  onGenerateReport: () => void
}) {
  const { categories, warnings } = understanding
  const requiredCategories: UnderstandingCategory[] = ['problem', 'customer', 'solution']

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Completion message */}
      <div
        className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p
          className="tracking-[-0.01em]"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 6 }}
        >
          Xenysis has enough to generate your Opportunity Assessment.
        </p>
        <p
          className="tracking-[-0.01em]"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}
        >
          {warnings.length > 0
            ? 'Your problem, customer, and solution are well understood. The gaps below can be addressed after your initial analysis.'
            : 'Your problem, customer, and solution are well understood. Proceed when ready.'}
        </p>
      </div>

      {/* Category list — scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        {/* Required: always ✓ in complete state */}
        {requiredCategories.map((cat, i) => (
          <CategoryRow
            key={cat}
            category={cat}
            status={categories[cat].status}
            confidence={categories[cat].confidence}
            delay={i * 0.06}
          />
        ))}

        {/* Validation gaps */}
        {warnings.length > 0 && (
          <div className="mt-4">
            <span
              className="block font-mono uppercase mb-1"
              style={{ fontSize: 9, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)' }}
            >
              Validation Gaps
            </span>
            {warnings.map((w) => (
              <WarningRow key={w.category} warning={w} />
            ))}
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={onGenerateReport}
          className="w-full flex items-center justify-center gap-2 rounded-[8px] h-9 font-semibold tracking-[-0.01em] transition-all duration-200 cursor-pointer"
          style={{
            fontSize: 13,
            background: '#4FFAB0',
            color: '#0A0A0A',
          }}
        >
          Generate Founder Report
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ── Panel root ────────────────────────────────────────────────────────────────

export function UnderstandingPanel() {
  const router = useRouter()
  const understanding = useUnderstanding()
  const { overallConfidence, isComplete, weakestCategory } = understanding

  const isPreSession = weakestCategory === null && overallConfidence === 0

  const handleGenerateReport = () => {
    router.push('/session-summary')
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F0F0F' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          height: 44,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: '#111111',
        }}
      >
        <span className="text-foreground text-[13px] font-semibold tracking-[-0.015em]">
          Startup Understanding
        </span>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.span
              key="complete-badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(79,250,176,0.12)',
                color: '#4FFAB0',
                border: '1px solid rgba(79,250,176,0.25)',
                letterSpacing: '0.03em',
              }}
            >
              ✓ Complete
            </motion.span>
          ) : (
            <motion.span
              key="live-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[10px]"
              style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}
            >
              LIVE
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Body — three states */}
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="complete"
            className="flex-1 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CompleteState
              understanding={understanding}
              onGenerateReport={handleGenerateReport}
            />
          </motion.div>
        ) : isPreSession ? (
          <motion.div
            key="empty"
            className="flex-1 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="active"
            className="flex-1 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <ActiveState understanding={understanding} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
