'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export interface LoadingStep {
  label: string
  durationMs?: number
}

interface CommandCenterLoadingProps {
  title: string
  subtitle?: string
  steps: LoadingStep[]
  onComplete?: () => void
  className?: string
}

export function CommandCenterLoading({
  title,
  subtitle,
  steps,
  onComplete,
  className,
}: CommandCenterLoadingProps) {
  const reduced = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced) {
      setActiveIndex(steps.length - 1)
      setDone(true)
      const t = setTimeout(() => onComplete?.(), 0)
      return () => clearTimeout(t)
    }

    let i = 0
    let cancelled = false

    function advance() {
      if (cancelled) return
      const delay = steps[i]?.durationMs ?? 480
      setTimeout(() => {
        if (cancelled) return
        i++
        setActiveIndex(i)
        if (i >= steps.length) {
          setDone(true)
          setTimeout(() => { if (!cancelled) onComplete?.() }, 300)
        } else {
          advance()
        }
      }, delay)
    }

    advance()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`flex flex-col items-start gap-8 ${className ?? ''}`}>
      {/* Header */}
      <motion.div
        className="flex flex-col gap-1.5"
        initial={{ opacity: 0, y: reduced ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#4FFAB0' }}>
          Xenysis
        </p>
        <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em]">{title}</h2>
        {subtitle && (
          <p className="text-[13px] text-muted font-mono">{subtitle}</p>
        )}
      </motion.div>

      {/* Steps */}
      <motion.div
        className="flex flex-col gap-3 w-full"
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {steps.map((step, i) => {
          const isComplete = i < activeIndex
          const isActive = i === activeIndex && !done
          const isPending = i > activeIndex

          return (
            <div key={step.label} className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.svg
                      key="check"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="w-3.5 h-3.5"
                      initial={{ opacity: 0, scale: reduced ? 1 : 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="#4FFAB0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  ) : isActive ? (
                    <motion.span
                      key="pulse"
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#4FFAB0' }}
                      animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ) : (
                    <motion.span
                      key="dot"
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span
                className="text-[13px] font-mono transition-colors duration-300"
                style={{
                  color: isComplete
                    ? '#FAFAFA'
                    : isActive
                    ? '#FAFAFA'
                    : 'rgba(255,255,255,0.3)',
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="w-full h-px"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.div
          className="h-px"
          style={{ background: '#4FFAB0', transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: done ? 1 : activeIndex / steps.length }}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  )
}
