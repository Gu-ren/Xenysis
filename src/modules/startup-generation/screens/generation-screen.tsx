'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useFounderSessionStore } from '@/store'
import { useStartupStore } from '@/store/startup'
import { useGenerationSequence } from '../hooks/use-generation-sequence'
import { deriveStartupName } from '../services/generate'
import { StageList } from '../components/stage-list'
import { AssetTally } from '../components/asset-tally'

export function GenerationScreen() {
  const router = useRouter()
  const idea = useFounderSessionStore((s) => s.idea)
  const blueprint = useFounderSessionStore((s) => s.blueprint)
  const setStartup = useStartupStore((s) => s.setStartup)

  const { stages, assetCount, isDone, result } = useGenerationSequence(idea, blueprint)

  // Redirect if no blueprint (direct URL access without founder session)
  useEffect(() => {
    if (!blueprint) {
      router.replace('/founder-session')
    }
  }, [blueprint, router])

  // On completion: write to store, navigate after brief hold
  useEffect(() => {
    if (!isDone || !result) return
    setStartup(result.startupId, result.graph)
    const t = setTimeout(() => {
      router.push(`/startup/${result.startupId}/workspace`)
    }, 1400)
    return () => clearTimeout(t)
  }, [isDone, result, setStartup, router])

  // Derive name immediately so headline is stable before async resolves
  const startupName = result?.startupName ?? deriveStartupName(idea)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-[360px] px-6 flex flex-col gap-8">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-mono text-primary tracking-widest uppercase">
             Xenysis
          </p>

          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.h1
                key="done"
                className="text-xl font-semibold text-foreground"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Your startup is ready
              </motion.h1>
            ) : (
              <motion.h1
                key="building"
                className="text-xl font-semibold text-foreground"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Building {startupName}
              </motion.h1>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDone && (
              <motion.p
                className="text-sm font-mono text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Entering workspace…
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stage list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <StageList stages={stages} />
        </motion.div>

        {/* Asset tally */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AssetTally count={assetCount} isDone={isDone} />
        </motion.div>
      </div>
    </div>
  )
}
