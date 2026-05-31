'use client'

import Link from 'next/link'
import { ExternalLink, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WorkspaceMode = 'startup' | 'architecture'

const MODES: { id: WorkspaceMode; label: string }[] = [
  { id: 'startup',      label: 'Startup' },
  { id: 'architecture', label: 'Architecture' },
]

interface WorkspaceModeBarProps {
  mode: WorkspaceMode
  startupId: string
  onModeChange: (mode: WorkspaceMode) => void
}

export function WorkspaceModeBar({ mode, startupId, onModeChange }: WorkspaceModeBarProps) {
  return (
    <div className="flex items-center justify-between px-4 h-9 border-b border-border shrink-0 bg-background z-10">
      {/* Left: spacer to keep center toggle balanced */}
      <div className="w-24" />

      {/* Center: mode toggle */}
      <div className="flex items-center gap-px rounded-lg border border-border overflow-hidden">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onModeChange(id)}
            className={cn(
              'px-3 py-1 text-[10px] font-mono font-semibold transition-colors',
              mode === id
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground hover:bg-card',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <Link
          href={`/preview/${startupId}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium text-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors"
        >
          <ExternalLink size={10} strokeWidth={2} />
          Full Preview
        </Link>
        <Link
          href={`/startup/${startupId}/deploy`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors"
        >
          <Rocket size={10} strokeWidth={2} />
          Deploy
        </Link>
      </div>
    </div>
  )
}
