'use client'

import { useMemo } from 'react'
import type { WorkspaceGraph } from '@/modules/workspace/types'
import type { JourneyScreen, StartupJourney } from '../types'

const EMPTY_JOURNEY: StartupJourney = { screens: [], screenMap: new Map() }

export function useStartupJourney(graph: WorkspaceGraph | null): StartupJourney {
  return useMemo(() => {
    if (!graph) return EMPTY_JOURNEY

    const pageAssets = graph.assets.filter((a) => a.nodeType === 'page')
    if (pageAssets.length === 0) return EMPTY_JOURNEY

    const pageIds = new Set(pageAssets.map((a) => a.id))

    // Build navigation adjacency from navigates-to connectors between pages only.
    // Other connector types (reads, writes, etc.) are not part of the UX journey.
    const outgoing = new Map<string, string[]>()
    const incoming = new Map<string, string[]>()

    for (const c of graph.connectors) {
      if (c.relationshipType !== 'navigates-to') continue
      if (!pageIds.has(c.from) || !pageIds.has(c.to)) continue
      if (!outgoing.has(c.from)) outgoing.set(c.from, [])
      if (!incoming.has(c.to)) incoming.set(c.to, [])
      outgoing.get(c.from)!.push(c.to)
      incoming.get(c.to)!.push(c.from)
    }

    // Roots are pages with no incoming navigates-to edges (entry points of the app).
    const roots = pageAssets.filter((a) => !incoming.has(a.id))
    const seedIds = roots.length > 0 ? roots.map((r) => r.id) : [pageAssets[0].id]

    // BFS — preserves the natural flow order a user would experience.
    // depth is tracked per node for future flow-animation use.
    const visited = new Set<string>()
    const queue: Array<{ id: string; depth: number }> = seedIds.map((id) => ({ id, depth: 0 }))
    const ordered: Array<{ id: string; depth: number }> = []

    while (queue.length > 0) {
      const item = queue.shift()!
      if (visited.has(item.id)) continue
      visited.add(item.id)
      ordered.push(item)
      for (const nextId of outgoing.get(item.id) ?? []) {
        if (!visited.has(nextId)) queue.push({ id: nextId, depth: item.depth + 1 })
      }
    }

    // Append any pages not reachable via navigates-to (isolated screens).
    for (const asset of pageAssets) {
      if (!visited.has(asset.id)) ordered.push({ id: asset.id, depth: 0 })
    }

    const assetMap = new Map(pageAssets.map((a) => [a.id, a]))
    const screens: JourneyScreen[] = ordered.map(({ id, depth }) => {
      const asset = assetMap.get(id)!
      const nextScreenIds = outgoing.get(id) ?? []
      const prevScreenIds = incoming.get(id) ?? []
      return {
        asset,
        depth,
        nextScreenIds,
        prevScreenIds,
        isRoot: prevScreenIds.length === 0,
        isLeaf: nextScreenIds.length === 0,
      }
    })

    const screenMap = new Map(screens.map((s) => [s.asset.id, s]))
    return { screens, screenMap }
  }, [graph])
}
