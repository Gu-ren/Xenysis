import type { WorkspaceGraph } from '@/modules/workspace/types'

export type StageState = 'pending' | 'active' | 'done'

export interface GenerationStage {
  id: string
  label: string
  sublabel: string
  durationMs: number
  assetCount: number
}

export type ActiveStage = GenerationStage & {
  state: StageState
}

export interface GenerationResult {
  startupId: string
  startupName: string
  graph: WorkspaceGraph
}
