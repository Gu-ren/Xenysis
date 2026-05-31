'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from '../constants'
import type { JourneyScreen, NavigationTarget } from '@/modules/preview/types'

const STATUS_STYLES = {
  generated:      { label: 'Generated',    color: '#4ffab0',  bg: 'rgba(79,250,176,0.08)',   border: 'rgba(79,250,176,0.2)'   },
  'needs-config': { label: 'Needs Config', color: '#f59e0b',  bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)'   },
  planned:        { label: 'Planned',      color: '#a1a1aa',  bg: 'rgba(161,161,170,0.06)',  border: 'rgba(161,161,170,0.12)' },
} as const

interface ScreenActionsFooterProps {
  screen: JourneyScreen | null
  navigatesTo: NavigationTarget[]
  onNavigate: (id: string) => void
}

export function ScreenActionsFooter({ screen, navigatesTo, onNavigate }: ScreenActionsFooterProps) {
  if (!screen) return null

  const { asset } = screen
  const colors = NODE_TYPE_COLORS[asset.nodeType]
  const status = STATUS_STYLES[asset.status]

  return (
    <div
      className="flex items-center gap-3 px-3 shrink-0 border-t border-border bg-background"
      style={{ height: 44 }}
    >
      {/* Screen identity */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="flex items-center justify-center w-5 h-5 rounded shrink-0"
          style={{ background: colors.bg }}
        >
          {(() => {
            const Icon = asset.icon
            return <Icon style={{ width: 9, height: 9, color: colors.accent }} strokeWidth={2} />
          })()}
        </div>
        <span className="text-xs font-semibold text-foreground truncate">{asset.title}</span>
        <span
          className="text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none shrink-0"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {NODE_TYPE_LABELS[asset.nodeType]}
        </span>
        <span
          className="text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none shrink-0"
          style={{ background: status.bg, color: status.color, borderColor: status.border }}
        >
          {status.label}
        </span>
      </div>

      {/* Navigation shortcuts */}
      {navigatesTo.length > 0 && (
        <>
          <div className="w-px h-4 bg-border shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {navigatesTo.map((target) => (
              <button
                key={target.id}
                onClick={() => onNavigate(target.id)}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-semibold shrink-0',
                  'text-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors',
                )}
              >
                <ChevronRight size={9} strokeWidth={2} />
                {target.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
