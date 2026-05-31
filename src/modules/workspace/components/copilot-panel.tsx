'use client'

import Image from 'next/image'
import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react'
import { NODE_TYPE_COLORS } from '../constants'
import type { WorkspaceGraph, WorkspaceAsset } from '../types'

// ── Component ─────────────────────────────────────────────────────────────────

interface CopilotPanelProps {
  graph: WorkspaceGraph | null
}

export function CopilotPanel({ graph }: CopilotPanelProps) {
  const blocked       = graph?.assets.filter((a) => a.status === 'needs-config') ?? []
  const opportunities = graph?.assets.filter((a) => a.aiRecommendation).slice(0, 4) ?? []
  const nextAction    = blocked.length > 0 ? blocked[0] : null

  return (
    <aside
      className="flex flex-col h-full border-l border-border bg-background shrink-0 overflow-y-auto"
      style={{ width: 300 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border shrink-0">
        <Image src="/logo.svg" alt="Xenysis" width={14} height={14} className="rounded-sm shrink-0" />
        <p className="text-[9px] font-mono font-semibold text-muted/50 tracking-widest uppercase">
          AI Copilot
        </p>
      </div>

      <div className="flex flex-col gap-0 flex-1 overflow-y-auto">
        {/* Next action */}
        {nextAction && (
          <Section title="Next Action">
            <NextActionCard asset={nextAction} />
          </Section>
        )}

        {/* Blocked */}
        {blocked.length > 0 && (
          <Section title={`Blocked · ${blocked.length}`}>
            <div className="flex flex-col gap-1.5">
              {blocked.map((asset) => (
                <BlockedItem key={asset.id} asset={asset} />
              ))}
            </div>
          </Section>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <Section title={`Opportunities · ${opportunities.length}`}>
            <div className="flex flex-col gap-1.5">
              {opportunities.map((asset) => (
                <OpportunityItem key={asset.id} asset={asset} />
              ))}
            </div>
          </Section>
        )}

        {/* Empty state */}
        {!graph && (
          <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 gap-3 text-center">
            <Sparkles size={20} strokeWidth={1.5} style={{ color: 'rgba(79,250,176,0.3)' }} />
            <p className="text-xs text-muted/50">Loading AI insights…</p>
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-border/60">
      <p className="text-[9px] font-mono font-semibold text-muted/50 tracking-widest uppercase mb-2">
        {title}
      </p>
      {children}
    </div>
  )
}

// ── Next action card ──────────────────────────────────────────────────────────

function NextActionCard({ asset }: { asset: WorkspaceAsset }) {
  const colors = NODE_TYPE_COLORS[asset.nodeType]
  const Icon   = asset.icon

  return (
    <div
      className="rounded-xl p-3 border"
      style={{ background: 'rgba(79,250,176,0.04)', borderColor: 'rgba(79,250,176,0.15)' }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="flex items-center justify-center w-5 h-5 rounded shrink-0"
          style={{ background: colors.bg }}
        >
          <Icon style={{ width: 9, height: 9, color: colors.accent }} strokeWidth={2} />
        </div>
        <span className="text-xs font-semibold text-foreground truncate">{asset.title}</span>
      </div>
      <p className="text-[10px] text-muted leading-relaxed">
        {asset.description}
      </p>
      {asset.aiRecommendation && (
        <p className="text-[10px] text-primary/80 leading-relaxed mt-1.5 font-medium">
          {asset.aiRecommendation.slice(0, 80)}…
        </p>
      )}
      <div className="flex items-center justify-end mt-2">
        <span className="text-[8px] font-mono text-primary/50 uppercase tracking-wider">
          Configure →
        </span>
      </div>
    </div>
  )
}

// ── Blocked item ──────────────────────────────────────────────────────────────

function BlockedItem({ asset }: { asset: WorkspaceAsset }) {
  const colors = NODE_TYPE_COLORS[asset.nodeType]
  const Icon   = asset.icon

  return (
    <div className="flex items-start gap-2">
      <AlertTriangle size={10} strokeWidth={2} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon style={{ width: 8, height: 8, color: colors.accent, flexShrink: 0 }} strokeWidth={2} />
          <span className="text-[10px] font-semibold text-foreground truncate">{asset.title}</span>
        </div>
        <p className="text-[9px] text-muted/60 truncate mt-0.5">{asset.description}</p>
      </div>
    </div>
  )
}

// ── Opportunity item ──────────────────────────────────────────────────────────

function OpportunityItem({ asset }: { asset: WorkspaceAsset }) {
  const colors = NODE_TYPE_COLORS[asset.nodeType]
  const Icon   = asset.icon

  return (
    <div className="flex items-start gap-2">
      <TrendingUp size={10} strokeWidth={2} style={{ color: '#4ffab0', marginTop: 2, flexShrink: 0, opacity: 0.7 }} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon style={{ width: 8, height: 8, color: colors.accent, flexShrink: 0 }} strokeWidth={2} />
          <span className="text-[10px] font-semibold text-foreground truncate">{asset.title}</span>
        </div>
        <p className="text-[9px] text-muted/60 leading-relaxed mt-0.5 line-clamp-2">
          {asset.aiRecommendation}
        </p>
      </div>
    </div>
  )
}
