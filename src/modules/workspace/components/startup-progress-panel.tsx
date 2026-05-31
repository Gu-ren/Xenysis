'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, CircleDot, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STAGES } from '../constants/journey'
import type { WorkspaceGraph } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeStageCompletion(
  assetIds: readonly string[],
  graph: WorkspaceGraph,
): { generated: number; total: number; pct: number } {
  if (assetIds.length === 0) return { generated: 1, total: 1, pct: 100 }
  const generated = assetIds.filter((id) =>
    graph.assets.find((a) => a.id === id)?.status === 'generated'
  ).length
  const total = assetIds.length
  return { generated, total, pct: Math.round((generated / total) * 100) }
}

type StageStatus = 'completed' | 'active' | 'upcoming'

function stageStatus(pct: number, prevAllDone: boolean): StageStatus {
  if (pct === 100) return 'completed'
  if (prevAllDone) return 'active'
  return 'upcoming'
}

// ── Component ─────────────────────────────────────────────────────────────────

interface StartupProgressPanelProps {
  graph: WorkspaceGraph | null
}

export function StartupProgressPanel({ graph }: StartupProgressPanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  const completions = STAGES.map((s) =>
    graph ? computeStageCompletion(s.assetIds, graph) : { generated: 0, total: 1, pct: 0 }
  )

  // Simple readiness derived from graph asset statuses
  const allAssets = graph?.assets ?? []
  const totalAssets = allAssets.length
  const generatedAssets = allAssets.filter((a) => a.status === 'generated').length
  const launchReadiness = totalAssets > 0 ? Math.round((generatedAssets / totalAssets) * 100) : 0

  const billingAssets = allAssets.filter((a) =>
    a.id === 'stripe-integration' || a.id === 'billing-service' || a.id === 'payment-workflow'
  )
  const billingGenerated = billingAssets.filter((a) => a.status === 'generated').length
  const revenueReadiness = billingAssets.length > 0
    ? Math.round((billingGenerated / billingAssets.length) * 100)
    : 0

  if (collapsed) {
    return (
      <aside
        className="flex flex-col h-full border-r border-border bg-background shrink-0"
        style={{ width: 40 }}
      >
        <button
          onClick={() => setCollapsed(false)}
          title="Expand progress panel"
          className="flex items-center justify-center w-full h-10 text-muted hover:text-foreground transition-colors border-b border-border shrink-0"
        >
          <ChevronRight size={13} strokeWidth={1.75} />
        </button>
        <div className="flex flex-1 items-center justify-center overflow-hidden">
          <span
            className="text-[9px] font-mono font-semibold text-muted/25 tracking-widest uppercase whitespace-nowrap select-none"
            style={{ transform: 'rotate(90deg)' }}
          >
            Progress
          </span>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className="flex flex-col h-full border-r border-border bg-background shrink-0 overflow-y-auto"
      style={{ width: 220 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border shrink-0">
        <p className="text-[9px] font-mono font-semibold text-muted/50 tracking-widest uppercase">
          Startup Progress
        </p>
        <button
          onClick={() => setCollapsed(true)}
          title="Collapse progress panel"
          className="flex items-center justify-center w-5 h-5 rounded text-muted/35 hover:text-muted transition-colors shrink-0"
        >
          <ChevronLeft size={12} strokeWidth={1.75} />
        </button>
      </div>

      {/* Stage list */}
      <div className="flex flex-col py-2 flex-1">
        {STAGES.map((stage, i) => {
          const comp = completions[i]
          const prevDone = completions.slice(0, i).every((c) => c.pct === 100)
          const status: StageStatus = stageStatus(comp.pct, prevDone)

          return (
            <StageRow
              key={stage.id}
              label={stage.label}
              pct={comp.pct}
              status={status}
              isLast={i === STAGES.length - 1}
            />
          )
        })}
      </div>

      {/* Readiness scores */}
      <div className="px-4 py-3 border-t border-border shrink-0 flex flex-col gap-2.5">
        <ReadinessBar label="Launch Ready" pct={launchReadiness} />
        <ReadinessBar label="Revenue Ready" pct={revenueReadiness} />
      </div>
    </aside>
  )
}

// ── Stage row ─────────────────────────────────────────────────────────────────

function StageRow({
  label,
  pct,
  status,
  isLast,
}: {
  label: string
  pct: number
  status: StageStatus
  isLast: boolean
}) {
  const isActive    = status === 'active'
  const isCompleted = status === 'completed'
  const isUpcoming  = status === 'upcoming'

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 mx-2 rounded-xl transition-colors',
          isActive    ? 'bg-primary/6 border border-primary/12' : 'border border-transparent',
          isUpcoming  ? 'opacity-45' : '',
        )}
      >
        {/* Status icon */}
        <div className="shrink-0">
          {isCompleted && (
            <CheckCircle2 size={14} strokeWidth={1.75} style={{ color: '#4ffab0' }} />
          )}
          {isActive && (
            <CircleDot size={14} strokeWidth={1.75} style={{ color: '#4ffab0' }} />
          )}
          {isUpcoming && (
            <Circle size={14} strokeWidth={1.5} style={{ color: 'rgba(161,161,170,0.4)' }} />
          )}
        </div>

        {/* Label + progress */}
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <span
            className={cn(
              'text-xs font-medium truncate',
              isActive || isCompleted ? 'text-foreground' : 'text-muted/50',
            )}
          >
            {label}
          </span>

          {/* Progress bar — only for active stage */}
          {isActive && (
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: '#4ffab0', opacity: 0.7 }}
              />
            </div>
          )}
        </div>

        {/* Completion % */}
        <span
          className={cn(
            'text-[10px] font-mono shrink-0',
            isActive    ? 'text-primary font-semibold' :
            isCompleted ? 'text-primary/50' :
                          'text-muted/30',
          )}
        >
          {pct}%
        </span>
      </div>

      {/* Connector between stages */}
      {!isLast && (
        <div
          className="mx-5 shrink-0"
          style={{
            width: 1,
            height: 10,
            background: isCompleted
              ? 'rgba(79,250,176,0.25)'
              : 'rgba(255,255,255,0.06)',
          }}
        />
      )}
    </div>
  )
}

// ── Readiness bar ─────────────────────────────────────────────────────────────

function ReadinessBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-muted/50 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono font-semibold text-primary">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? '#4ffab0' : pct >= 50 ? '#f59e0b' : '#a1a1aa',
          }}
        />
      </div>
    </div>
  )
}
