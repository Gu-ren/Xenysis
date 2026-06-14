'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScoreBreakdown } from '../../services/opportunity'

interface ScoreBreakdownPanelProps {
  breakdown:        ScoreBreakdown
  opportunityScore: number
}

const DIMENSION_LABELS: Record<keyof ScoreBreakdown, string> = {
  problemStrength:      'Problem Strength',
  customerClarity:      'Customer Clarity',
  marketPotential:      'Market Potential',
  competitiveAdvantage: 'Competitive Advantage',
  founderFit:           'Founder Fit',
}

const DIMENSION_ORDER: (keyof ScoreBreakdown)[] = [
  'problemStrength',
  'customerClarity',
  'marketPotential',
  'competitiveAdvantage',
  'founderFit',
]

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex-1 h-1 bg-foreground/[0.06] rounded-full overflow-hidden">
      <div
        className="h-full bg-primary/60 rounded-full transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

export function ScoreBreakdownPanel({ breakdown, opportunityScore }: ScoreBreakdownPanelProps) {
  const [openRationale, setOpenRationale] = useState<keyof ScoreBreakdown | null>(null)

  return (
    <div className="mt-3 bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-primary">
          Score Breakdown
        </span>
        <span className="text-[10px] text-foreground/30 tabular-nums">
          Weighted · 5 dimensions
        </span>
      </div>

      <div className="divide-y divide-border">
        {DIMENSION_ORDER.map((key) => {
          const dim        = breakdown[key]
          const isOpen     = openRationale === key
          const toggleOpen = () => setOpenRationale(isOpen ? null : key)

          return (
            <div key={key} className="px-5 py-3">
              <div className="flex items-center gap-3">
                {/* Label + weight */}
                <div className="flex items-center gap-2 w-[200px] shrink-0">
                  <span className="text-[12px] text-foreground/60 font-medium">
                    {DIMENSION_LABELS[key]}
                  </span>
                  <span className="text-[9px] text-foreground/25 tabular-nums shrink-0">
                    {dim.weight}%
                  </span>
                </div>

                {/* Score bar */}
                <ScoreBar score={dim.score} />

                {/* Score */}
                <span className="text-[13px] font-semibold text-primary tabular-nums shrink-0 w-8 text-right">
                  {dim.score}
                </span>

                {/* Rationale toggle */}
                <button
                  onClick={toggleOpen}
                  className="shrink-0 text-foreground/20 hover:text-foreground/50 transition-colors"
                  aria-label="Toggle rationale"
                >
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
              </div>

              {isOpen && (
                <p className="mt-2 ml-[200px] text-[11px] text-foreground/45 leading-relaxed">
                  {dim.rationale}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Weighted total */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-foreground/[0.02]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">
            Weighted Total
          </span>
          <span className="text-[9px] text-foreground/20">
            (problem×0.25 + customer×0.25 + market×0.20 + competitive×0.15 + founder×0.15)
          </span>
        </div>
        <span className="text-[18px] font-bold text-primary tabular-nums leading-none">
          {opportunityScore}
          <span className="text-[11px] font-medium text-primary/50">/100</span>
        </span>
      </div>
    </div>
  )
}
