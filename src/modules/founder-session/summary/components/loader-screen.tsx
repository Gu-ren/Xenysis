'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'

export interface LoaderStageEntry {
  stageId: string
  label: string
  state: 'active' | 'done'
}

interface LoaderScreenProps {
  stages: LoaderStageEntry[]
  progress: number
  /** Set to true when generation is complete — triggers the exit animation. */
  done: boolean
  /** Called after the exit animation finishes. */
  onExited: () => void
  /** When set, displays an error inside the loader and exits immediately. */
  errorMessage?: string | null
}

export function LoaderScreen({
  stages,
  progress,
  done,
  onExited,
  errorMessage,
}: LoaderScreenProps) {
  const [exiting, setExiting] = useState(false)
  const exitedRef = useRef(false)

  useEffect(() => {
    if (!exitedRef.current && (done || errorMessage)) {
      exitedRef.current = true
      setExiting(true)
      // Errors exit faster — no need to show the "Finalizing..." bar.
      const delay = errorMessage ? 1800 : 1500
      const t = setTimeout(onExited, delay)
      return () => clearTimeout(t)
    }
  }, [done, errorMessage, onExited])

  return (
    <motion.div
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none xenysis-grid opacity-40"
      />

      <div className="relative flex flex-col items-center text-center px-8 max-w-[480px] w-full">
        {/* Wordmark */}
        <motion.div className="flex mb-8 gap-2">
          <Image
            className="rounded-lg"
            src="/logo.svg"
            alt="Xenysis"
            width={28}
            height={28}
            priority
          />
          <span className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
            Xenysis
          </span>
        </motion.div>

        {errorMessage ? (
          /* ── Error state ─────────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <p className="text-[14px] text-foreground/55 leading-relaxed max-w-[320px]">
              {errorMessage}
            </p>
          </motion.div>
        ) : (
          /* ── Generation progress state ──────────────────────────────────── */
          <>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[28px] sm:text-[34px] font-medium text-foreground tracking-tight leading-tight mb-10"
            >
              Analyzing your
              <br />
              startup opportunity.
            </motion.h1>

            {/* Stage checklist */}
            <ul className="flex flex-col gap-3.5 w-full max-w-[300px] mb-10">
              {stages.length === 0
                ? /* Skeleton placeholders while awaiting first stage event */
                  Array.from({ length: 4 }).map((_, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.18 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <span className="shrink-0 w-4 h-4 rounded-full bg-foreground/15" />
                      <span className="h-3 w-36 rounded bg-foreground/[0.07]" />
                    </motion.li>
                  ))
                : stages.map((stage) => (
                    <motion.li
                      key={stage.stageId}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3"
                    >
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                        {stage.state === 'done' ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <motion.path
                              d="M2.5 7.5L5.5 10.5L11.5 4"
                              stroke="#4ffab0"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                          </svg>
                        ) : (
                          <motion.span
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        )}
                      </span>
                      <span className="text-[14px] text-foreground/55 font-light text-left leading-none">
                        {stage.label}
                      </span>
                    </motion.li>
                  ))}
            </ul>

            {/* Progress bar */}
            <AnimatePresence>
              {(stages.length > 0 || progress > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-3 w-full max-w-[260px]"
                >
                  <div className="w-full h-[2px] bg-foreground/[0.07] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all ease-in-out"
                      style={{ width: `${progress}%`, transitionDuration: '0.8s' }}
                    />
                  </div>
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[11px] text-foreground/30 font-light italic tracking-wide"
                  >
                    {progress >= 100 ? 'Finalizing report…' : 'Generating assessment…'}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  )
}
