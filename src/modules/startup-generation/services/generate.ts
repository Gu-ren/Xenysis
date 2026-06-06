import { apiPost, hasBackend } from '@/lib/api'
import { getWorkspaceGraph } from '@/modules/workspace/services/workspace'
import type { StartupBlueprint } from '@/modules/founder-session/types'
import type { GenerationResult } from '../types'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'with', 'of', 'in', 'on', 'at', 'by',
  'is', 'are', 'that', 'this', 'and', 'or', 'to', 'my', 'your',
  'our', 'build', 'building', 'create', 'creating', 'make', 'making',
])

const NAME_SUFFIXES = ['Flow', 'Base', 'Hub', 'AI', 'Stack', 'HQ']

export function deriveStartupName(idea: string): string {
  const words = idea
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  if (words.length === 0) return 'Your Startup'

  const hash = words.reduce((acc, w) => acc + w.charCodeAt(0), 0)
  const suffix = NAME_SUFFIXES[hash % NAME_SUFFIXES.length]
  const base = words[0]
  return base[0].toUpperCase() + base.slice(1) + suffix
}

// BACKEND: replace mock branch with apiPost<...>('/startups/generate', { idea, blueprint })
// The real endpoint returns { startupId, startupName, graph } after server-side generation.
export async function generateStartup(
  idea: string,
  blueprint: StartupBlueprint | null,
): Promise<GenerationResult> {
  if (hasBackend) {
    return apiPost<{ idea: string; blueprint: StartupBlueprint | null }, GenerationResult>(
      '/startups/generate',
      { idea, blueprint },
    )
  }
  const startupName = deriveStartupName(idea)
  const startupId = startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
  const graph = await getWorkspaceGraph(startupId)
  graph.startupName = startupName
  return { startupId, startupName, graph }
}
