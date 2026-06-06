'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOADER_CHECKLIST } from '../summary.constants'
import Image from 'next/image'
interface LoaderScreenProps {
  onDone: () => void
}

export function LoaderScreen({ onDone }: LoaderScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const [barProgress, setBarProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    LOADER_CHECKLIST.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 300 + i * 420))
    })

    const barDelay = 300 + LOADER_CHECKLIST.length * 420 + 200
    timers.push(setTimeout(() => setShowBar(true), barDelay))
    timers.push(setTimeout(() => setBarProgress(100), barDelay + 80))
    timers.push(setTimeout(() => setExiting(true), barDelay + 1500))
    timers.push(setTimeout(() => onDone(), barDelay + 2000))

    return () => timers.forEach(clearTimeout)
  }, [onDone])

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

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[28px] sm:text-[34px] font-medium text-foreground tracking-tight leading-tight mb-10"
        >
          Xenysis has gathered
          <br />
          enough evidence.
        </motion.h1>

        {/* Checklist */}
        <ul className="flex flex-col gap-3.5 w-full max-w-[300px] mb-10">
          {LOADER_CHECKLIST.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -6 }}
              animate={visibleCount > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <motion.path
                    d="M2.5 7.5L5.5 10.5L11.5 4"
                    stroke="#4ffab0"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={visibleCount > i ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
                  />
                </svg>
              </span>
              <span className="text-[14px] text-foreground/55 font-light text-left leading-none">
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* Progress bar */}
        <AnimatePresence>
          {showBar && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3 w-full max-w-[260px]"
            >
              <div className="w-full h-[2px] bg-foreground/[0.07] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all ease-in-out"
                  style={{ width: `${barProgress}%`, transitionDuration: '1.3s' }}
                />
              </div>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[11px] text-foreground/30 font-light italic tracking-wide"
              >
                Generating recommendation...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
