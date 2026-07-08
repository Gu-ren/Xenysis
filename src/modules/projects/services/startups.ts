import { apiGet, apiPost, apiPatch, apiDelete, hasBackend } from '@/lib/api'
import type { Startup, StartupHealth } from '@/types'
import type { StartupWithHealth } from '../types'

// API response shapes (camelCase — Drizzle/Hono returns camelCase field names)
interface ApiStartup {
  id: string
  userId: string
  name: string
  description: string | null
  category: string | null
  lifecycleStage: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface ApiStartupHealth {
  startupId: string
  score: number
  generationProgress: number
  deploymentReady: boolean
  assetCount: number
  deploymentStatus: string
}

function mapStartup(s: ApiStartup): Startup {
  return {
    id:             s.id,
    name:           s.name,
    description:    s.description ?? '',
    ownerId:        s.userId,
    createdAt:      s.createdAt,
    lifecycleStage: s.lifecycleStage as Startup['lifecycleStage'],
    founderSession: null,
  }
}

const DEFAULT_HEALTH: StartupHealth = {
  score:              0,
  generationProgress: 0,
  deploymentReady:    false,
  assetCount:         0,
  workflowsActive:    0,
  deploymentStatus:   'not-started',
}

// ── Mock data (active when NEXT_PUBLIC_API_URL is unset) ──────────────────────

const MOCK_STARTUPS: StartupWithHealth[] = [
  {
    id: 'nova-crm',
    name: 'NovaCRM',
    description: 'AI-powered CRM for real estate teams',
    ownerId: 'user_01',
    createdAt: '2026-05-20T10:00:00Z',
    lifecycleStage: 'deployed',
    founderSession: { sessionId: 'session_01', createdAt: '2026-05-20T09:30:00Z', generationSource: 'founder-session' },
    health: { score: 92, generationProgress: 100, deploymentReady: true, assetCount: 14, workflowsActive: 3, deploymentStatus: 'deployed' },
  },
  {
    id: 'pulse-analytics',
    name: 'Pulse Analytics',
    description: 'Real-time product analytics for B2B SaaS',
    ownerId: 'user_01',
    createdAt: '2026-05-28T14:00:00Z',
    lifecycleStage: 'build',
    founderSession: { sessionId: 'session_02', createdAt: '2026-05-28T13:30:00Z', generationSource: 'founder-session' },
    health: { score: 61, generationProgress: 78, deploymentReady: false, assetCount: 9, workflowsActive: 1, deploymentStatus: 'in-progress' },
  },
]

// ── API functions ─────────────────────────────────────────────────────────────

export async function fetchStartups(): Promise<StartupWithHealth[]> {
  if (!hasBackend) {
    await new Promise((r) => setTimeout(r, 0))
    return MOCK_STARTUPS
  }

  const { data } = await apiGet<{ data: ApiStartup[] }>('/api/v1/startups')
  return data.map((s) => ({ ...mapStartup(s), health: DEFAULT_HEALTH }))
}

export async function fetchStartup(id: string): Promise<StartupWithHealth> {
  if (!hasBackend) {
    const found = MOCK_STARTUPS.find((s) => s.id === id)
    if (!found) throw new Error(`Startup ${id} not found`)
    return found
  }

  const [startupRes, healthRes] = await Promise.allSettled([
    apiGet<{ data: ApiStartup }>(`/api/v1/startups/${id}`),
    apiGet<{ data: ApiStartupHealth }>(`/api/v1/startups/${id}/health`),
  ])

  if (startupRes.status === 'rejected') throw startupRes.reason

  const startup = mapStartup(startupRes.value.data)
  const health: StartupHealth =
    healthRes.status === 'fulfilled'
      ? {
          score:              healthRes.value.data.score,
          generationProgress: healthRes.value.data.generationProgress,
          deploymentReady:    healthRes.value.data.deploymentReady,
          assetCount:         healthRes.value.data.assetCount,
          workflowsActive:    0,
          deploymentStatus:   healthRes.value.data.deploymentStatus as StartupHealth['deploymentStatus'],
        }
      : DEFAULT_HEALTH

  return { ...startup, health }
}

export async function createStartup(data: {
  name: string
  description?: string
  category?: string
}): Promise<StartupWithHealth> {
  if (!hasBackend) {
    return {
      id: `mock-${Date.now()}`,
      name: data.name,
      description: data.description ?? '',
      ownerId: 'user_01',
      createdAt: new Date().toISOString(),
      lifecycleStage: 'founder-session',
      founderSession: null,
      health: DEFAULT_HEALTH,
    }
  }

  const { data: created } = await apiPost<typeof data, { data: ApiStartup }>(
    '/api/v1/startups',
    data,
  )
  return { ...mapStartup(created), health: DEFAULT_HEALTH }
}

export async function updateStartup(
  id: string,
  updates: Partial<{ name: string; description: string | null; category: string | null }>,
): Promise<Startup> {
  const { data } = await apiPatch<typeof updates, { data: ApiStartup }>(
    `/api/v1/startups/${id}`,
    updates,
  )
  return mapStartup(data)
}

export async function deleteStartup(id: string): Promise<void> {
  await apiDelete<void>(`/api/v1/startups/${id}`)
}
