export type { User, Session, AuthError } from "@/services/auth/types"

export type StartupLifecycleStage =
  | "founder-session"
  | "generating"
  | "preview"
  | "build"
  | "deployed"

export interface FounderSessionMeta {
  sessionId: string
  createdAt: string
  generationSource: "founder-session" | "manual"
}

export interface Startup {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  lifecycleStage: StartupLifecycleStage
  founderSession: FounderSessionMeta | null
}

export interface StartupHealth {
  score: number
  generationProgress: number
  deploymentReady: boolean
  assetCount: number
  workflowsActive: number
  deploymentStatus: "not-started" | "in-progress" | "deployed" | "error"
}

export interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}
