'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useFounderSessionStore } from '@/store'
import { useStartupStore } from '@/store/startup'
import { useGenerationSequence } from '../hooks/use-generation-sequence'
import { deriveStartupName } from '../services/generate'
import { StageList } from '../components/stage-list'
import { AssetTally } from '../components/asset-tally'

export function GenerationScreen() {
  const router = useRouter()
  const reduced = useReducedMotion()
  const idea = useFounderSessionStore((s) => s.idea)
  const blueprint = useFounderSessionStore((s) => s.blueprint)
  const setStartup = useStartupStore((s) => s.setStartup)

  const { stages, assetCount, isDone, result } = useGenerationSequence(idea, blueprint)
  const [exiting, setExiting] = useState(false)

  // Redirect if accessed without a founder session
  useEffect(() => {
    if (!blueprint) {
      router.replace('/founder-session')
    }
  }, [blueprint, router])

  // On completion: hold 2.5s, fade out, then navigate
  useEffect(() => {
    if (!isDone || !result) return
    setStartup(result.startupId, result.graph)
    const holdTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        router.push(`/startup/${result.startupId}/workspace`)
      }, 500)
    }, 2500)
    return () => clearTimeout(holdTimer)
  }, [isDone, result, setStartup, router])

  const startupName = result?.startupName ?? deriveStartupName(idea)

  const doneCount = stages.filter((s) => s.state === 'done').length
  const progress = stages.length > 0 ? doneCount / stages.length : 0

  return (
    <motion.div
      className="min-h-screen bg-background flex items-center justify-center"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: 'easeInOut' }}
    >
      <div className="w-full max-w-[380px] px-6 flex flex-col gap-10">

        {/* Header */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
        >
          <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: '#4FFAB0' }}>
            Xenysis
          </p>

          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: reduced ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="flex flex-col gap-1"
              >
                <h1 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                  Your startup is ready
                </h1>
                <p className="text-[13px] font-mono text-muted">
                  Entering workspace…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="building"
                initial={{ opacity: 0, y: reduced ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -4 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="flex flex-col gap-1"
              >
                <h1 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                  Building {startupName}
                </h1>
                <p className="text-[13px] font-mono text-muted">
                  Generating founder operating system
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stage list */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: 0.15 }}
        >
          <StageList stages={stages} />
        </motion.div>

        {/* Footer: progress bar + asset tally */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: 0.3 }}
        >
          {/* Progress bar */}
          <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-px"
              style={{ background: '#4FFAB0', transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isDone ? 1 : progress }}
              transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <AssetTally count={assetCount} isDone={isDone} />
        </motion.div>

      </div>
    </motion.div>
  )
}
