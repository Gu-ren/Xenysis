'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { X, Pencil, RefreshCw, Copy, Check, Code2, MonitorPlay } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from '../constants'
import { generateAssetPreview } from '../services/generate-preview'
import type { WorkspaceAsset, WorkspaceGraph } from '../types'

// ── Types ──────────────────────────────────────────────────────────────────────

type InspectorTab = 'overview' | 'connections' | 'refine' | 'code'

type NodeColors = { accent: string; bg: string; text: string; border: string; glow: string }

const TABS: { id: InspectorTab; label: string }[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'connections', label: 'Connections' },
  { id: 'refine',      label: 'Refine' },
  { id: 'code',        label: 'Code' },
]

const STATUS_STYLES = {
  generated:      { label: 'Generated',    className: 'bg-primary/10 text-primary border-primary/20' },
  'needs-config': { label: 'Needs Config', className: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/25' },
  planned:        { label: 'Planned',      className: 'bg-white/5 text-muted border-white/10' },
} as const

// ── Root component ─────────────────────────────────────────────────────────────

interface NodeInspectorProps {
  asset: WorkspaceAsset | null
  graph: WorkspaceGraph | null
  startupId: string
  onClose: () => void
  onSelectAsset: (id: string) => void
}

export function NodeInspector({ asset, graph, startupId, onClose, onSelectAsset }: NodeInspectorProps) {
  const [tab, setTab] = useState<InspectorTab>('overview')

  // Reset to Overview whenever the selected asset changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (asset) setTab('overview')
  }, [asset?.id])

  const colors = asset ? NODE_TYPE_COLORS[asset.nodeType] : null
  const status = asset ? STATUS_STYLES[asset.status] : null

  const depAssets = asset && graph
    ? asset.dependencies.map((id) => graph.assets.find((a) => a.id === id)).filter(Boolean) as WorkspaceAsset[]
    : []

  const relatedAssets = asset && graph
    ? graph.connectors
        .filter((c) => c.from === asset.id || c.to === asset.id)
        .map((c) => {
          const otherId = c.from === asset.id ? c.to : c.from
          return graph.assets.find((a) => a.id === otherId)
        })
        .filter(Boolean)
        .filter((a, i, arr) => arr.findIndex((x) => x?.id === a?.id) === i) as WorkspaceAsset[]
    : []

  return (
    <AnimatePresence>
      {asset && colors && status && (
        <motion.aside
          key={asset.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-0 bottom-0 w-[320px] flex flex-col border-l border-border z-30 overflow-hidden"
          style={{
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(24px)',
            boxShadow: '-12px 0 40px rgba(0,0,0,0.7)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-border shrink-0">
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="flex items-center justify-center w-5 h-5 rounded shrink-0"
                  style={{ background: colors.bg }}
                >
                  {(() => {
                    const IconComp = asset.icon
                    return <IconComp style={{ width: 10, height: 10, color: colors.accent }} strokeWidth={2} />
                  })()}
                </div>
                <span className="text-sm font-semibold text-foreground truncate">{asset.title}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none"
                  style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                >
                  {NODE_TYPE_LABELS[asset.nodeType]}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none',
                    status.className
                  )}
                >
                  {status.label}
                </span>
                {asset.route && (
                  <span className="text-[9px] font-mono text-muted/60 truncate">{asset.route}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-card transition-colors shrink-0 mt-0.5"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border shrink-0 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'px-2 py-1.5 rounded-md text-[9px] font-mono font-semibold whitespace-nowrap transition-colors shrink-0',
                  tab === t.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:text-foreground hover:bg-card'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {tab === 'overview' && <OverviewTab asset={asset} colors={colors} />}
            {tab === 'connections' && (
              <ConnectionsTab
                depAssets={depAssets}
                relatedAssets={relatedAssets}
                onSelectAsset={onSelectAsset}
              />
            )}
            {tab === 'refine' && <RefineTab colors={colors} />}
            {tab === 'code' && <CodeTab asset={asset} colors={colors} />}
          </div>

          {/* Preview Screen CTA — page assets only */}
          {asset.nodeType === 'page' && (
            <div className="shrink-0 px-3 py-2.5 border-t border-border">
              <Link
                href={`/p/${startupId}?screen=${asset.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-colors border"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                  color: colors.accent,
                }}
              >
                <MonitorPlay size={12} strokeWidth={2} />
                Preview Screen
              </Link>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-border/60">
      <p className="text-[9px] font-mono font-semibold text-muted/60 tracking-widest uppercase mb-2">{title}</p>
      {children}
    </div>
  )
}

// ── Overview tab ───────────────────────────────────────────────────────────────

function OverviewTab({ asset, colors }: { asset: WorkspaceAsset; colors: NodeColors }) {
  return (
    <>
      <Section title="Purpose">
        <p className="text-xs text-muted leading-relaxed">{asset.purpose}</p>
      </Section>

      <Section title="Startup Impact">
        <p className="text-xs text-muted leading-relaxed">{asset.impact}</p>
      </Section>

      {asset.aiRecommendation && (
        <Section title="Xenysis Recommends">
          <div
            className="rounded-xl p-3 border text-xs text-foreground leading-relaxed"
            style={{ background: colors.bg, borderColor: colors.border }}
          >
            <span
              className="text-[9px] font-mono font-semibold block mb-1.5"
              style={{ color: colors.text }}
            >
              AI · SUGGESTION
            </span>
            {asset.aiRecommendation}
          </div>
        </Section>
      )}
    </>
  )
}

// ── Connections tab ────────────────────────────────────────────────────────────

function ConnectionsTab({
  depAssets,
  relatedAssets,
  onSelectAsset,
}: {
  depAssets: WorkspaceAsset[]
  relatedAssets: WorkspaceAsset[]
  onSelectAsset: (id: string) => void
}) {
  const isEmpty = depAssets.length === 0 && relatedAssets.length === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center h-full">
        <p className="text-xs text-muted">No connections found for this asset.</p>
      </div>
    )
  }

  return (
    <>
      {depAssets.length > 0 && (
        <Section title={`Dependencies (${depAssets.length})`}>
          <div className="flex flex-col gap-1">
            {depAssets.map((dep) => (
              <AssetChip key={dep.id} asset={dep} onSelect={onSelectAsset} />
            ))}
          </div>
        </Section>
      )}

      {relatedAssets.length > 0 && (
        <Section title={`Connected Assets (${relatedAssets.length})`}>
          <div className="flex flex-col gap-1">
            {relatedAssets.map((rel) => (
              <AssetChip key={rel.id} asset={rel} onSelect={onSelectAsset} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

function AssetChip({ asset, onSelect }: { asset: WorkspaceAsset; onSelect: (id: string) => void }) {
  const c = NODE_TYPE_COLORS[asset.nodeType]
  const Icon = asset.icon
  return (
    <button
      onClick={() => onSelect(asset.id)}
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border hover:border-white/10 hover:bg-card transition-colors text-left"
    >
      <div
        className="flex items-center justify-center w-5 h-5 rounded shrink-0"
        style={{ background: c.bg }}
      >
        <Icon style={{ width: 9, height: 9, color: c.accent }} strokeWidth={2} />
      </div>
      <span className="text-xs text-foreground truncate flex-1">{asset.title}</span>
      <span className="text-[8px] font-mono text-muted/50 shrink-0">{NODE_TYPE_LABELS[asset.nodeType]}</span>
    </button>
  )
}

// ── Refine tab ─────────────────────────────────────────────────────────────────

function RefineTab({ colors }: { colors: NodeColors }) {
  return (
    <>
      

      <Section title="Refine Asset">
        <div className="flex flex-col gap-1.5">
          <button
            disabled
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border text-xs text-muted cursor-not-allowed opacity-50 text-left"
          >
            <div
              className="flex items-center justify-center w-5 h-5 rounded shrink-0"
              style={{ background: colors.bg }}
            >
              <Pencil style={{ width: 9, height: 9, color: colors.accent }} strokeWidth={2} />
            </div>
            Edit properties
          </button>
          <button
            disabled
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border text-xs text-muted cursor-not-allowed opacity-50 text-left"
          >
            <div
              className="flex items-center justify-center w-5 h-5 rounded shrink-0"
              style={{ background: colors.bg }}
            >
              <RefreshCw style={{ width: 9, height: 9, color: colors.accent }} strokeWidth={2} />
            </div>
            Regenerate asset
          </button>
        </div>
        <p className="text-[9px] font-mono text-muted/40 mt-2 uppercase tracking-wide">
          Edit and regeneration — Phase 2
        </p>
      </Section>
    </>
  )
}

// ── Code tab — generated source ────────────────────────────────────────────────

function CodeTab({ asset, colors }: { asset: WorkspaceAsset; colors: NodeColors }) {
  const [copied, setCopied] = useState(false)
  const preview = generateAssetPreview(asset)

  function handleCopy() {
    navigator.clipboard.writeText(preview.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* File path + copy */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Code2 size={10} strokeWidth={2} style={{ color: colors.accent, flexShrink: 0 }} />
          <span
            className="text-[9px] font-mono truncate"
            style={{ color: colors.accent }}
          >
            {preview.filePath}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono transition-colors shrink-0 ml-2"
          style={copied
            ? { background: 'rgba(79,250,176,0.1)', color: '#4ffab0' }
            : { color: '#a1a1aa' }
          }
        >
          {copied
            ? <><Check size={9} strokeWidth={2.5} />Copied</>
            : <><Copy size={9} strokeWidth={2} />Copy</>
          }
        </button>
      </div>

      {/* Code block */}
      <div className="flex-1 overflow-auto" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <pre className="text-[10px] font-mono leading-[1.7] p-4 whitespace-pre text-foreground/80">
          <code>{preview.code}</code>
        </pre>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
      >
        <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" />
        <span className="text-[9px] font-mono" style={{ color: colors.accent }}>
          Generated by Xenysis
        </span>
        <span className="ml-auto text-[9px] font-mono text-muted/40 uppercase tracking-wider">
          {preview.language}
        </span>
      </div>
    </div>
  )
}
