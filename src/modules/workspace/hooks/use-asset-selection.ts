'use client'

import { useState, useCallback } from 'react'

interface UseAssetSelectionReturn {
  selectedId: string | null
  hoveredId: string | null
  select: (id: string) => void
  hover: (id: string) => void
  clearHover: () => void
  deselect: () => void
}

export function useAssetSelection(): UseAssetSelectionReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const select = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const hover = useCallback((id: string) => {
    setHoveredId(id)
  }, [])

  const clearHover = useCallback(() => {
    setHoveredId(null)
  }, [])

  const deselect = useCallback(() => {
    setSelectedId(null)
  }, [])

  return { selectedId, hoveredId, select, hover, clearHover, deselect }
}
