import { apiGet, hasBackend } from '@/lib/api'
import type { StartupWithHealth } from "../types"

// Mock data — active when NEXT_PUBLIC_API_URL is unset
const MOCK_STARTUPS: StartupWithHealth[] = [
  {
    id: "nova-crm",
    name: "NovaCRM",
    description: "AI-powered CRM for real estate teams",
    ownerId: "user_01",
    createdAt: "2026-05-20T10:00:00Z",
    lifecycleStage: "deployed",
    founderSession: {
      sessionId: "session_01",
      createdAt: "2026-05-20T09:30:00Z",
      generationSource: "founder-session",
    },
    health: {
      score: 92,
      generationProgress: 100,
      deploymentReady: true,
      assetCount: 14,
      workflowsActive: 3,
      deploymentStatus: "deployed",
    },
  },
  {
    id: "pulse-analytics",
    name: "Pulse Analytics",
    description: "Real-time product analytics for B2B SaaS",
    ownerId: "user_01",
    createdAt: "2026-05-28T14:00:00Z",
    lifecycleStage: "build",
    founderSession: {
      sessionId: "session_02",
      createdAt: "2026-05-28T13:30:00Z",
      generationSource: "founder-session",
    },
    health: {
      score: 61,
      generationProgress: 78,
      deploymentReady: false,
      assetCount: 9,
      workflowsActive: 1,
      deploymentStatus: "in-progress",
    },
  },
]

export async function fetchStartups(): Promise<StartupWithHealth[]> {
  if (hasBackend) return apiGet<StartupWithHealth[]>('/startups')
  await new Promise((resolve) => setTimeout(resolve, 0))
  return MOCK_STARTUPS
}
