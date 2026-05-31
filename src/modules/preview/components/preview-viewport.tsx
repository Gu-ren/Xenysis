'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AssetPreviewCanvas } from '@/modules/workspace/components/asset-preview-canvas'
import type { JourneyScreen, DeviceMode, NavigationTarget, StartupPreviewContext } from '../types'
import type { NavDirection } from '../hooks/use-simulation-state'

interface PreviewViewportProps {
  screen: JourneyScreen | null
  deviceMode: DeviceMode
  direction: NavDirection
  navigatesTo: NavigationTarget[]
  onNavigate: (id: string) => void
  ctx?: StartupPreviewContext | null
}

const TRANSITION = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }

function slideVariants(direction: NavDirection) {
  const xIn  = direction === 'forward' ? 28 : -28
  const xOut = direction === 'forward' ? -28 : 28
  return {
    initial: { x: xIn,  opacity: 0 },
    animate: { x: 0,    opacity: 1, transition: TRANSITION },
    exit:    { x: xOut, opacity: 0, transition: { ...TRANSITION, duration: 0.15 } },
  }
}

export function PreviewViewport({ screen, deviceMode, direction, navigatesTo, onNavigate, ctx }: PreviewViewportProps) {
  if (!screen) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#050505' }}>
        <p className="text-xs text-muted font-mono">Select a screen to preview</p>
      </div>
    )
  }

  const variants = slideVariants(direction)

  const canvas = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen.asset.id}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        style={{ height: '100%', willChange: 'transform, opacity' }}
      >
        <AssetPreviewCanvas
          asset={screen.asset}
          navigatesTo={navigatesTo}
          onNavigate={onNavigate}
          ctx={ctx}
        />
      </motion.div>
    </AnimatePresence>
  )

  if (deviceMode === 'mobile') {
    return (
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ background: '#050505' }}
      >
        {/* Mobile device frame */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: 390,
            height: 720,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 40,
            background: '#0a0a0a',
            boxShadow: '0 0 0 8px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-3 shrink-0">
            <div
              className="rounded-full"
              style={{ width: 100, height: 28, background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Screen content — animated inside frame */}
          <div className="flex-1 overflow-hidden relative">
            {canvas}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2 pt-1 shrink-0">
            <div className="rounded-full" style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>
    )
  }

  // Desktop — full viewport
  return (
    <div className="flex-1 overflow-hidden relative" style={{ background: '#050505' }}>
      {canvas}
    </div>
  )
}
