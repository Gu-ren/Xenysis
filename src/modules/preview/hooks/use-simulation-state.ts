'use client'

import { useState, useCallback } from 'react'

export type NavDirection = 'forward' | 'back'

export interface SimulationState {
  currentId: string | null
  history: string[]
  visitedIds: Set<string>
  direction: NavDirection
  canGoBack: boolean
  navigateTo: (id: string) => void
  goBack: () => void
  reset: () => void
  init: (firstId: string) => void
}

export function useSimulationState(): SimulationState {
  const [history, setHistory] = useState<string[]>([])
  const [direction, setDirection] = useState<NavDirection>('forward')

  const currentId = history.length > 0 ? history[history.length - 1] : null
  const canGoBack = history.length > 1

  const navigateTo = useCallback((id: string) => {
    setDirection('forward')
    setHistory((prev) => [...prev, id])
  }, [])

  const goBack = useCallback(() => {
    setDirection('back')
    setHistory((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)))
  }, [])

  const reset = useCallback(() => {
    setDirection('back')
    setHistory((prev) => (prev.length <= 1 ? prev : [prev[0]]))
  }, [])

  const init = useCallback((firstId: string) => {
    setHistory((prev) => (prev.length > 0 ? prev : [firstId]))
  }, [])

  return {
    currentId,
    history,
    visitedIds: new Set(history),
    direction,
    canGoBack,
    navigateTo,
    goBack,
    reset,
    init,
  }
}
