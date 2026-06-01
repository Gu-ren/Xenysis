'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { CanvasNode } from '../components/canvas-node'
import { ConnectorLayer } from '../components/connector-layer'
import { ZoneLayer } from '../components/zone-layer'
import { Minimap } from '../components/minimap'
import { NodeInspector } from '../components/node-inspector'
import { CanvasToolbar } from '../components/canvas-toolbar'
import { useCanvas } from '../hooks/use-canvas'
import { useAssetSelection } from '../hooks/use-asset-selection'
import { useAssetReveal } from '../hooks/use-asset-reveal'
import { getWorkspaceGraph } from '../services/workspace'
import { computeLayout } from '../utils/layout'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from '../constants'
import { useStartupStore } from '@/store/startup'
import { cn } from '@/lib/utils'
import type { WorkspaceGraph, NodeType } from '../types'

// ── View mode ─────────────────────────────────────────────────────────────────

type ViewMode = 'flow' | 'architecture' | 'system'

const VIEW_MODES: { id: ViewMode; label: string; description: string }[] = [
  { id: 'flow',         label: 'Flow',         description: 'User journey · pages only' },
  { id: 'architecture', label: 'Architecture',  description: 'Pages · data · services · integrations' },
  { id: 'system',       label: 'System',        description: 'All assets and dependencies' },
]

const VIEW_MODE_TYPES: Record<ViewMode, Set<NodeType>> = {
  flow:         new Set(['page']),
  architecture: new Set(['page', 'database', 'system', 'integration']),
  system:       new Set(['page', 'database', 'system', 'integration', 'workflow', 'api']),
}

