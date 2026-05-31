'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewViewport } from '@/modules/preview/components/preview-viewport'
import { useStartupJourney } from '@/modules/preview/hooks/use-startup-journey'
import { useSimulationState } from '@/modules/preview/hooks/use-simulation-state'
import { generateStartupContext } from '@/modules/preview/utils/generate-startup-context'
import { useFounderSessionStore } from '@/store/founder-session'
import { PreviewToolbar } from './preview-toolbar'
import { UnifiedNavBar } from './unified-nav-bar'
import type { WorkspaceGraph } from '../types'
import type { DeviceMode, NavigationTarget } from '@/modules/preview/types'

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

interface StartupPreviewPanelProps {
  graph: WorkspaceGraph | null
  initialAssetId?: string
}

export function StartupPreviewPanel({ graph, initialAssetId }: StartupPreviewPanelProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const hasInitialized = useRef(false)

  const journey    = useStartupJourney(graph)
  const simulation = useSimulationState()

  const founderIdea          = useFounderSessionStore((s) => s.idea)
  const founderBlueprint     = useFounderSessionStore((s) => s.blueprint)

  // Generate startup-specific preview context from graph + founder session data
  const ctx = useMemo(() => {
    if (!graph) return null
    return generateStartupContext(graph, {
      idea: founderIdea,
      businessModel: founderBlueprint?.businessModel,
      detectedPattern: founderBlueprint?.detectedPattern,
      systems: founderBlueprint?.systems,
    })
  }, [graph, founderIdea, founderBlueprint])

  // Init simulation once journey is ready, respecting deep-linked initialAssetId
  useEffect(() => {
    if (journey.screens.length === 0 || hasInitialized.current) return
    hasInitialized.current = true
    const firstId =
      initialAssetId && journey.screenMap.has(initialAssetId)
        ? initialAssetId
        : journey.screens[0].asset.id
    simulation.init(firstId)
  // simulation.init is stable (useCallback)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey])

  // Resolve navigation targets for the current screen
  const navigatesTo = useMemo<NavigationTarget[]>(() => {
    if (!simulation.currentId) return []
    const screen = journey.screenMap.get(simulation.currentId)
    if (!screen) return []
    return screen.nextScreenIds.flatMap((id) => {
      const target = journey.screenMap.get(id)
      if (!target) return []
      return [{ id, label: getNavLabel(target.asset.assetType), assetType: target.asset.assetType }]
    })
  }, [simulation.currentId, journey])

  const selectedScreen = simulation.currentId
    ? (journey.screenMap.get(simulation.currentId) ?? null)
    : null

  const allAssets = graph?.assets ?? []

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* Device toggle */}
      <PreviewToolbar
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
      />

      {/* Unified module navigator + back/reset */}
      <UnifiedNavBar
        assets={allAssets}
        currentId={simulation.currentId}
        visitedIds={simulation.visitedIds}
        canGoBack={simulation.canGoBack}
        onNavigate={simulation.navigateTo}
        onBack={simulation.goBack}
        onReset={simulation.reset}
      />

      {/* Preview viewport — flex-1, dominant */}
      <div className="flex-1 min-h-0 relative">
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
