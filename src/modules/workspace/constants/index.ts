import type { NodeType, RelationshipType } from '../types'

// ── Canvas sizing ─────────────────────────────────────────────────────────────

export const CANVAS_W = 3200
export const CANVAS_H = 2000
export const DEFAULT_ZOOM = 0.68
export const DEFAULT_PAN_X = 60
export const DEFAULT_PAN_Y = 80
export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 1.6

// ── Node type visual tokens ───────────────────────────────────────────────────
// All colors reference Xenysis design system. Accent values mirror CSS var
// equivalents where possible; others are on-brand extensions.

export const NODE_TYPE_COLORS: Record<
  NodeType,
  { accent: string; bg: string; text: string; border: string; glow: string }
> = {
  page: {
    accent: '#4ffab0',
    bg: 'rgba(79,250,176,0.08)',
    text: '#4ffab0',
    border: 'rgba(79,250,176,0.22)',
    glow: 'rgba(79,250,176,0.25)',
  },
  database: {
    accent: '#63b3ed',
    bg: 'rgba(99,179,237,0.08)',
    text: '#63b3ed',
    border: 'rgba(99,179,237,0.22)',
    glow: 'rgba(99,179,237,0.25)',
  },
  workflow: {
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    text: '#f59e0b',
    border: 'rgba(245,158,11,0.22)',
    glow: 'rgba(245,158,11,0.25)',
  },
  api: {
    accent: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    text: '#a78bfa',
    border: 'rgba(167,139,250,0.22)',
    glow: 'rgba(167,139,250,0.25)',
  },
  integration: {
    accent: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    text: '#fb923c',
    border: 'rgba(251,146,60,0.22)',
    glow: 'rgba(251,146,60,0.25)',
  },
  system: {
    accent: '#a1a1aa',
    bg: 'rgba(161,161,170,0.08)',
    text: '#a1a1aa',
    border: 'rgba(161,161,170,0.15)',
    glow: 'rgba(161,161,170,0.2)',
  },
}

// ── Node type labels ──────────────────────────────────────────────────────────

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  page: 'Page',
  database: 'Database',
  workflow: 'Workflow',
  api: 'API',
  integration: 'Integration',
  system: 'System',
}

// ── Relationship type colors ──────────────────────────────────────────────────

export const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  'navigates-to': 'rgba(79,250,176,0.70)',
  reads:          'rgba(99,179,237,0.65)',
  writes:         'rgba(99,179,237,0.85)',
  uses:           'rgba(161,161,170,0.55)',
  triggers:       'rgba(245,158,11,0.70)',
  calls:          'rgba(167,139,250,0.65)',
  authenticates:  'rgba(79,250,176,0.55)',
  sends:          'rgba(251,146,60,0.65)',
}

export const RELATIONSHIP_ANIMATED: Record<RelationshipType, boolean> = {
  'navigates-to': true,
  reads: true,
  writes: true,
  uses: false,
  triggers: true,
  calls: false,
  authenticates: false,
  sends: false,
}
