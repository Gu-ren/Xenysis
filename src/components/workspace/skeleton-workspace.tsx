'use client'

import { motion, useReducedMotion } from 'framer-motion'

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        animation: 'fs-shimmer 1.8s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

function PanelHeader() {
  return (
    <div className="flex items-center px-4 pt-3 pb-2 border-b border-border shrink-0" style={{ height: 37 }}>
      <Bone className="h-2 w-16" />
    </div>
  )
}

// ── Left panel skeleton (220px) ───────────────────────────────────────────────

function LeftSkeleton() {
  return (
    <aside
      className="flex flex-col h-full border-r border-border bg-background shrink-0"
      style={{ width: 220 }}
    >
      <PanelHeader />
      <div className="flex flex-col py-3 px-3 gap-3 flex-1">
        {[80, 65, 55, 60, 50, 45].map((w, i) => (
          <div key={i} className="flex items-center gap-2.5 px-1">
            <Bone className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Bone style={{ height: 10, width: `${w}%` }} />
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border shrink-0 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Bone style={{ height: 8, width: 70 }} />
            <Bone style={{ height: 8, width: 24 }} />
          </div>
          <Bone style={{ height: 4, width: '100%', borderRadius: 99 }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Bone style={{ height: 8, width: 80 }} />
            <Bone style={{ height: 8, width: 24 }} />
          </div>
          <Bone style={{ height: 4, width: '100%', borderRadius: 99 }} />
        </div>
      </div>
    </aside>
  )
}

// ── Center panel skeleton (flex-1) ────────────────────────────────────────────

function CenterSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 border-b border-border shrink-0" style={{ height: 37 }}>
        <Bone style={{ height: 20, width: 72, borderRadius: 6 }} />
        <Bone style={{ height: 20, width: 72, borderRadius: 6 }} />
      </div>
      {/* Nav bar */}
      <div className="flex items-center gap-2 px-3 border-b border-border shrink-0" style={{ height: 37 }}>
        {[64, 80, 56, 72, 48].map((w, i) => (
          <Bone key={i} style={{ height: 18, width: w, borderRadius: 4 }} />
        ))}
      </div>
      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full h-full rounded-xl overflow-hidden flex flex-col"
          style={{ maxWidth: 440, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Bone style={{ height: 48, borderRadius: 0 }} />
          <div className="flex-1 bg-[rgba(255,255,255,0.02)] p-4 flex flex-col gap-3">
            <Bone style={{ height: 12, width: '70%' }} />
            <Bone style={{ height: 10, width: '50%' }} />
            <div className="mt-2 flex flex-col gap-2">
              {[1, 1, 1].map((_, i) => (
                <Bone key={i} style={{ height: 48, width: '100%', borderRadius: 8 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Right panel skeleton (300px) ──────────────────────────────────────────────

function RightSkeleton() {
  return (
    <aside
      className="flex flex-col h-full border-l border-border bg-background shrink-0 overflow-hidden"
      style={{ width: 300 }}
    >
      <PanelHeader />
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <Bone className="w-4 h-4 rounded-full shrink-0" />
              <Bone style={{ height: 10, width: '60%' }} />
            </div>
            <Bone style={{ height: 8, width: '90%' }} />
            <Bone style={{ height: 8, width: '75%' }} />
          </div>
        ))}
      </div>
    </aside>
  )
}

// ── Public export ─────────────────────────────────────────────────────────────

interface SkeletonWorkspaceProps {
  revealPhase?: number // 0=all skeleton, 1+=panels revealed L→C→R
}

export function SkeletonWorkspace({ revealPhase = 0 }: SkeletonWorkspaceProps) {
  const reduced = useReducedMotion()

  const dur = reduced ? 0 : 0.4

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealPhase >= 1 ? 1 : 0 }}
        transition={{ duration: dur, ease: 'easeOut' }}
        className="flex shrink-0"
      >
        <LeftSkeleton />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealPhase >= 2 ? 1 : 0 }}
        transition={{ duration: dur, ease: 'easeOut' }}
        className="flex flex-1 min-w-0"
      >
        <CenterSkeleton />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealPhase >= 3 ? 1 : 0 }}
        transition={{ duration: dur, ease: 'easeOut' }}
        className="flex shrink-0"
      >
        <RightSkeleton />
      </motion.div>
    </div>
  )
}
