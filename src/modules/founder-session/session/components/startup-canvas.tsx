'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CANVAS_NODES, CANVAS_EDGES } from '../constants'
import { useFounderSessionStore } from '@/store/founder-session'
import type { CanvasNodeState } from '../../types'

const NODE_W = 154
const NODE_H = 48

// ── Visual helpers ────────────────────────────────────────────────────────────

function cardFill(state: CanvasNodeState): string {
  if (state === 'understood') return 'rgba(79,250,176,0.03)'
  if (state === 'building') return 'rgba(79,250,176,0.02)'
  return 'var(--card)'
}

function cardStroke(state: CanvasNodeState): string {
  if (state === 'understood') return 'rgba(79,250,176,0.22)'
  if (state === 'building') return 'rgba(79,250,176,0.18)'
  return 'rgba(255,255,255,0.09)'
}

function iconBg(state: CanvasNodeState): string {
  if (state === 'building' || state === 'understood') return 'rgba(79,250,176,0.10)'
  return 'rgba(255,255,255,0.04)'
}

function iconColor(state: CanvasNodeState): string {
  if (state === 'building' || state === 'understood') return 'var(--primary)'
  return 'var(--muted)'
}

function sublabelColor(state: CanvasNodeState): string {
  if (state === 'building') return 'rgba(79,250,176,0.50)'
  if (state === 'understood') return 'rgba(79,250,176,0.42)'
  return 'rgba(250,250,250,0.22)'
}

function nodePos(id: string): { x: number; y: number } {
  const n = CANVAS_NODES.find((n) => n.id === id)
  return n ? { x: n.cx, y: n.cy } : { x: 0, y: 0 }
}

// ── Derived node sets (stable — computed once at module level) ────────────────

const latentNodes = CANVAS_NODES.filter((n) => n.state === 'latent')
const coreNodes = CANVAS_NODES.filter((n) => n.state !== 'latent' && n.type !== 'opportunity')
const opportunityNodes = CANVAS_NODES.filter((n) => n.type === 'opportunity')
const discoveredCount = coreNodes.length

// ── StartupCanvas ─────────────────────────────────────────────────────────────

