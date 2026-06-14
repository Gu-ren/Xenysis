'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, Info, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ValidationGapSummary, ValidationGap, UnderstandingCategory } from '../../services/opportunity'

interface ValidationGapListProps {
  summary: ValidationGapSummary
}

const CATEGORY_LABELS: Record<UnderstandingCategory, string> = {
  problem:     'Problem',
  customer:    'Customer',
  solution:    'Solution',
  market:      'Market',
  pricing:     'Pricing',
  competition: 'Competition',
  risks:       'Risks',
  founder_fit: 'Founder Fit',
}

function priorityConfig(priority: number) {
  if (priority === 1) return {
    label: 'Critical',
    icon:  AlertCircle,
    iconClass:   'text-red-400',
    badgeClass:  'bg-red-500/10 text-red-400 border-red-500/20',
    borderClass: 'border-red-500/15',
  }
  if (priority === 2) return {
    label: 'High',
    icon:  AlertTriangle,
    iconClass:   'text-amber-400',
    badgeClass:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderClass: 'border-amber-500/15',
  }
  if (priority === 3) return {
    label: 'Medium',
    icon:  AlertTriangle,
    iconClass:   'text-amber-600/70',
    badgeClass:  'bg-amber-900/20 text-amber-600/80 border-amber-800/30',
    borderClass: 'border-amber-900/20',
  }
  if (priority === 4) return {
    label: 'Low',
    icon:  Info,
    iconClass:   'text-foreground/30',
    badgeClass:  'bg-foreground/[0.05] text-foreground/35 border-foreground/10',
    borderClass: 'border-foreground/8',
  }
  return {
    label: 'Info',
    icon:  Info,
    iconClass:   'text-foreground/20',
    badgeClass:  'bg-foreground/[0.03] text-foreground/25 border-foreground/8',
    borderClass: 'border-foreground/5',
  }
}

function overallRiskConfig(risk: ValidationGapSummary['overallGapRisk']) {
  return {
    critical: 'text-red-400',
    high:     'text-amber-400',
    medium:   'text-amber-600/80',
    low:      'text-foreground/35',
  }[risk]
}

function GapCard({ gap }: { gap: ValidationGap }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = priorityConfig(gap.priority)
  const Icon = cfg.icon

  return (
    <div
      className={cn(
        'flex-none w-[280px] bg-background border rounded-xl p-4',
        cfg.borderClass,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-3.5 h-3.5 shrink-0 mt-[1px]', cfg.iconClass)} />
          <span className="text-[12px] font-semibold text-foreground/75">
            {CATEGORY_LABELS[gap.category]}
          </span>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-1.5 py-[3px] rounded text-[9px] font-semibold tracking-[0.06em] uppercase border shrink-0',
            cfg.badgeClass,
          )}
        >
          {cfg.label}
        </span>
      </div>

      {/* Gap description */}
      <p className="text-[11px] text-foreground/45 leading-relaxed mb-3">
        {gap.gapDescription}
      </p>

      {/* Suggested action */}
      <div className="bg-foreground/[0.03] border border-foreground/[0.05] rounded-lg px-3 py-2 mb-2">
        <p className="text-[9px] font-semibold tracking-[0.12em] uppercase text-foreground/22 mb-1">
          Suggested Action
        </p>
        <p className="text-[11px] text-foreground/55 leading-relaxed">
          {gap.suggestedAction}
        </p>
      </div>

      {/* Risk expandable */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-foreground/25 hover:text-foreground/45 transition-colors"
      >
        <ChevronDown
          className={cn('w-3 h-3 transition-transform duration-200', expanded && 'rotate-180')}
        />
        Risk if unfilled
      </button>

      {expanded && (
        <p className="mt-2 text-[11px] text-foreground/35 leading-relaxed border-t border-border pt-2 italic">
          {gap.riskIfUnfilled}
        </p>
      )}
    </div>
  )
}

interface GapGroupProps {
  title:       string
  titleClass:  string
  gaps:        ValidationGap[]
}

function GapGroup({ title, titleClass, gaps }: GapGroupProps) {
  if (gaps.length === 0) return null

  return (
    <div className="mb-5 last:mb-0">
      <p className={cn('text-[10px] font-semibold tracking-[0.16em] uppercase mb-2', titleClass)}>
        {title}
      </p>
      <div className="overflow-x-auto pb-2 -mx-6 px-6">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {gaps.map((gap) => (
            <GapCard key={gap.category} gap={gap} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ValidationGapList({ summary }: ValidationGapListProps) {
  if (summary.gaps.length === 0) return null

  const criticalGaps      = summary.gaps.filter((g) => g.priority <= 2)
  const recommendedGaps   = summary.gaps.filter((g) => g.priority === 3 || g.priority === 4)
  const additionalGaps    = summary.gaps.filter((g) => g.priority === 5)

  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-[13px] font-semibold text-foreground/75 tracking-tight">
          Validation Gaps
        </h2>
        <span className={cn('text-[11px] font-medium', overallRiskConfig(summary.overallGapRisk))}>
          {summary.gaps.length} gaps · {summary.overallGapRisk.charAt(0).toUpperCase() + summary.overallGapRisk.slice(1)} overall risk
        </span>
        <span className="text-[11px] text-foreground/20 ml-auto shrink-0">
          {summary.evidenceStrength}
        </span>
      </div>

      <GapGroup
        title="Critical Gaps"
        titleClass="text-red-400/70"
        gaps={criticalGaps}
      />
      <GapGroup
        title="Recommended Validation"
        titleClass="text-amber-500/60"
        gaps={recommendedGaps}
      />
      <GapGroup
        title="Additional Research"
        titleClass="text-foreground/25"
        gaps={additionalGaps}
      />
    </section>
  )
}
