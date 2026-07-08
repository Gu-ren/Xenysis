'use client'

import { useRouter } from 'next/navigation'
import { ArrowUpRight, Clock } from 'lucide-react'
import { useStartupStore } from '@/store/startup'
import type { StartupWithHealth } from '../types'
import type { StartupLifecycleStage } from '@/types'

// ── Stage metadata ────────────────────────────────────────────────────────────

const STAGE_CONFIG: Record<
  StartupLifecycleStage,
  { label: string; color: string; bg: string }
> = {
  'founder-session': {
    label: 'Discovery',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.12)',
  },
  generating: {
    label: 'Generating',
    color: '#FCD34D',
    bg: 'rgba(252,211,77,0.12)',
  },
  preview: {
    label: 'Preview',
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.12)',
  },
  build: {
    label: 'Building',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.12)',
  },
  deployed: {
    label: 'Deployed',
    color: '#4FFAB0',
    bg: 'rgba(79,250,176,0.12)',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  startup: StartupWithHealth
}

export function ProjectCard({ startup }: ProjectCardProps) {
  const router = useRouter()
  const setStartupId = useStartupStore((s) => s.setStartupId)

  const stage = STAGE_CONFIG[startup.lifecycleStage] ?? STAGE_CONFIG['founder-session']

  const handleClick = () => {
    setStartupId(startup.id)
    router.push('/session-summary')
  }

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left rounded-[12px] p-5 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4FFAB0]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-left line-clamp-2"
          style={{ color: '#F5F5F5' }}
        >
          {startup.name}
        </h3>
        <ArrowUpRight
          className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: '#4FFAB0' }}
        />
      </div>

      {/* Description */}
      {startup.description && (
        <p
          className="text-[13px] leading-relaxed mb-4 line-clamp-2 text-left"
          style={{ color: '#888888' }}
        >
          {startup.description}
        </p>
      )}

      {/* Health progress bar */}
      {startup.health.score > 0 && (
        <div
          className="h-[2px] rounded-full mb-4 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${startup.health.score}%`,
              background: 'linear-gradient(90deg, #4FFAB0, #44E5A9)',
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Stage badge */}
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium"
          style={{
            color: stage.color,
            background: stage.bg,
          }}
        >
          {stage.label}
        </span>

        {/* Created date */}
        <span
          className="flex items-center gap-1 text-[11px] font-mono"
          style={{ color: '#555555' }}
        >
          <Clock className="w-3 h-3" />
          {formatDate(startup.createdAt)}
        </span>
      </div>
    </button>
  )
}
