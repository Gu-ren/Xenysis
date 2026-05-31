'use client'

import { cn } from '@/lib/utils'
import { NODE_TYPE_COLORS } from '@/modules/workspace/constants'
import type { StartupJourney } from '../types'

interface ScreenNavigatorProps {
  journey: StartupJourney
  selectedId: string | null
  visitedIds: Set<string>
  onSelect: (id: string) => void
}

export function ScreenNavigator({ journey, selectedId, visitedIds, onSelect }: ScreenNavigatorProps) {
  const { screens } = journey

  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto border-r border-border bg-background"
      style={{ width: 220 }}
    >
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-[9px] font-mono font-semibold text-muted/50 tracking-widest uppercase">
          User Journey
        </p>
      </div>

      {screens.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 text-center">
          <p className="text-xs text-muted">No screens in this startup.</p>
        </div>
      ) : (
        <div className="flex-1 py-2 overflow-y-auto">
          {screens.map((screen, i) => {
            const id = screen.asset.id
            const isCurrent  = id === selectedId
            const isVisited  = visitedIds.has(id) && !isCurrent
            const hasConnector = i < screens.length - 1

            const c = NODE_TYPE_COLORS[screen.asset.nodeType]
            const Icon = screen.asset.icon

            return (
              <div key={id} className="flex flex-col">
                <button
                  onClick={() => onSelect(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-xl text-left transition-colors',
                    isCurrent
                      ? 'border'
                      : 'border border-transparent hover:bg-card'
                  )}
                  style={isCurrent ? { background: c.bg, borderColor: c.border } : undefined}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
                    style={{ background: isCurrent ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)' }}
                  >
                    <Icon
                      style={{
                        width: 11,
                        height: 11,
                        color: isCurrent ? c.accent : isVisited ? 'rgba(161,161,170,0.65)' : 'rgba(161,161,170,0.35)',
                      }}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className="text-xs font-medium truncate"
                      style={{
                        color: isCurrent
                          ? '#fafafa'
                          : isVisited
                          ? 'rgba(250,250,250,0.55)'
                          : 'rgba(161,161,170,0.45)',
                      }}
                    >
                      {screen.asset.title}
                    </span>
                    {screen.asset.route && (
                      <span className="text-[9px] font-mono truncate" style={{ color: 'rgba(161,161,170,0.3)' }}>
                        {screen.asset.route}
                      </span>
                    )}
                  </div>

                  {/* State indicator */}
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.accent }} />
                  )}
                  {isVisited && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                      <path
                        d="M2 5.2L4 7.2L8 3"
                        stroke="rgba(79,250,176,0.5)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Flow connector */}
                {hasConnector && (
                  <div className="flex items-center" style={{ paddingLeft: 34, height: 18 }}>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                      <path
                        d="M4 0 L4 9"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M1.5 7 L4 10.5 L6.5 7"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}
