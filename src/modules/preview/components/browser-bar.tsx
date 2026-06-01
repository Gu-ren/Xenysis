'use client'

import { RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrowserBarProps {
  domain: string
  route?: string
  isLoading?: boolean
  onRefresh?: () => void
}

export function BrowserBar({ domain, route = '/', isLoading, onRefresh }: BrowserBarProps) {
  const url = domain + (route && !route.startsWith('/') ? '/' + route : route)

  return (
    <div
      className="flex items-center gap-3 px-4 shrink-0"
      style={{
        height: 40,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0a0a0a',
      }}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444', opacity: 0.55 }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B', opacity: 0.55 }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E', opacity: 0.55 }} />
      </div>

      {/* URL bar */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center px-3 rounded-md"
          style={{
            height: 26,
            width: '100%',
            maxWidth: 480,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span
            className="font-mono truncate"
            style={{ fontSize: 11, color: 'rgba(250,250,250,0.45)', letterSpacing: '0.01em' }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        aria-label="Refresh"
        className="flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0"
        style={{ width: 24, height: 24 }}
      >
        <RotateCw
          size={12}
          strokeWidth={2}
          className={cn(isLoading && 'animate-spin')}
        />
      </button>
    </div>
  )
}