export function StartupCanvas() {
  const canvasPingAt = useFounderSessionStore((s) => s.canvasPingAt)

  const [activeTravelEdge, setActiveTravelEdge] = useState(0)
  // Canvas listening reaction — brief background brightening when founder sends
  const [isPinging, setIsPinging] = useState(false)

  useEffect(() => {
    const timer = setInterval(
      () => setActiveTravelEdge((prev) => (prev + 1) % CANVAS_EDGES.length),
      3000,
    )
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!canvasPingAt) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPinging(true)
    const t = setTimeout(() => setIsPinging(false), 420)
    return () => clearTimeout(t)
  }, [canvasPingAt])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0 border-b border-border"
        style={{ height: 44 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-foreground text-[13px] font-semibold tracking-[-0.02em]">
            Real Estate CRM
          </span>
          <span className="w-px h-3 bg-border shrink-0" />
          <span className="text-muted text-[12px]">{discoveredCount} capabilities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-[5px] h-[5px] rounded-full bg-primary shrink-0"
            style={{ animation: 'fs-pulse-dot 1.5s ease-in-out infinite' }}
          />
          <span
            className="font-mono text-[11px]"
            style={{ color: 'rgba(250,250,250,0.30)' }}
          >
            discovering
          </span>
        </div>
      </div>

      {/* SVG canvas — background pulses when founder sends a message */}
      <motion.div
        className="flex-1 flex items-center justify-center overflow-hidden px-4 py-4"
        initial={{ backgroundColor: 'rgba(79,250,176,0.004)' }}
        animate={{
          backgroundColor: isPinging
            ? 'rgba(79,250,176,0.018)'
            : 'rgba(79,250,176,0.004)',
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <svg
          viewBox="0 0 560 500"
          style={{ width: '100%', height: '100%', maxHeight: 500 }}
          fill="none"
        >
          <defs>
            <pattern
              id="dotgrid-sc"
              x="0" y="0" width="28" height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.75" fill="rgba(255,255,255,0.04)" />
            </pattern>
            <filter id="opp-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <rect x="0" y="0" width="560" height="500" fill="url(#dotgrid-sc)" />

          {/* ── 1. Latent ghost dots — undiscovered potential ── */}
          {latentNodes.map((node, idx) => (
            <circle
              key={node.id}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="var(--primary)"
              style={{
                animationName: 'fs-latent-breath',
                animationDuration: `${3.6 + idx * 0.9}s`,
                animationDelay: `${idx * 0.5}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                opacity: 0.1,
              }}
            />
          ))}

          {/* ── 2. Edges — fade in after their source node appears ── */}
          {CANVAS_EDGES.map((edge, edgeIdx) => {
            const fp = nodePos(edge.from)
            const tp = nodePos(edge.to)
            const fromNode = CANVAS_NODES.find((n) => n.id === edge.from)
            const toNode = CANVAS_NODES.find((n) => n.id === edge.to)
            const isActive =
              fromNode?.state === 'building' ||
              toNode?.state === 'building' ||
              fromNode?.type === 'opportunity' ||
              toNode?.type === 'opportunity'
            const isTraveling = edgeIdx === activeTravelEdge

            // Stagger: edge appears ~140ms after its source node
            const sourceIdx = coreNodes.findIndex((n) => n.id === edge.from)
            const edgeDelay = (sourceIdx >= 0 ? 0.1 + sourceIdx * 0.07 : 0.3) + 0.14

            return (
              <motion.g
                key={`${edge.from}-${edge.to}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: edgeDelay, ease: 'easeOut' }}
              >
                {/* Base dashed line */}
                <line
                  x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Traveling highlight */}
                <line
                  x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                  stroke={isActive ? 'rgba(79,250,176,0.32)' : 'rgba(79,250,176,0.13)'}
                  strokeWidth="1.5"
                  strokeDasharray="10 110"
                  style={{
                    animation: `fs-edge-travel ${isActive ? '1.4s' : '2.4s'} linear infinite`,
                  }}
                />
                {/* Traveling dot */}
                {isTraveling && (
                  <circle r="3" fill="var(--primary)" opacity="0.85">
                    <animateMotion
                      dur="1.2s"
                      repeatCount="1"
                      path={`M${fp.x},${fp.y} L${tp.x},${tp.y}`}
                      calcMode="spline"
                      keySplines="0.16 1 0.3 1"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.85;0"
                      dur="1.2s"
                      repeatCount="1"
                    />
                  </circle>
                )}
              </motion.g>
            )
          })}

          {/* ── 3. Core nodes — emerge from position with scale + y ── */}
          {coreNodes.map((node, idx) => {
            const IconComp = node.icon
            const isBuilding = node.state === 'building'
            const progressBarW =
              isBuilding && node.buildProgress
                ? Math.floor(((NODE_W - 16) * node.buildProgress) / 100)
                : 0

            return (
              <motion.g
                key={node.id}
                // transformBox + transformOrigin ensure scale pivots on the node
                // center rather than the SVG canvas origin (0,0)
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.88, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + idx * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Card */}
                <rect
                  x={node.cx - NODE_W / 2} y={node.cy - NODE_H / 2}
                  width={NODE_W} height={NODE_H} rx="8"
                  fill={cardFill(node.state)}
                  stroke={cardStroke(node.state)}
                  strokeWidth="1"
                  strokeDasharray={isBuilding ? '4 3' : undefined}
                />

                {/* Build progress bar */}
                {isBuilding && node.buildProgress && (
                  <g>
                    <rect
                      x={node.cx - NODE_W / 2 + 8} y={node.cy + NODE_H / 2 - 5}
                      width={NODE_W - 16} height={2} rx="1"
                      fill="rgba(255,255,255,0.05)"
                    />
                    <rect
                      x={node.cx - NODE_W / 2 + 8} y={node.cy + NODE_H / 2 - 5}
                      width={progressBarW} height={2} rx="1"
                      fill="var(--primary)" opacity="0.55"
                    />
                  </g>
                )}

                {/* Icon bg */}
                <rect
                  x={node.cx - NODE_W / 2 + 8} y={node.cy - 13}
                  width={22} height={22} rx="5"
                  fill={iconBg(node.state)}
                />

                {/* Icon */}
                {IconComp && (
                  <foreignObject
                    x={node.cx - NODE_W / 2 + 11} y={node.cy - 10}
                    width="16" height="16"
                  >
                    <div
                      style={{
                        width: 16, height: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <IconComp
                        style={{ width: 11, height: 11, color: iconColor(node.state) }}
                        strokeWidth={1.8}
                      />
                    </div>
                  </foreignObject>
                )}

                {/* Label */}
                <text
                  x={node.cx - NODE_W / 2 + 38} y={node.cy - 3}
                  fill="var(--foreground)"
                  fontSize="10.5" fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {node.label}
                </text>

                {/* Sublabel */}
                <text
                  x={node.cx - NODE_W / 2 + 38} y={node.cy + 10}
                  fill={sublabelColor(node.state)}
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.025em"
                >
                  {node.sublabel}
                </text>
              </motion.g>
            )
          })}

          {/* ── 4. Opportunity nodes — aura blooms first, card springs in after ── */}
          {opportunityNodes.map((node, idx) => {
            const IconComp = node.icon
            const auraRevealDelay = 0.72 + idx * 0.12
            const auraBreathStart = auraRevealDelay + 0.85
            const cardDelay = 0.86 + idx * 0.12

            return (
              <g key={node.id}>
                {/* Aura — pure CSS animation, no Framer conflict.
                    Two chained animations: one-shot reveal → infinite breathing. */}
                <circle
                  cx={node.cx} cy={node.cy} r={56}
                  fill="rgba(79,250,176,0.10)"
                  filter="url(#opp-glow)"
                  style={{
                    animation: [
                      `fs-opp-reveal 0.85s ease-out ${auraRevealDelay}s forwards`,
                      `fs-opportunity-aura 2.8s ease-in-out ${auraBreathStart}s infinite`,
                    ].join(', '),
                    opacity: 0,
                  }}
                />

                {/* Card — springs in with slight overshoot after aura starts */}
                <motion.g
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.62,
                    delay: cardDelay,
                    // spring-like cubic: overshoots ~1.06 before settling at 1
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <rect
                    x={node.cx - NODE_W / 2} y={node.cy - NODE_H / 2}
                    width={NODE_W} height={NODE_H} rx="8"
                    fill="rgba(79,250,176,0.05)"
                    stroke="rgba(79,250,176,0.38)"
                    strokeWidth="1"
                    strokeDasharray="5 3"
                  />

                  {/* Icon bg */}
                  <rect
                    x={node.cx - NODE_W / 2 + 8} y={node.cy - 13}
                    width={22} height={22} rx="5"
                    fill="rgba(79,250,176,0.14)"
                  />

                  {/* Icon */}
                  {IconComp && (
                    <foreignObject
                      x={node.cx - NODE_W / 2 + 11} y={node.cy - 10}
                      width="16" height="16"
                    >
                      <div
                        style={{
                          width: 16, height: 16,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <IconComp
                          style={{ width: 11, height: 11, color: 'var(--primary)' }}
                          strokeWidth={1.8}
                        />
                      </div>
                    </foreignObject>
                  )}

                  {/* ★ marker */}
                  <text
                    x={node.cx + NODE_W / 2 - 13} y={node.cy - NODE_H / 2 + 11}
                    fill="var(--primary)"
                    fontSize="8" fontWeight="700"
                    fontFamily="var(--font-sans)"
                    opacity="0.85"
                  >
                    ★
                  </text>

                  {/* Label */}
                  <text
                    x={node.cx - NODE_W / 2 + 38} y={node.cy - 3}
                    fill="var(--foreground)"
                    fontSize="10.5" fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    {node.label}
                  </text>

                  {/* Sublabel */}
                  <text
                    x={node.cx - NODE_W / 2 + 38} y={node.cy + 10}
                    fill="rgba(79,250,176,0.55)"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.025em"
                  >
                    {node.sublabel}
                  </text>
                </motion.g>
              </g>
            )
          })}
        </svg>
      </motion.div>

    </div>
  )
}
