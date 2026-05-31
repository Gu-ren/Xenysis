import type { WorkspaceAsset, AssetPosition } from '../types'

// ── Zone shape ────────────────────────────────────────────────────────────────

export interface ZoneRect {
  id: string
  label: string
  color: string
  borderColor: string
  x: number
  y: number
  w: number
  h: number
}

// ── Layout constants ───────────────────────────────────────────────────────────

const CANVAS_MARGIN_X = 80
const CANVAS_MARGIN_Y = 80
const ZONE_GAP = 72         // horizontal gap between zone columns
const NODE_GAP = 20         // vertical gap between nodes in same zone
const ZONE_PADDING_X = 24   // horizontal padding inside each zone
const ZONE_LABEL_H = 40     // height reserved for the zone label at the top
const ZONE_PADDING_BOT = 28 // bottom padding inside each zone

// ── Layer definitions (left → right) ─────────────────────────────────────────

const LAYER_META = [
  {
    id: 'user-flow',
    label: 'USER FLOW',
    color: 'rgba(79,250,176,0.032)',
    borderColor: 'rgba(79,250,176,0.10)',
  },
  {
    id: 'application',
    label: 'APPLICATION',
    color: 'rgba(99,179,237,0.032)',
    borderColor: 'rgba(99,179,237,0.10)',
  },
  {
    id: 'data',
    label: 'DATA LAYER',
    color: 'rgba(167,139,250,0.032)',
    borderColor: 'rgba(167,139,250,0.10)',
  },
  {
    id: 'services',
    label: 'CORE SERVICES',
    color: 'rgba(161,161,170,0.032)',
    borderColor: 'rgba(161,161,170,0.10)',
  },
  {
    id: 'integrations',
    label: 'INTEGRATIONS',
    color: 'rgba(251,146,60,0.032)',
    borderColor: 'rgba(251,146,60,0.10)',
  },
  {
    id: 'automations',
    label: 'AUTOMATIONS',
    color: 'rgba(245,158,11,0.032)',
    borderColor: 'rgba(245,158,11,0.10)',
  },
] as const

const USER_FLOW_ASSET_TYPES = new Set(['marketing', 'auth', 'onboarding'])

function assignLayer(asset: WorkspaceAsset): number {
  switch (asset.nodeType) {
    case 'page':
      return USER_FLOW_ASSET_TYPES.has(asset.assetType) ? 0 : 1
    case 'database':
      return 2
    case 'system':
    case 'api':
      return 3
    case 'integration':
      return 4
    case 'workflow':
      return 5
    default:
      return 5
  }
}

// ── Primary layout function ───────────────────────────────────────────────────

export function computeLayout(assets: WorkspaceAsset[]): {
  positions: AssetPosition[]
  zones: ZoneRect[]
} {
  // Bucket assets into layers
  const layers: WorkspaceAsset[][] = LAYER_META.map(() => [])
  for (const asset of assets) {
    layers[assignLayer(asset)].push(asset)
  }
  // Preserve intentional ordering within each layer
  layers.forEach((layer) => layer.sort((a, b) => a.revealDelay - b.revealDelay))

  const positions: AssetPosition[] = []
  const zones: ZoneRect[] = []
  let curX = CANVAS_MARGIN_X

  layers.forEach((layer, li) => {
    if (layer.length === 0) return

    const maxNodeW = Math.max(...layer.map((a) => a.w))
    const zoneW = maxNodeW + ZONE_PADDING_X * 2

    let curY = CANVAS_MARGIN_Y + ZONE_LABEL_H

    for (const asset of layer) {
      // Centre narrower nodes within the zone column
      const nodeX = curX + ZONE_PADDING_X + Math.round((maxNodeW - asset.w) / 2)
      positions.push({ id: asset.id, x: nodeX, y: curY })
      curY += asset.h + NODE_GAP
    }

    const zoneH = (curY - CANVAS_MARGIN_Y) - NODE_GAP + ZONE_PADDING_BOT

    zones.push({
      id: LAYER_META[li].id,
      label: LAYER_META[li].label,
      color: LAYER_META[li].color,
      borderColor: LAYER_META[li].borderColor,
      x: curX,
      y: CANVAS_MARGIN_Y,
      w: zoneW,
      h: zoneH,
    })

    curX += zoneW + ZONE_GAP
  })

  return { positions, zones }
}

// ── Bounds helper (used for fitView) ─────────────────────────────────────────

export function computeBounds(
  positions: AssetPosition[],
  assetMap: Map<string, { w: number; h: number }>,
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  if (positions.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const pos of positions) {
    const a = assetMap.get(pos.id)
    if (!a) continue
    minX = Math.min(minX, pos.x)
    minY = Math.min(minY, pos.y)
    maxX = Math.max(maxX, pos.x + a.w)
    maxY = Math.max(maxY, pos.y + a.h)
  }
  if (!isFinite(minX)) return null
  return { minX, minY, maxX, maxY }
}
