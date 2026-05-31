'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { WorkspaceModeBar } from '../components/workspace-mode-bar'
import { StartupProgressPanel } from '../components/startup-progress-panel'
import { StartupPreviewPanel } from '../components/startup-preview-panel'
import { CopilotPanel } from '../components/copilot-panel'
import { ArchitectureScreen } from './architecture-screen'
import { getWorkspaceGraph } from '../services/workspace'
import { useStartupStore } from '@/store/startup'
import type { WorkspaceGraph } from '../types'
import type { WorkspaceMode } from '../components/workspace-mode-bar'

interface WorkspaceScreenProps {
  startupId: string
  initialAssetId?: string
}

export function WorkspaceScreen({ startupId, initialAssetId }: WorkspaceScreenProps) {
  const [graph, setGraph]   = useState<WorkspaceGraph | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode]     = useState<WorkspaceMode>('startup')

  const storeStartupId = useStartupStore((s) => s.startupId)
  const storeGraph     = useStartupStore((s) => s.graph)

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

  if (loading) return <WorkspaceLoader />

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Workspace OS bar — mode toggle + deploy/preview links */}
      <WorkspaceModeBar
        mode={mode}
        startupId={startupId}
        onModeChange={setMode}
      />

      {/* Mode: Architecture — full-screen canvas, manages its own state */}
      {mode === 'architecture' && (
        <ArchitectureScreen startupId={startupId} initialAssetId={initialAssetId} />
      )}

      {/* Mode: Startup (default) — 3-panel layout */}
      {mode === 'startup' && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Startup Progress */}
          <StartupProgressPanel graph={graph} />

          {/* Center: Interactive startup preview */}
          <StartupPreviewPanel
            graph={graph}
            initialAssetId={initialAssetId}
          />

          {/* Right: AI Copilot */}
          <CopilotPanel graph={graph} />
        </div>
      )}
    </div>
  )
}

function WorkspaceLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-background">
      <div className="w-8 h-8 flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="Xenysis"
          width={28}
          height={28}
          className="rounded-sm"
          style={{ animation: 'fs-shimmer 1.5s ease-in-out infinite' }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">Loading workspace</p>
        <p className="text-xs text-muted font-mono">Assembling your startup…</p>
      </div>
    </div>
  )
}
