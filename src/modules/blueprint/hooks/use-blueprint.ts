'use client'

import { useCallback, useEffect, useState } from 'react'
import { useStartupStore } from '@/store/startup'
import { useFounderSessionStore } from '@/store/founder-session'
import { fetchCurrentBlueprint } from '../services/blueprint'
import type { BlueprintApiResponse } from '../types/blueprint-api'

interface UseBlueprintResult {
  blueprint: BlueprintApiResponse | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useBlueprint(overrideStartupId?: string | null): UseBlueprintResult {
  const storeStartupId   = useStartupStore((s) => s.startupId)
  const sessionStartupId = useFounderSessionStore((s) => s.startupId)
  // useStartupStore is the primary source; fall back to the founder-session store
  // so the blueprint page works on direct refresh after a session.
  const startupId = overrideStartupId ?? storeStartupId ?? sessionStartupId

  const [blueprint, setBlueprint] = useState<BlueprintApiResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<Error | null>(null)
  const [tick, setTick]           = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!startupId) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCurrentBlueprint(startupId)
      .then((data) => { if (!cancelled) setBlueprint(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err : new Error(String(err))) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [startupId, tick])

  return { blueprint, loading, error, refetch }
}
