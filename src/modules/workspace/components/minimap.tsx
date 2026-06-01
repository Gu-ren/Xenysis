'use client'

import { NODE_TYPE_COLORS, CANVAS_W, CANVAS_H } from '../constants'
import type { WorkspaceAsset, AssetPosition } from '../types'

const MAP_W = 152
const MAP_H = 96

interface MinimapProps {
  assets: WorkspaceAsset[]
  positions: AssetPosition[]
  panX: number
  panY: number
  zoom: number
  viewW: number
  viewH: number
  onPanTo: (x: number, y: number) => void
}

export function Minimap({ assets, positions, panX, panY, zoom, viewW, viewH, onPanTo }: MinimapProps) {
  const scaleX = MAP_W / CANVAS_W
  const scaleY = MAP_H / CANVAS_H
  const vpW = viewW / zoom
  const vpH = viewH / zoom
  const vpX = -panX / zoom
  const vpY = -panY / zoom

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / scaleX
    const cy = (e.clientY - rect.top) / scaleY
    onPanTo(-(cx - vpW / 2) * zoom, -(cy - vpH / 2) * zoom)
  }

  return (
    <div
      onClick={handleClick}
      className="absolute bottom-4 right-4 border border-primary/20 rounded-xl overflow-hidden cursor-crosshair z-20"
      style={{
        width: MAP_W,
        height: MAP_H,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      <span className="absolute top-1 left-2 text-[7px] font-mono font-bold text-muted/50 pointer-events-none tracking-widest">
        MAP
      </span>
      <span className="absolute bottom-1 right-2 text-[7px] font-mono text-muted/40 pointer-events-none">
        {Math.round(zoom * 100)}%
      </span>

      {/* Asset dots */}
      {positions.map((pos) => {
        const asset = assets.find((a) => a.id === pos.id)
        if (!asset) return null
        const colors = NODE_TYPE_COLORS[asset.nodeType]
        return (
          <div
            key={pos.id}
            className="absolute rounded-[1px]"
            style={{
              left: pos.x * scaleX,
              top: pos.y * scaleY,
              width: Math.max(asset.w * scaleX, 4),
              height: Math.max(asset.h * scaleY, 3),
              background: asset.isHub ? colors.accent : colors.bg,
              borderColor: colors.border,
              opacity: asset.isHub ? 1 : 0.7,
            }}
          />
        )
      })}

      {/* Viewport rect */}
      <div
        className="absolute rounded border border-primary/50 pointer-events-none"
        style={{
          left: Math.max(0, vpX * scaleX),
          top: Math.max(0, vpY * scaleY),
          width: Math.min(vpW * scaleX, MAP_W),
          height: Math.min(vpH * scaleY, MAP_H),
          background: 'rgba(79,250,176,0.05)',
        }}
      />
    </div>
  )
}
