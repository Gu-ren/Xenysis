'use client'

import { motion } from 'framer-motion'

interface ProgressRingProps {
  percentage: number
}

export function ProgressRing({ percentage }: ProgressRingProps) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-white/[0.06]"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-emerald-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xs font-bold text-white">{percentage}%</span>
      </div>
    </div>
  )
}
