'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AssetMockup } from './asset-mockup'
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS } from '../constants'
import type { WorkspaceAsset, AssetPosition } from '../types'

interface CanvasNodeProps {
  asset: WorkspaceAsset
  pos: AssetPosition
  isDragging: boolean
  isHovered: boolean
  isSelected: boolean
  isConnected?: boolean
  isDimmed?: boolean
  // 'outgoing' = selected → this node; 'incoming' = this node → selected
  direction?: 'outgoing' | 'incoming' | null
  revealed: boolean
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onMouseEnter: (id: string) => void
  onMouseLeave: () => void
  onClick: (id: string) => void
}

const STATUS_CHIP = {
  generated: {
    label: 'Generated',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'needs-config': {
    label: 'Needs Config',
    className: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  },
  planned: {
    label: 'Planned',
    className: 'bg-white/5 text-muted border-white/10',
  },
} as const

export function CanvasNode({
  asset,
  pos,
  isDragging,
  isHovered,
  isSelected,
  isConnected,
  isDimmed,
  direction,
  revealed,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CanvasNodeProps) {
  const colors = NODE_TYPE_COLORS[asset.nodeType]
  const status = STATUS_CHIP[asset.status]
  const thumbnailH = Math.round(asset.h * 0.60)

  const IconComp = asset.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={
        revealed
          ? { opacity: isDimmed ? 0.14 : 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 10 }
      }
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: asset.w,
        height: asset.h,
        zIndex: isDragging ? 200 : asset.isHub ? 20 : 10,
        pointerEvents: isDimmed ? 'none' : 'auto',
        transition: 'opacity 0.22s ease',
      }}
      className={cn(
        'rounded-xl border bg-card overflow-hidden select-none',
        'transition-[box-shadow,transform,border-color] duration-150',
        isDragging ? 'cursor-grabbing scale-[1.03]' : isHovered ? 'cursor-pointer scale-[1.02]' : 'cursor-grab',
        isSelected
          ? `border-[${colors.accent}] shadow-[0_0_0_1.5px_${colors.accent},0_0_24px_${colors.glow}]`
          : isConnected && !isDimmed
            ? 'border-white/20'
            : isHovered
              ? `shadow-[0_0_0_1px_${colors.border},0_0_16px_${colors.glow}]`
              : asset.isHub
                ? `border-[${colors.border}] shadow-[0_0_28px_${colors.glow}]`
                : asset.status === 'needs-config'
                  ? 'border-[#f59e0b]/30'
                  : asset.status === 'planned'
                    ? 'border-white/5'
                    : 'border-border'
      )}
      data-canvas-node
      onMouseDown={(e) => onMouseDown(e, asset.id)}
      onMouseEnter={() => onMouseEnter(asset.id)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(asset.id)}
    >
      {/* Reveal flash */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-0 z-20 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Thumbnail */}
      <div
        className="border-b border-white/[0.04] overflow-hidden"
        style={{ height: thumbnailH }}
      >
        <AssetMockup nodeType={asset.nodeType} accentColor={colors.accent} />
      </div>

      {/* Metadata */}
      <div
        className="flex flex-col gap-1 px-2.5 pt-2 pb-1.5 overflow-hidden"
        style={{ height: asset.h - thumbnailH - 1 }}
      >
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="flex items-center justify-center w-4 h-4 rounded shrink-0"
              style={{ background: colors.bg }}
            >
              <IconComp
                style={{ width: 9, height: 9, color: colors.accent }}
                strokeWidth={2}
              />
            </div>
            <span
              className={cn(
                'truncate font-semibold leading-tight text-foreground',
                asset.isHub ? 'text-[13px]' : 'text-[12px]'
              )}
            >
              {asset.title}
            </span>
          </div>
          <span
            className="shrink-0 text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none"
            style={{
              background: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            {NODE_TYPE_LABELS[asset.nodeType]}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <span className="text-[9px] text-muted truncate font-mono flex-1">
            {asset.route ?? asset.description}
          </span>
          {isConnected && direction ? (
            <span
              className="shrink-0 text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-full border leading-none"
              style={
                direction === 'outgoing'
                  ? { background: 'rgba(79,250,176,0.08)', color: '#4ffab0', borderColor: 'rgba(79,250,176,0.25)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', borderColor: 'rgba(255,255,255,0.12)' }
              }
            >
              {direction === 'outgoing' ? '→ calls' : '← source'}
            </span>
          ) : (
            <span
              className={cn(
                'shrink-0 text-[7.5px] font-mono font-semibold px-1.5 py-0.5 rounded-full border leading-none',
                status.className
              )}
            >
              {status.label}
            </span>
          )}
        </div>
      </div>

      {/* Hover action row */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-9 border-t border-white/[0.04]',
          'bg-background/95 flex items-center gap-1.5 px-2',
          'transition-opacity duration-150',
          isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onClick(asset.id)
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
        >
          Inspect
        </button>
        <span className="text-[9px] text-muted font-mono truncate flex-1">
          {asset.purpose.slice(0, 48)}…
        </span>
      </div>
    </motion.div>
  )
}