const VIEW_MODE_ZONES: Record<ViewMode, Set<string>> = {
  flow:         new Set(),
  architecture: new Set(['user-flow', 'application', 'data', 'services', 'integrations']),
  system:       new Set(['user-flow', 'application', 'data', 'services', 'integrations', 'automations']),
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ArchitectureScreenProps {
  startupId: string
  initialAssetId?: string
}

export function ArchitectureScreen({ startupId, initialAssetId }: ArchitectureScreenProps) {
  const [graph, setGraph] = useState<WorkspaceGraph | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('system')
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewSize, setViewSize] = useState({ w: 1200, h: 800 })
  const hasInitialSelected = useRef(false)

  const storeStartupId = useStartupStore((s) => s.startupId)
  const storeGraph = useStartupStore((s) => s.graph)

  useEffect(() => {
    if (storeStartupId === startupId && storeGraph) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGraph(storeGraph)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }
    getWorkspaceGraph(startupId).then((g) => {
      setGraph(g)
      setLoading(false)
    })
  }, [startupId, storeStartupId, storeGraph])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setViewSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const assets = graph?.assets ?? []

  const { positions: layoutPositions, zones } = useMemo(
    () => computeLayout(assets),
    [assets],
  )

  const canvas = useCanvas(assets, layoutPositions, viewSize.w, viewSize.h)
  const selection = useAssetSelection()
  const revealed = useAssetReveal(assets)

  useEffect(() => {
    if (!initialAssetId || !graph || hasInitialSelected.current) return
    hasInitialSelected.current = true
    selection.select(initialAssetId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAssetId, graph])

  const { connectedIds, outgoingIds, incomingIds } = useMemo(() => {
    if (!selection.selectedId || !graph) {
      return { connectedIds: new Set<string>(), outgoingIds: new Set<string>(), incomingIds: new Set<string>() }
    }
    const outgoing = new Set<string>()
    const incoming = new Set<string>()
    for (const c of graph.connectors) {
      if (c.from === selection.selectedId) outgoing.add(c.to)
      if (c.to === selection.selectedId) incoming.add(c.from)
    }
    return { connectedIds: new Set([...outgoing, ...incoming]), outgoingIds: outgoing, incomingIds: incoming }
  }, [selection.selectedId, graph])

  const selectedAsset = assets.find((a) => a.id === selection.selectedId) ?? null

  if (loading) return <ArchitectureLoader />
  if (!graph) return null

  const visibleTypes = VIEW_MODE_TYPES[viewMode]
  const total = assets.length
  const generated = assets.filter((a) => a.status === 'generated').length
  const needsConfig = assets.filter((a) => a.status === 'needs-config').length

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-background">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border shrink-0 z-10 bg-background">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted/60 tracking-widest uppercase">Blueprint</span>
          <span className="text-muted/30 text-xs">·</span>
          <span className="text-xs font-mono text-muted">{total} assets</span>
          <span className="text-muted/30 text-xs">·</span>
          <span className="text-xs font-mono text-primary">{generated} generated</span>
          {needsConfig > 0 && (
            <>
              <span className="text-muted/30 text-xs">·</span>
              <span className="text-xs font-mono text-[#f59e0b]">{needsConfig} needs config</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {(['page', 'database', 'workflow', 'integration', 'system'] as const).map((type) => {
            if (!visibleTypes.has(type)) return null
            const c = NODE_TYPE_COLORS[type]
            const count = assets.filter((a) => a.nodeType === type).length
            if (count === 0) return null
            return (
              <div key={type} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.accent }} />
                <span className="text-[10px] font-mono text-muted/60">{NODE_TYPE_LABELS[type]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter / view-mode bar */}
      <div className="flex items-center gap-3 px-4 h-9 border-b border-border shrink-0 bg-background z-10">
        <div className="flex items-center gap-px rounded-lg border border-border overflow-hidden">
          {VIEW_MODES.map(({ id, label, description }) => (
            <button
              key={id}
              title={description}
              onClick={() => setViewMode(id)}
              className={cn(
                'px-2.5 py-1 text-[10px] font-mono font-semibold transition-colors',
                viewMode === id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-foreground hover:bg-card',
              )}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        onWheel={canvas.onWheel}
        onMouseDown={canvas.onCanvasMouseDown}
        onMouseMove={canvas.onMouseMove}
        onMouseUp={canvas.onMouseUp}
        onMouseLeave={canvas.onMouseUp}
        onDoubleClick={canvas.onCanvasDblClick}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div
          style={{
            transform: `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`,
            transformOrigin: '0 0',
            position: 'relative',
            willChange: 'transform',
          }}
        >
          <ZoneLayer zones={zones.filter((z) => VIEW_MODE_ZONES[viewMode].has(z.id))} />

          <ConnectorLayer
            assets={assets}
            connectors={graph.connectors.filter((c) => {
              const fa = assets.find((a) => a.id === c.from)
              const ta = assets.find((a) => a.id === c.to)
              return fa && ta && visibleTypes.has(fa.nodeType) && visibleTypes.has(ta.nodeType)
            })}
            positions={canvas.positions}
            revealed={revealed.size > 0}
            selectedId={selection.selectedId}
          />

          {assets.map((asset) => {
            const pos = canvas.positions.find((p) => p.id === asset.id) ?? { id: asset.id, x: asset.x, y: asset.y }
            const isSelected   = selection.selectedId === asset.id
            const isConnected  = connectedIds.has(asset.id)
            const hiddenByMode = !visibleTypes.has(asset.nodeType)
            const isDimmed = hiddenByMode ||
              (selection.selectedId !== null && !isSelected && !isConnected)
            const direction = outgoingIds.has(asset.id)
              ? 'outgoing' as const
              : incomingIds.has(asset.id)
                ? 'incoming' as const
                : null

            return (
              <CanvasNode
                key={asset.id}
                asset={asset}
                pos={pos}
                isDragging={false}
                isHovered={selection.hoveredId === asset.id}
                isSelected={isSelected}
                isConnected={isConnected}
                isDimmed={isDimmed}
                direction={direction}
                revealed={revealed.has(asset.id)}
                onMouseDown={canvas.onNodeMouseDown}
                onMouseEnter={selection.hover}
                onMouseLeave={selection.clearHover}
                onClick={selection.select}
              />
            )
          })}
        </div>

        <CanvasToolbar
          zoom={canvas.zoom}
          onZoomIn={canvas.zoomIn}
          onZoomOut={canvas.zoomOut}
          onFitView={canvas.fitView}
          onReset={canvas.resetView}
        />
        <Minimap
          assets={assets}
          positions={canvas.positions}
          panX={canvas.panX}
          panY={canvas.panY}
          zoom={canvas.zoom}
          viewW={viewSize.w}
          viewH={viewSize.h}
          onPanTo={canvas.panTo}
        />
      </div>

      <NodeInspector
        asset={selectedAsset}
        graph={graph}
        startupId={startupId}
        onClose={selection.deselect}
        onSelectAsset={(id) => selection.select(id)}
      />
    </div>
  )
}

function ArchitectureLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-background">
      <div className="w-8 h-8 flex items-center justify-center">
        <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" style={{ animation: 'fs-shimmer 1.5s ease-in-out infinite' }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">Loading architecture</p>
        <p className="text-xs text-muted font-mono">Assembling dependency graph…</p>
      </div>
    </div>
  )
}
