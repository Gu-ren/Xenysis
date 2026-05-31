'use client'

import { motion } from 'framer-motion'
import {
  PULSE_RINGS,
  CONSTELLATION_DOTS,
  CONSTELLATION_LINES,
} from '../constants'

export function AmbientBg() {
  return (
    <>
      {/* Constellation */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {CONSTELLATION_LINES.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(79,250,176,0.15)"
            strokeWidth="0.75"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: line.delay, ease: 'easeInOut' }}
          />
        ))}
        {CONSTELLATION_DOTS.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill="rgba(79,250,176,0.35)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.65, 0.35], scale: 1 }}
            transition={{
              duration: 2.5,
              delay: dot.delay,
              ease: 'easeOut',
              times: [0, 0.3, 1],
            }}
          />
        ))}
      </svg>

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 900,
          height: 900,
          background:
            'radial-gradient(ellipse at center, rgba(79,250,176,0.05) 0%, rgba(79,250,176,0.02) 40%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Pulse rings */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {PULSE_RINGS.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 280,
              height: 280,
              border: '1px solid rgba(79,250,176,0.10)',
            }}
            animate={{
              scale: [ring.scale, ring.scale + 0.8],
              opacity: [0.45, 0],
            }}
            transition={{
              duration: 5.5,
              delay: ring.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </>
  )
}
