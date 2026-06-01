'use client'

import { motion, AnimatePresence } from 'framer-motion'

// ── Shared primitive ──────────────────────────────────────────────────────────

export function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
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

// ── Mode bar skeleton (matches WorkspaceModeBar h-9) ─────────────────────────

export function SkeletonModeBar() {
  return (
    <div
      className="flex items-center justify-between px-4 border-b border-border shrink-0 bg-background"
      style={{ height: 36 }}
    >
      <Bone style={{ height: 16, width: 88, borderRadius: 6 }} />
      <div className="flex items-center gap-px rounded-lg border border-border overflow-hidden">
        <Bone style={{ height: 24, width: 68, borderRadius: 0 }} />
        <Bone style={{ height: 24, width: 80, borderRadius: 0 }} />
      </div>
      <div className="flex items-center gap-1.5">
        <Bone style={{ height: 24, width: 90, borderRadius: 6 }} />
        <Bone style={{ height: 24, width: 66, borderRadius: 6 }} />
      </div>
    </div>
  )
}

// ── Left panel skeleton (220px, mirrors StartupProgressPanel) ─────────────────

export function SkeletonLeft() {
  return (
    <aside
      className="flex flex-col h-full border-r border-border bg-background shrink-0"
      style={{ width: 220 }}
    >
      {/* Header */}
      <div className="flex items-center px-4 pt-3 pb-2 border-b border-border shrink-0" style={{ height: 37 }}>
        <Bone style={{ height: 8, width: 80 }} />
      </div>
      {/* Stage rows */}
      <div className="flex flex-col py-3 px-3 gap-2.5 flex-1">
        {([80, 65, 70, 55, 60, 50] as const).map((w, i) => (
          <div key={i} className="flex items-center gap-2.5 px-1 py-1.5">
            <Bone style={{ width: 14, height: 14, borderRadius: 99 }} />
            <Bone style={{ height: 9, width: `${w}%` }} />
          </div>
        ))}
      </div>
      {/* Readiness bars */}
      <div className="px-4 py-3 border-t border-border shrink-0 flex flex-col gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Bone style={{ height: 7, width: 70 }} />
              <Bone style={{ height: 7, width: 24 }} />
            </div>
            <Bone style={{ height: 4, width: '100%', borderRadius: 99 }} />
          </div>
        ))}
      </div>
    </aside>
  )
}

// ── Center panel skeleton (flex-1, mirrors StartupPreviewPanel) ───────────────

export function SkeletonCenter() {
  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* Device toolbar */}
      <div
        className="flex items-center gap-2 px-3 border-b border-border shrink-0"
        style={{ height: 37 }}
      >
        <Bone style={{ height: 20, width: 76, borderRadius: 6 }} />
        <Bone style={{ height: 20, width: 76, borderRadius: 6 }} />
      </div>
      {/* Module nav bar */}
      <div
        className="flex items-center gap-2 px-3 border-b border-border shrink-0"
        style={{ height: 37 }}
      >
        {[56, 72, 48, 80, 56].map((w, i) => (
          <Bone key={i} style={{ height: 18, width: w, borderRadius: 4 }} />
        ))}
      </div>
      {/* Preview viewport */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full h-full rounded-xl overflow-hidden flex flex-col"
          style={{ maxWidth: 440, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Phone chrome / app header */}
          <Bone style={{ height: 48, borderRadius: 0 }} />
          {/* Content area */}
          <div className="flex-1 p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Bone style={{ height: 12, width: '70%' }} />
            <Bone style={{ height: 10, width: '45%' }} />
            <div className="mt-2 flex flex-col gap-2">
              <Bone style={{ height: 52, width: '100%', borderRadius: 8 }} />
              <Bone style={{ height: 52, width: '100%', borderRadius: 8 }} />
              <Bone style={{ height: 52, width: '100%', borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Right panel skeleton (300px, mirrors CopilotPanel) ────────────────────────

export function SkeletonRight() {
  return (
    <aside
      className="flex flex-col h-full border-l border-border bg-background shrink-0 overflow-hidden"
      style={{ width: 300 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border shrink-0" style={{ height: 37 }}>
        <Bone style={{ width: 14, height: 14, borderRadius: 3 }} />
        <Bone style={{ height: 8, width: 56 }} />
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-4 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-3 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <Bone style={{ width: 16, height: 16, borderRadius: 99 }} />
              <Bone style={{ height: 9, width: '60%' }} />
            </div>
            <Bone style={{ height: 8, width: '90%' }} />
            <Bone style={{ height: 8, width: '75%' }} />
          </div>
        ))}
      </div>
    </aside>
  )
}

// ── Crossfade zone helper ─────────────────────────────────────────────────────
// Wraps a skeleton and its real replacement in an absolute container so both
// can exist simultaneously during the crossfade without causing layout shift.

interface ZoneProps {
  show: boolean          // true = show real content, false = show skeleton
  skeleton: React.ReactNode
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SkeletonZone({ show, skeleton, children, className, style }: ZoneProps) {
  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      <AnimatePresence>
        {!show && (
          <motion.div
            key="skeleton"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {skeleton}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
