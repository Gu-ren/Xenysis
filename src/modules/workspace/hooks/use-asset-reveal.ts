'use client'

import { useState, useEffect } from 'react'
import type { WorkspaceAsset } from '../types'

// Staggered reveal: each asset appears after (revealDelay * interval)ms
const INTERVAL_MS = 80

export function useAssetReveal(assets: WorkspaceAsset[]): Set<string> {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (assets.length === 0) return

    const timers: ReturnType<typeof setTimeout>[] = []

    assets.forEach((asset) => {
      const delay = asset.revealDelay * INTERVAL_MS
      const t = setTimeout(() => {
        setRevealed((prev) => {
          const next = new Set(prev)
          next.add(asset.id)
          return next
        })
      }, delay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [assets])

  return revealed
}
