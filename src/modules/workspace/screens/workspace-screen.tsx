'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { WorkspaceModeBar } from '../components/workspace-mode-bar'
import { StartupProgressPanel } from '../components/startup-progress-panel'
import { StartupPreviewPanel } from '../components/startup-preview-panel'
import { CopilotPanel } from '../components/copilot-panel'
import { ArchitectureScreen } from './architecture-screen'
import { SkeletonWorkspace } from '@/components/workspace/skeleton-workspace'
import { getWorkspaceGraph } from '../services/workspace'
import { useStartupStore } from '@/store/startup'
import type { WorkspaceGraph } from '../types'
import type { WorkspaceMode } from '../components/workspace-mode-bar'

// Delays (ms) at which each panel skeleton transitions to real content
const REVEAL_DELAYS = [200, 500, 800] // left, center, right

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

  // Progressive skeleton → panel reveal once data is ready
  useEffect(() => {
    if (!dataReady) return
    if (reduced) { setRevealPhase(3); return }

    // Phase 0→1: shell is already visible; begin panel reveals
    const timers = REVEAL_DELAYS.map((delay, i) =>
      setTimeout(() => setRevealPhase(i + 1), delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [dataReady, reduced])

  const showSkeleton = revealPhase < 3

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <WorkspaceModeBar mode={mode} startupId={startupId} onModeChange={setMode} />

      {mode === 'architecture' && (
        <ArchitectureScreen startupId={startupId} initialAssetId={initialAssetId} />
      )}

      {mode === 'startup' && (
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          {/* Skeleton overlay — fades out as panels reveal */}
          <AnimatePresence>
            {showSkeleton && (
              <motion.div
                key="skeleton"
                className="absolute inset-0 z-10 flex"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.35 }}
              >
                <SkeletonWorkspace revealPhase={revealPhase} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real panels — staggered entrance */}
          <motion.div
            className="flex flex-1 min-h-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: dataReady ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.6 }}
          >
            <StartupProgressPanel graph={graph} />
            <StartupPreviewPanel graph={graph} initialAssetId={initialAssetId} />
            <CopilotPanel graph={graph} />
          </motion.div>
        </div>
      )}
    </div>
  )
}
