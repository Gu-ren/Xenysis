"use client"

import { useEffect, useState } from "react"
import { fetchStartups } from "../services/startups"
import type { StartupWithHealth } from "../types"

interface UseStartupsResult {
  startups: StartupWithHealth[]
  loading: boolean
  error: Error | null
}

// Client-side hook for cases that require live refetching.
// The projects page uses server-side fetching by default via ProjectsScreen.
export function useStartups(): UseStartupsResult {
  const [startups, setStartups] = useState<StartupWithHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchStartups()
      .then(setStartups)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { startups, loading, error }
}
