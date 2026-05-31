'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useStartupStore } from '@/store/startup'
import { useFounderSessionStore } from '@/store/founder-session'
import { getWorkspaceGraph } from '@/modules/workspace/services/workspace'
import { generateStartupContext } from '../utils/generate-startup-context'
import { useStartupJourney } from '../hooks/use-startup-journey'
import { useSimulationState } from '../hooks/use-simulation-state'
import { PreviewShell } from '../components/preview-shell'
import { SimulationBar } from '../components/simulation-bar'
import { ScreenNavigator } from '../components/screen-navigator'
import { PreviewViewport } from '../components/preview-viewport'
import type { WorkspaceGraph } from '@/modules/workspace/types'
import type { DeviceMode, NavigationTarget } from '../types'

interface PreviewStartupScreenProps {
  startupId: string
  initialScreenId?: string
}

function formatStartupName(id: string): string {
  return id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getNavLabel(assetType: string): string {
  switch (assetType) {
    case 'auth':     return 'Get Started →'
    case 'core':     return 'Open Dashboard →'
    case 'billing':  return 'View Pricing →'
    case 'settings': return 'Open Settings →'
    case 'marketing': return 'Back to Home →'
    default:          return 'Continue →'
  }
}

export function PreviewStartupScreen({ startupId, initialScreenId }: PreviewStartupScreenProps) {
  const [graph, setGraph] = useState<WorkspaceGraph | null>(null)
  const [loading, setLoading] = useState(true)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

  const storeStartupId   = useStartupStore((s) => s.startupId)
  const storeGraph       = useStartupStore((s) => s.graph)
  const founderIdea      = useFounderSessionStore((s) => s.idea)
  const founderBlueprint = useFounderSessionStore((s) => s.blueprint)

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

  // Generate startup-specific preview context from graph + founder session data
  const ctx = useMemo(() => {
    if (!graph) return null
    return generateStartupContext(graph, {
      idea: founderIdea,
      businessModel: founderBlueprint?.businessModel,
      detectedPattern: founderBlueprint?.detectedPattern,
    })
  }, [graph, founderIdea, founderBlueprint])

  const journey    = useStartupJourney(graph)
  const simulation = useSimulationState()

  // Init simulation once journey is ready.
  // Respects deep-linked initialScreenId if present, otherwise uses first BFS screen.
  useEffect(() => {
    if (journey.screens.length === 0) return
    const firstId = (initialScreenId && journey.screenMap.has(initialScreenId))
      ? initialScreenId
      : journey.screens[0].asset.id
    simulation.init(firstId)
  // simulation.init is stable (useCallback), safe to include
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey])

  // Derive navigation targets for the current screen from the graph.
  const navigatesTo = useMemo<NavigationTarget[]>(() => {
    if (!simulation.currentId) return []
    const screen = journey.screenMap.get(simulation.currentId)
    if (!screen) return []
    return screen.nextScreenIds.flatMap((id) => {
      const target = journey.screenMap.get(id)
      if (!target) return []
      return [{
        id,
        label: getNavLabel(target.asset.assetType),
        assetType: target.asset.assetType,
      }]
    })
  }, [simulation.currentId, journey])

  // Breadcrumb: resolve screen titles from history for SimulationBar.
  const breadcrumb = useMemo(() => {
    return simulation.history.map((id) => ({
      id,
      title: journey.screenMap.get(id)?.asset.title ?? id,
    }))
  }, [simulation.history, journey])

  const selectedScreen = simulation.currentId
    ? (journey.screenMap.get(simulation.currentId) ?? null)
    : null

  const startupName = formatStartupName(startupId)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-background">
        <div
          className="w-8 h-8 flex items-center justify-center"
        >
          <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" style={{ animation: 'fs-shimmer 1.5s ease-in-out infinite' }} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-foreground">Loading startup preview</p>
          <p className="text-xs text-muted font-mono">Preparing screens…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <PreviewShell
        startupId={startupId}
        startupName={startupName}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
      />
      <SimulationBar
        breadcrumb={breadcrumb}
        canGoBack={simulation.canGoBack}
        onBack={simulation.goBack}
        onReset={simulation.reset}
      />
      <div className="flex flex-1 min-h-0">
        <ScreenNavigator
          journey={journey}
          selectedId={simulation.currentId}
          visitedIds={simulation.visitedIds}
          onSelect={simulation.navigateTo}
        />
        <PreviewViewport
          screen={selectedScreen}
          deviceMode={deviceMode}
          direction={simulation.direction}
          navigatesTo={navigatesTo}
          onNavigate={simulation.navigateTo}
          ctx={ctx}
        />
      </div>
    </div>
  )
}
