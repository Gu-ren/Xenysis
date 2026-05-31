'use client'

import { ArrowLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  id: string
  title: string
}

interface SimulationBarProps {
  breadcrumb: BreadcrumbItem[]
  canGoBack: boolean
  onBack: () => void
  onReset: () => void
}

const MAX_CRUMBS = 5

export function SimulationBar({ breadcrumb, canGoBack, onBack, onReset }: SimulationBarProps) {
  const truncated = breadcrumb.length > MAX_CRUMBS
  const visible = truncated ? breadcrumb.slice(-MAX_CRUMBS) : breadcrumb

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: 36,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0a0a0a',
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={cn(
          'flex items-center gap-1.5 transition-colors select-none',
          canGoBack
            ? 'text-muted hover:text-foreground cursor-pointer'
            : 'text-muted/25 cursor-not-allowed'
        )}
        style={{ fontSize: 11 }}
      >
        <ArrowLeft size={11} strokeWidth={2} />
        Back
      </button>

      {/* Breadcrumb path */}
      <div className="flex items-center gap-1 min-w-0">
        {truncated && (
          <span style={{ fontSize: 10, color: 'rgba(161,161,170,0.25)' }}>…</span>
        )}
        {truncated && (
          <span style={{ fontSize: 10, color: 'rgba(161,161,170,0.2)', marginLeft: 2, marginRight: 2 }}>›</span>
        )}
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1
          return (
            <div key={`${item.id}-${i}`} className="flex items-center gap-1 min-w-0">
              <span
                className="truncate"
                style={{
                  fontSize: 11,
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? 'rgba(250,250,250,0.85)' : 'rgba(161,161,170,0.35)',
                  maxWidth: 100,
                }}
              >
                {item.title}
              </span>
              {!isLast && (
                <span style={{ fontSize: 11, color: 'rgba(161,161,170,0.2)', flexShrink: 0 }}>›</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        disabled={!canGoBack}
        className={cn(
          'flex items-center gap-1.5 transition-colors select-none',
          canGoBack
            ? 'text-muted hover:text-foreground cursor-pointer'
            : 'text-muted/25 cursor-not-allowed'
        )}
        style={{ fontSize: 11 }}
      >
        <RotateCcw size={11} strokeWidth={2} />
        Reset
      </button>
    </div>
  )
}
