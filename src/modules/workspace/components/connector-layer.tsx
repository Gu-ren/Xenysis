import { CANVAS_W, CANVAS_H, RELATIONSHIP_COLORS, RELATIONSHIP_ANIMATED } from '../constants'
import type { WorkspaceAsset, WorkspaceConnector, AssetPosition } from '../types'

interface ConnectorLayerProps {
  assets: WorkspaceAsset[]
  connectors: WorkspaceConnector[]
  positions: AssetPosition[]
  revealed: boolean
  selectedId?: string | null
}

type Side = 'top' | 'bottom' | 'left' | 'right'

// Compute the best exit/entry sides based on relative node centre positions.
// Prefers horizontal flow (right→left) for left-to-right layouts; falls back
// to vertical when nodes are stacked in the same column.
function computeSides(
  fcx: number, fcy: number,
  tcx: number, tcy: number,
): { from: Side; to: Side } {
  const dx = tcx - fcx
  const dy = tcy - fcy
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)

  // Strongly horizontal
  if (adx > ady * 1.1) {
    return dx > 0
      ? { from: 'right', to: 'left' }
      : { from: 'left', to: 'right' }
  }
  // Strongly vertical
  if (ady > adx * 1.1) {
    return dy > 0
      ? { from: 'bottom', to: 'top' }
      : { from: 'top', to: 'bottom' }
  }
  // Diagonal — prefer horizontal
  return dx > 0
    ? { from: 'right', to: 'left' }
    : { from: 'left', to: 'right' }
}

function getSidePoint(x: number, y: number, w: number, h: number, side: Side) {
  switch (side) {
    case 'top':    return { x: x + w / 2, y }
    case 'bottom': return { x: x + w / 2, y: y + h }
    case 'left':   return { x,            y: y + h / 2 }
    case 'right':  return { x: x + w,     y: y + h / 2 }
  }
}

function buildPath(x1: number, y1: number, x2: number, y2: number, from: Side, to: Side): string {
  if (from === 'right' && to === 'left') {
    const curve = Math.max(60, Math.abs(x2 - x1) * 0.42)
    return `M${x1},${y1} C${x1 + curve},${y1} ${x2 - curve},${y2} ${x2},${y2}`
  }
  if (from === 'left' && to === 'right') {
    const curve = Math.max(60, Math.abs(x2 - x1) * 0.42)
    return `M${x1},${y1} C${x1 - curve},${y1} ${x2 + curve},${y2} ${x2},${y2}`
  }
  if (from === 'bottom' && to === 'top') {
    const curve = Math.max(40, Math.abs(y2 - y1) * 0.42)
    return `M${x1},${y1} C${x1},${y1 + curve} ${x2},${y2 - curve} ${x2},${y2}`
  }
  if (from === 'top' && to === 'bottom') {
    const curve = Math.max(40, Math.abs(y2 - y1) * 0.42)
    return `M${x1},${y1} C${x1},${y1 - curve} ${x2},${y2 + curve} ${x2},${y2}`
  }
  // Fallback diagonal
  const dx = x2 - x1
  return `M${x1},${y1} C${x1 + dx * 0.4},${y1} ${x2 - dx * 0.4},${y2} ${x2},${y2}`
}

export function ConnectorLayer({ assets, connectors, positions, revealed, selectedId }: ConnectorLayerProps) {
  const assetMap = new Map(assets.map((a) => [a.id, a]))
  const posMap   = new Map(positions.map((p) => [p.id, p]))

  const paths = connectors.flatMap((conn) => {
    const fa = assetMap.get(conn.from)
    const ta = assetMap.get(conn.to)
    if (!fa || !ta) return []

    const fp = posMap.get(conn.from) ?? { x: fa.x, y: fa.y }
    const tp = posMap.get(conn.to)   ?? { x: ta.x, y: ta.y }

    // Auto-compute sides from actual positions
    const fcx = fp.x + fa.w / 2
    const fcy = fp.y + fa.h / 2
    const tcx = tp.x + ta.w / 2
    const tcy = tp.y + ta.h / 2
    const { from: fromSide, to: toSide } = computeSides(fcx, fcy, tcx, tcy)

    const p1 = getSidePoint(fp.x, fp.y, fa.w, fa.h, fromSide)
    const p2 = getSidePoint(tp.x, tp.y, ta.w, ta.h, toSide)
    const d  = buildPath(p1.x, p1.y, p2.x, p2.y, fromSide, toSide)

    const color    = RELATIONSHIP_COLORS[conn.relationshipType]
    const animated = conn.animated ?? RELATIONSHIP_ANIMATED[conn.relationshipType]
    const midX     = (p1.x + p2.x) / 2
    const midY     = (p1.y + p2.y) / 2

    return [{ conn, d, color, animated, midX, midY }]
  })

  const hasSelection = selectedId != null

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: CANVAS_W,
        height: CANVAS_H,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1,
      }}
    >
      <defs>
        <filter id="cl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {paths.map(({ conn, color }) => (
          <g key={`mk-${conn.id}`}>
            {/* Default arrowhead */}
            <marker id={`arr-${conn.id}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0.5 L5.5,3.5 L0,6.5 Z" fill={color} />
            </marker>
            {/* Active arrowhead (slightly larger) */}
            <marker id={`arr-a-${conn.id}`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0.5 L7.5,4.5 L0,8.5 Z" fill={color} />
            </marker>
          </g>
        ))}
      </defs>

      {paths.map(({ conn, d, color, animated, midX, midY }) => {
        const isActive = hasSelection && (conn.from === selectedId || conn.to === selectedId)
        const isDimmed = hasSelection && !isActive
        const opacity  = isDimmed ? 0.10 : revealed ? 1 : 0

        return (
          <g key={conn.id} style={{ opacity, transition: 'opacity 0.4s ease' }}>
            {/* Glow halo on active paths */}
            {isActive && (
              <path
                d={d}
                stroke={color}
                strokeWidth={10}
                fill="none"
                opacity={0.10}
                filter="url(#cl-glow)"
              />
            )}

            {/* Main stroke */}
            <path
              d={d}
              stroke={color}
              strokeWidth={isActive ? 2.0 : 1.4}
              strokeDasharray={isActive && animated ? '9 5' : 'none'}
              strokeLinecap="round"
              fill="none"
              markerEnd={`url(#arr-${isActive ? 'a-' : ''}${conn.id})`}
              style={isActive && animated ? { animation: 'ws-flow 1.4s linear infinite' } : undefined}
            />

            {/* Relationship label */}
            {conn.label && !isDimmed && (
              <foreignObject x={midX - 36} y={midY - 10} width={72} height={20}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    background: 'var(--background)',
                    border: `1px solid ${color}`,
                    borderRadius: 999,
                    padding: '1px 6px',
                    fontSize: 7.5,
                    fontWeight: 600,
                    color,
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {conn.label}
                </div>
              </foreignObject>
            )}
          </g>
        )
      })}
    </svg>
  )
}
