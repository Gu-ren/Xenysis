'use client'

import { ArrowLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NODE_TYPE_COLORS } from '../constants'
import type { WorkspaceAsset } from '../types'

interface UnifiedNavBarProps {
  assets: WorkspaceAsset[]
  currentId: string | null
  visitedIds: Set<string>
  canGoBack: boolean
  onNavigate: (id: string) => void
  onBack: () => void
  onReset: () => void
}

function StatusDot({ status }: { status: WorkspaceAsset['status'] }) {
  const color =
    status === 'generated'    ? '#4ffab0' :
    status === 'needs-config' ? '#f59e0b' :
                                'rgba(161,161,170,0.3)'
  return (
    <span
      className="shrink-0 rounded-full"
      style={{ width: 5, height: 5, background: color }}
    />
  )
}

export function UnifiedNavBar({
  assets,
  currentId,
  visitedIds,
  canGoBack,
  onNavigate,
  onBack,
  onReset,
}: UnifiedNavBarProps) {
  const pageAssets = assets.filter((a) => a.nodeType === 'page')

  return (
    <div
      className="flex items-center shrink-0 border-b border-border bg-background overflow-hidden"
      style={{ height: 40 }}
    >
      {/* Navigation controls */}
      <div className="flex items-center gap-0.5 px-2 shrink-0">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          title="Go back"
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md transition-colors',
            canGoBack
              ? 'text-muted hover:text-foreground hover:bg-card cursor-pointer'
              : 'text-muted/25 cursor-not-allowed',
          )}
        >
          <ArrowLeft size={11} strokeWidth={2} />
        </button>
        <button
          onClick={onReset}
          disabled={!canGoBack}
          title="Reset to start"
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded-md transition-colors',
            canGoBack
              ? 'text-muted hover:text-foreground hover:bg-card cursor-pointer'
              : 'text-muted/25 cursor-not-allowed',
          )}
        >
          <RotateCcw size={10} strokeWidth={2} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-border shrink-0" />

      {/* Scrollable module chips */}
      <div
        className="flex items-center gap-1 px-2 flex-1 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Page chips — navigable in preview */}
        {pageAssets.map((asset) => {
          const isCurrent = asset.id === currentId
          const isVisited = visitedIds.has(asset.id) && !isCurrent
          const colors = NODE_TYPE_COLORS[asset.nodeType]
          const Icon = asset.icon

          return (
            <button
              key={asset.id}
              onClick={() => onNavigate(asset.id)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono font-semibold shrink-0 transition-colors',
                isCurrent
                  ? 'border-primary/30 bg-primary/8 text-primary'
                  : isVisited
                    ? 'border-border text-muted/60 hover:text-foreground hover:border-white/15 hover:bg-card'
                    : 'border-transparent text-muted/40 hover:text-muted/70 hover:bg-card',
              )}
            >
              <Icon
                style={{
                  width: 9,
                  height: 9,
                  color: isCurrent ? colors.accent : isVisited ? 'rgba(161,161,170,0.5)' : 'rgba(161,161,170,0.3)',
                  flexShrink: 0,
                }}
                strokeWidth={2}
              />
              <span className="truncate max-w-[80px]">{asset.title}</span>
              <StatusDot status={asset.status} />
            </button>
          )
        })}

      </div>
    </div>
  )
}
