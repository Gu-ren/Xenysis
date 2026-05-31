'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

const STAGES = [
  { id: 1, label: 'Business' },
  { id: 2, label: 'Product' },
  { id: 3, label: 'Infrastructure' },
  { id: 4, label: 'Blueprint' },
]

interface JourneyBarProps {
  currentStage?: number
}

export function JourneyBar({ currentStage = 1 }: JourneyBarProps) {
  return (
    <div
      className="flex items-center px-5 shrink-0 border-b border-border bg-background"
      style={{ height: 44 }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2 mr-7 shrink-0">
        <div
          className="flex items-center justify-center shrink-0"
        >
          <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" />
        </div>
        <span className="text-[13px] font-bold text-foreground tracking-[-0.025em]">
          Xenysis
        </span>
      </div>

      {/* Journey stages */}
      <div className="flex items-center gap-0">
        {STAGES.map((stage, i) => {
          const isActive = stage.id === currentStage
          const isDone = stage.id < currentStage
          const isFuture = stage.id > currentStage

          return (
            <div key={stage.id} className="flex items-center">
              <div className="flex items-center gap-1.5">
                {isDone && (
                  <span className="text-primary font-mono text-[10px] leading-none">✓</span>
                )}
                {isActive && (
                  <span
                    className="w-[5px] h-[5px] rounded-full bg-primary shrink-0"
                    style={{ animation: 'fs-pulse-dot 1.5s ease-in-out infinite' }}
                  />
                )}
                <span
                  className={cn(
                    'text-[12px] tracking-[-0.01em] select-none',
                    isActive && 'text-foreground font-medium',
                    isDone && 'text-muted',
                    isFuture && 'text-muted/35',
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {i < STAGES.length - 1 && (
                <span className="mx-3 text-[11px] text-muted/20 select-none tracking-[0.12em]">
                  ─────
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
