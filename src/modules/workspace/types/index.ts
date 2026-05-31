import type { ElementType } from 'react'

// ── Taxonomy ──────────────────────────────────────────────────────────────────

export type NodeType =
  | 'page'
  | 'database'
  | 'workflow'
  | 'api'
  | 'integration'
  | 'system'

export type AssetType =
  // page
  | 'marketing'
  | 'auth'
  | 'onboarding'
  | 'core'
  | 'settings'
  | 'billing'
  // database
  | 'table'
  | 'view'
  // workflow
  | 'automation'
  | 'trigger'
  | 'scheduled'
  // api
  | 'rest-endpoint'
  | 'webhook'
  // integration
  | 'payment'
  | 'email'
  | 'auth-provider'
  | 'storage'
  | 'analytics'
  // system
  | 'service'
  | 'middleware'

export type AssetStatus = 'generated' | 'needs-config' | 'planned'

export type RelationshipType =
  | 'navigates-to'
  | 'reads'
  | 'writes'
  | 'uses'
  | 'triggers'
  | 'calls'
  | 'authenticates'
  | 'sends'

// ── Canvas primitives ─────────────────────────────────────────────────────────

export interface WorkspaceAsset {
  id: string
  nodeType: NodeType
  assetType: AssetType
  status: AssetStatus

  title: string
  description: string
  route?: string

  // Canvas layout
  x: number
  y: number
  w: number
  h: number
  revealDelay: number
  isHub?: boolean

  // AI metadata
  purpose: string
  impact: string
  aiRecommendation?: string

  // Graph
  dependencies: string[]

  icon: ElementType
}

export interface WorkspaceConnector {
  id: string
  from: string
  to: string
  relationshipType: RelationshipType
  fromSide: 'top' | 'bottom' | 'left' | 'right'
  toSide: 'top' | 'bottom' | 'left' | 'right'
  animated?: boolean
  label?: string
}

export interface WorkspaceGraph {
  startupId: string
  startupName: string
  generatedAt: string
  assets: WorkspaceAsset[]
  connectors: WorkspaceConnector[]
}

// ── Hook / component helpers ──────────────────────────────────────────────────

export interface AssetPosition {
  id: string
  x: number
  y: number
}
