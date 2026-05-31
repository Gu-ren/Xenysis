'use client'

import { Check } from 'lucide-react'
import type { ActiveStage } from '../types'

interface StageRowProps {
  stage: ActiveStage
}

export function StageRow({ stage }: StageRowProps) {
  const { state } = stage
  const isPending = state === 'pending'
  const isActive = state === 'active'
  const isDone = state === 'done'

  return (
    <div
      className="flex items-start gap-3 transition-opacity duration-300"
      style={{ opacity: isPending ? 0.3 : 1 }}
    >
      <div className="mt-0.5 w-4 h-4 flex items-center justify-center shrink-0">
        {isDone ? (
          <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
        ) : isActive ? (
          <span
            className="w-2 h-2 rounded-full bg-primary block"
            style={{ animation: 'fs-pulse-dot 1s ease-in-out infinite' }}
          />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-border block" />
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span
          className="text-sm font-medium transition-colors duration-200"
          style={{ color: isDone ? 'var(--muted)' : isActive ? 'var(--foreground)' : 'color-mix(in srgb, var(--muted) 50%, transparent)' }}
        >
          {stage.label}
        </span>
        {isActive && (
          <span
            className="text-xs font-mono text-muted"
            style={{ animation: 'fs-shimmer 1.8s ease-in-out infinite' }}
          >
            {stage.sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
