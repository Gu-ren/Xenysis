'use client'

import { useState, useEffect } from 'react'
import { GENERATION_STAGES } from '../constants'
import { generateStartup } from '../services/generate'
import type { ActiveStage, GenerationResult } from '../types'
import type { StartupBlueprint } from '@/modules/founder-session/types'

interface UseGenerationSequenceReturn {
  stages: ActiveStage[]
  assetCount: number
  isDone: boolean
  result: GenerationResult | null
}

export function useGenerationSequence(
  idea: string,
  blueprint: StartupBlueprint | null,
): UseGenerationSequenceReturn {
  const [stages, setStages] = useState<ActiveStage[]>(() =>
    GENERATION_STAGES.map((s) => ({ ...s, state: 'pending' as const })),
  )
  const [assetCount, setAssetCount] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  useEffect(() => {
    let cancelled = false
    const ids: ReturnType<typeof setTimeout>[] = []

    // BACKEND: replace with a real SSE/websocket stream from POST /startups/generate
    // The timer-driven stage progression below simulates server-side progress events.
    const generationPromise = generateStartup(idea, blueprint)

    let elapsed = 0

    GENERATION_STAGES.forEach((stage, index) => {
      const activateAt = elapsed
      elapsed += stage.durationMs
      const completeAt = elapsed

      ids.push(
        setTimeout(() => {
          if (cancelled) return
          setStages((prev) =>
            prev.map((s, i) => (i === index ? { ...s, state: 'active' as const } : s)),
          )
        }, activateAt),
      )

      ids.push(
        setTimeout(() => {
          if (cancelled) return
          setStages((prev) =>
            prev.map((s, i) => (i === index ? { ...s, state: 'done' as const } : s)),
          )
          if (stage.assetCount > 0) {
            setAssetCount((prev) => prev + stage.assetCount)
          }
          if (index === GENERATION_STAGES.length - 1) {
            generationPromise.then((r) => {
              if (cancelled) return
              setResult(r)
              setIsDone(true)
            })
          }
        }, completeAt),
      )
    })

    return () => {
      cancelled = true
      ids.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { stages, assetCount, isDone, result }
}
