import type { ElementType } from 'react'

export type SessionStep = 'welcome' | 'session' | 'summary' | 'generating' | 'complete'

export interface FounderAnswer {
  questionId: string
  question: string
  answer: string
  timestamp: string
}

// ── Canvas visualization ──────────────────────────────────────────────────────

export type CanvasNodeType = 'core' | 'opportunity'
export type CanvasNodeState = 'latent' | 'discovered' | 'understood' | 'building' | 'opportunity'

export interface CanvasNodeData {
  id: string
  label: string
  sublabel?: string
  type: CanvasNodeType
  state: CanvasNodeState
  icon?: ElementType
  cx: number
  cy: number
  buildProgress?: number
}

export interface CanvasEdgeData {
  from: string
  to: string
}

export interface ClaritySegment {
  id: string
  label: string
  progress: number
}

// ── Blueprint ─────────────────────────────────────────────────────────────────

export type SystemStatus = 'wired' | 'active' | 'generating' | 'pending'

export interface BlueprintSystem {
  name: string
  status: SystemStatus
}

export interface StartupBlueprint {
  businessModel: string
  detectedPattern: string
  systems: BlueprintSystem[]
  architectureScore: number
  workflowConfidence: string
}
