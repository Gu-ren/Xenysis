'use client'

import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeviceMode } from '@/modules/preview/types'

const DEVICES = [
  { mode: 'desktop' as DeviceMode, Icon: Monitor,     label: 'Desktop' },
  { mode: 'mobile'  as DeviceMode, Icon: Smartphone,  label: 'Mobile'  },
] as const

interface PreviewToolbarProps {
  deviceMode: DeviceMode
  onDeviceModeChange: (mode: DeviceMode) => void
}

export function PreviewToolbar({ deviceMode, onDeviceModeChange }: PreviewToolbarProps) {
  return (
    <div
      className="flex items-center justify-end px-3 shrink-0 border-b border-border bg-background"
      style={{ height: 36 }}
    >
      {/* Device mode toggle */}
      <div className="flex items-center gap-px p-0.5 rounded-lg border border-border bg-card">
        {DEVICES.map(({ mode, Icon, label }) => (
          <button
            key={mode}
            title={label}
            onClick={() => onDeviceModeChange(mode)}
            className={cn(
              'flex items-center justify-center w-7 h-6 rounded-md transition-colors',
              deviceMode === mode
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground',
            )}
          >
            <Icon size={12} strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </div>
  )
}
