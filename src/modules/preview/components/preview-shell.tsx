'use client'

import Link from 'next/link'
import { ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeviceMode } from '../types'

interface PreviewShellProps {
  startupId: string
  startupName: string
  deviceMode: DeviceMode
  onDeviceModeChange: (mode: DeviceMode) => void
}

const DEVICE_BUTTONS = [
  { mode: 'desktop' as DeviceMode, Icon: Monitor    },
  { mode: 'tablet'  as DeviceMode, Icon: Tablet     },
  { mode: 'mobile'  as DeviceMode, Icon: Smartphone },
] as const

export function PreviewShell({ startupId, startupName, deviceMode, onDeviceModeChange }: PreviewShellProps) {
  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-background shrink-0">
      <Link
        href={`/startup/${startupId}/workspace`}
        className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to Workspace
      </Link>

      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-xs font-semibold text-foreground">{startupName}</span>
        <span className="text-[9px] font-mono text-muted/40 tracking-widest uppercase ml-0.5">
          Preview
        </span>
      </div>

      <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-card">
        {DEVICE_BUTTONS.map(({ mode, Icon }) => (
          <button
            key={mode}
            onClick={() => onDeviceModeChange(mode)}
            aria-label={mode}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-md transition-colors',
              deviceMode === mode
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground'
            )}
          >
            <Icon size={13} strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </header>
  )
}
