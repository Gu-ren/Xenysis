'use client'

import { Map } from 'lucide-react'
import type { WorkspaceGraph } from '../types'

interface JourneyScreenProps {
  graph: WorkspaceGraph | null
}

export function JourneyScreen({ graph: _graph }: JourneyScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 bg-background">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-border"
        style={{ background: 'rgba(79,250,176,0.06)', borderColor: 'rgba(79,250,176,0.15)' }}
      >
        <Map size={18} strokeWidth={1.5} style={{ color: '#4ffab0' }} />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-foreground">Journey View</p>
        <p className="text-xs text-muted font-mono">
          Milestone timeline · Phase 3
        </p>
      </div>
    </div>
  )
}
