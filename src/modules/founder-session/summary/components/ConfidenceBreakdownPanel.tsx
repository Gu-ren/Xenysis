'use client'

import { cn } from '@/lib/utils'
import type { ConfidenceBreakdown, AssessmentTier, UnderstandingCategory } from '../../services/opportunity'

interface ConfidenceBreakdownPanelProps {
  breakdown:       ConfidenceBreakdown
  confidenceScore: number
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

const CATEGORY_ORDER: UnderstandingCategory[] = [
  'problem', 'customer', 'solution',
  'market', 'pricing', 'competition', 'risks', 'founder_fit',
]

function tierColor(tier: AssessmentTier): string {
  return {
    validated:        'text-primary',
    assumption_based: 'text-amber-400',
    gap:              'text-red-400',
    unknown:          'text-foreground/25',
  }[tier]
}

function tierDot(tier: AssessmentTier): string {
  return {
    validated:        'bg-primary',
    assumption_based: 'bg-amber-400',
    gap:              'bg-red-400',
    unknown:          'bg-foreground/20',
  }[tier]
}

function strengthLabel(strength: number): string {
  const labels: Record<number, string> = {
    1: 'Assumption',
    2: 'Anecdotal',
    3: 'Conversations',
    4: 'Interviews',
    5: 'Customers',
    6: 'Revenue data',
  }
  return labels[strength] ?? 'Unknown'
}

export function ConfidenceBreakdownPanel({ breakdown, confidenceScore }: ConfidenceBreakdownPanelProps) {
  const categoryMap = new Map(breakdown.categories.map((c) => [c.category, c]))
  const evidenceCount = breakdown.categories.filter((c) => c.tier === 'validated').length

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-primary mb-3">
        Evidence Quality
      </span>

      <div className="flex flex-col gap-0">
        {CATEGORY_ORDER.map((cat) => {
          const entry = categoryMap.get(cat)
          if (!entry) return null

          return (
            <div
              key={cat}
              className="flex items-center gap-2 py-[7px] border-b border-border last:border-b-0"
            >
              {/* Tier dot */}
              <span
                className={cn('w-1.5 h-1.5 rounded-full shrink-0', tierDot(entry.tier))}
              />

              {/* Category label */}
              <span className="text-[12px] text-foreground/45 shrink-0 w-[100px]">
                {CATEGORY_LABELS[cat]}
              </span>

              {/* Dotted spacer */}
              <span className="flex-1 border-b border-dotted border-border" />

              {/* Strength label */}
              <span className="text-[10px] text-foreground/28 shrink-0 w-[90px] text-right">
                {strengthLabel(entry.evidenceStrength)}
              </span>

              {/* Quality score */}
              <span
                className={cn(
                  'text-[13px] font-semibold tabular-nums shrink-0 w-8 text-right',
                  tierColor(entry.tier),
                )}
              >
                {entry.qualityScore}
              </span>
            </div>
          )
        })}
      </div>

      {/* Overall confidence footer */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">
            Overall Confidence
          </span>
          <span className="text-[26px] font-bold text-primary tabular-nums leading-none">
            {confidenceScore}
            <span className="text-[13px] text-primary/50 font-medium">%</span>
          </span>
        </div>

        {/* Validated category count */}
        <p className="text-[10px] text-foreground/22 mt-1.5 leading-none">
          Based on {evidenceCount} of 8 categories with validated evidence · evidence baseline: {breakdown.computedScore}%
        </p>

        {/* Confidence note (shown when final score differs significantly from baseline) */}
        {breakdown.adjustmentRationale && (
          <p className="mt-2 text-[11px] text-foreground/40 leading-relaxed italic border-t border-border pt-2">
            {breakdown.adjustmentRationale}
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-3">
        {(
          [
            { tier: 'validated'        as AssessmentTier, label: 'Evidence' },
            { tier: 'assumption_based' as AssessmentTier, label: 'Assumption' },
            { tier: 'gap'              as AssessmentTier, label: 'Gap' },
            { tier: 'unknown'          as AssessmentTier, label: 'Unknown' },
          ] as const
        ).map(({ tier, label }) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span className={cn('w-1.5 h-1.5 rounded-full', tierDot(tier))} />
            <span className="text-[10px] text-foreground/28">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
