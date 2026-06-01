'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { WorkspaceModeBar } from '../components/workspace-mode-bar'
import { StartupProgressPanel } from '../components/startup-progress-panel'
import { StartupPreviewPanel } from '../components/startup-preview-panel'
import { CopilotPanel } from '../components/copilot-panel'
import { ArchitectureScreen } from './architecture-screen'
import {
  SkeletonModeBar,
  SkeletonLeft,
  SkeletonCenter,
  SkeletonRight,
  SkeletonZone,
} from '@/components/workspace/skeleton-workspace'
import { getWorkspaceGraph } from '../services/workspace'
import { useStartupStore } from '@/store/startup'
import type { WorkspaceGraph } from '../types'
import type { WorkspaceMode } from '../components/workspace-mode-bar'

// Phase at which each zone transitions from skeleton → real content
// 0 = all skeletons | 1 = header real | 2 = left real | 3 = center real | 4 = right real
const REVEAL_DELAYS_MS = [150, 400, 650, 900] // header, left, center, right

interface WorkspaceScreenProps {
  startupId: string
  initialAssetId?: string
}

export function WorkspaceScreen({ startupId, initialAssetId }: WorkspaceScreenProps) {
  const reduced = useReducedMotion()
  const [graph, setGraph] = useState<WorkspaceGraph | null>(null)
  const [dataReady, setDataReady] = useState(false)
  const [revealPhase, setRevealPhase] = useState(0)
  const [mode, setMode] = useState<WorkspaceMode>('startup')

  const storeStartupId = useStartupStore((s) => s.startupId)
  const storeGraph = useStartupStore((s) => s.graph)

  // Load data
  useEffect(() => {
    if (storeStartupId === startupId && storeGraph) {
      setGraph(storeGraph)
      setDataReady(true)
      return
    }
    getWorkspaceGraph(startupId).then((g) => {
      setGraph(g)
      setDataReady(true)
    })
  }, [startupId, storeStartupId, storeGraph])

  // Staggered reveal: fire one phase per delay once data is ready
  useEffect(() => {
    if (!dataReady) return
    if (reduced) { setRevealPhase(4); return }

    const timers = REVEAL_DELAYS_MS.map((delay, i) =>
      setTimeout(() => setRevealPhase(i + 1), delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [dataReady, reduced])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* ── Header zone ────────────────────────────────────────────────────── */}
      <SkeletonZone
        show={revealPhase >= 1}
        skeleton={<SkeletonModeBar />}
        className="shrink-0"
        style={{ height: 36 }}
      >
        <WorkspaceModeBar mode={mode} startupId={startupId} onModeChange={setMode} />
      </SkeletonZone>

      {/* ── Architecture mode ───────────────────────────────────────────────── */}
      {mode === 'architecture' && (
        <ArchitectureScreen startupId={startupId} initialAssetId={initialAssetId} />
      )}

      {/* ── Startup mode — 3 panel zones ────────────────────────────────────── */}
      {mode === 'startup' && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left zone */}
          <SkeletonZone
            show={revealPhase >= 2}
            skeleton={<SkeletonLeft />}
            className="shrink-0 h-full"
            style={{ width: 220 }}
          >
            <StartupProgressPanel graph={graph} />
          </SkeletonZone>

          {/* Center zone */}
          <SkeletonZone
            show={revealPhase >= 3}
            skeleton={<SkeletonCenter />}
            className="flex-1 min-w-0 h-full"
          >
            <StartupPreviewPanel graph={graph} initialAssetId={initialAssetId} />
          </SkeletonZone>

          {/* Right zone */}
          <SkeletonZone
            show={revealPhase >= 4}
            skeleton={<SkeletonRight />}
            className="shrink-0 h-full"
            style={{ width: 300 }}
          >
            <CopilotPanel graph={graph} />
          </SkeletonZone>
        </div>
      )}
    </div>
  )
}
