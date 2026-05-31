'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ClaritySegment } from '../types'

interface SessionHeaderProps {
  claritySegments?: ClaritySegment[]
}

export function SessionHeader({ claritySegments = [] }: SessionHeaderProps) {
  const [displayed, setDisplayed] = useState<number[]>(claritySegments.map(() => 0))

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    claritySegments.forEach((seg, i) => {
      if (seg.progress <= 0) return
      const t = setTimeout(
        () =>
          setDisplayed((prev) => {
            const next = [...prev]
            next[i] = seg.progress
            return next
          }),
        1100 + i * 380,
      )
      timers.push(t)
    })
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const overall = claritySegments.length
    ? Math.round(displayed.reduce((sum, p) => sum + p, 0) / claritySegments.length)
    : 0

  return (
    <div
      className="flex items-center px-5 shrink-0 border-b border-border bg-background"
      style={{ height: 56 }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-5 h-5 flex items-center justify-center shrink-0"
        >
          <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" />
        </div>
        <span className="text-[13px] font-bold text-foreground tracking-[-0.025em]">
          Xenysis
        </span>
      </div>

      <span className="w-px h-4 bg-border shrink-0 mx-6" />

      {/* Business Clarity — fills remaining width */}
      {claritySegments.length > 0 && (
        <div className="flex flex-1 items-center gap-5 min-w-0">
          {/* Label + overall % */}
          <div className="flex flex-col justify-center gap-[4px] shrink-0">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: '0.09em', color: 'rgba(250,250,250,0.30)' }}
            >
              Business Clarity
            </span>
            <motion.span
              className="font-mono text-[18px] font-semibold text-primary leading-none tabular-nums"
              key={overall}
            >
              {overall}%
            </motion.span>
          </div>

          {/* Segment bars */}
          <div className="flex flex-1 items-end gap-3 min-w-0">
            {claritySegments.map((seg, i) => (
              <div key={seg.id} className="flex-1 flex flex-col gap-[6px] min-w-0">
                <div
                  className="h-[4px] rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${displayed[i]}%`,
                      opacity: displayed[i] > 0 ? 0.80 : 0,
                      boxShadow: displayed[i] > 0 ? '0 0 6px rgba(79,250,176,0.60)' : 'none',
                      transition: 'width 750ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease',
                    }}
                  />
                </div>
                <span
                  className="font-mono truncate leading-none"
                  style={{
                    fontSize: 10,
                    color: displayed[i] > 0 ? 'rgba(250,250,250,0.35)' : 'rgba(250,250,250,0.14)',
                    transition: 'color 400ms ease',
                  }}
                >
                  {seg.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
