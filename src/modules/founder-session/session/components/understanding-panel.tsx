'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUnderstanding } from '../hooks/use-understanding'
import { FOCUS_LABEL } from '../../types/understanding'
import { useFounderSessionStore } from '@/store/founder-session'

// ─── Types ────────────────────────────────────────────────────────────────────

type OrbState = 'AMBIENT' | 'THINKING'
type RGB = [number, number, number]

// ─── Canvas constants ─────────────────────────────────────────────────────────

const CANVAS_SIZE = 320
const N_VERTICES  = 14
const BASE_RADIUS = 116

const VERTEX_PHASES: [number, number, number][] = Array.from({ length: N_VERTICES }, (_, i) => [
  (i * 2.3971) % (Math.PI * 2),
  (i * 1.7841 + 1.2) % (Math.PI * 2),
  (i * 3.1415 + 2.4) % (Math.PI * 2),
])

// ─── Particles (visible only during THINKING) ─────────────────────────────────

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  radius:  20 + (i * 7.1) % 34,
  speed:   (0.08 + (i * 0.021) % 0.14) * (i % 2 === 0 ? 1 : -1),
  size:    1.0 + (i * 0.17) % 1.6,
  phase:   (i * 1.618) % (Math.PI * 2),
  opacity: 0.30 + (i * 0.06) % 0.40,
}))

// ─── Status messages ──────────────────────────────────────────────────────────

const THINKING_STATUSES = [
  'Connecting customer pain points...',
  'Evaluating market assumptions...',
  'Mapping founder expertise...',
  'Identifying business model risks...',
  'Constructing startup architecture...',
  'Analyzing competitive landscape...',
  'Synthesizing problem–solution fit...',
  'Calibrating confidence signals...',
]

// ─── Blob params ──────────────────────────────────────────────────────────────

type BlobParams = {
  A1: number; A2: number; A3: number
  F1: number; F2: number; F3: number
  glowOpacity: number
  innerBrightness: number
}

// Both states share the same slow organic movement.
// THINKING is distinguished solely by glow intensity and particles.
const STATE_PARAMS: Record<OrbState, BlobParams> = {
  AMBIENT:  { A1: 6.0, A2: 3.2, A3: 1.6, F1: 0.055, F2: 0.088, F3: 0.140, glowOpacity: 0.72, innerBrightness: 0.22 },
  THINKING: { A1: 6.0, A2: 3.2, A3: 1.6, F1: 0.055, F2: 0.088, F3: 0.140, glowOpacity: 1.00, innerBrightness: 0.42 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

function getBlobVertices(
  t: number, A1: number, A2: number, A3: number,
  F1: number, F2: number, F3: number,
  baseRadius: number, cx: number, cy: number,
): [number, number][] {
  return Array.from({ length: N_VERTICES }, (_, i) => {
    const angle = (i / N_VERTICES) * Math.PI * 2
    const [p1, p2, p3] = VERTEX_PHASES[i]
    const d =
      A1 * Math.sin(t * F1 + angle * 2 + p1) +
      A2 * Math.sin(t * F2 + angle * 3 + p2) +
      A3 * Math.sin(t * F3 + angle * 5 + p3)
    return [cx + Math.cos(angle) * (baseRadius + d), cy + Math.sin(angle) * (baseRadius + d)]
  })
}

function drawBlobPath(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  const n = pts.length
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    if (i === 0) ctx.moveTo(p1[0], p1[1])
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1])
  }
  ctx.closePath()
}

// ─── OrbCanvas ────────────────────────────────────────────────────────────────

function OrbCanvas({ orbState, rgb }: { orbState: OrbState; rgb: RGB }) {
  const canvasRef        = React.useRef<HTMLCanvasElement>(null)
  const rafRef           = React.useRef<number>(0)
  const startRef         = React.useRef<number>(0)
  const lastRef          = React.useRef<number>(0)
  const curRef           = React.useRef<BlobParams>({ ...STATE_PARAMS.AMBIENT })
  const tgtRef           = React.useRef<BlobParams>({ ...STATE_PARAMS.AMBIENT })
  const lerpTRef         = React.useRef(1.0)
  const stateRef         = React.useRef(orbState)
  const rgbRef           = React.useRef<RGB>(rgb)
  const particleAlphaRef = React.useRef(0)

  React.useEffect(() => { rgbRef.current = rgb }, [rgb])

  React.useEffect(() => {
    stateRef.current = orbState
    tgtRef.current   = { ...STATE_PARAMS[orbState] }
    lerpTRef.current = 0
  }, [orbState])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width        = CANVAS_SIZE * dpr
    canvas.height       = CANVAS_SIZE * dpr
    canvas.style.width  = `${CANVAS_SIZE}px`
    canvas.style.height = `${CANVAS_SIZE}px`
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    const cx = CANVAS_SIZE / 2
    const cy = CANVAS_SIZE / 2
    startRef.current = performance.now()
    lastRef.current  = startRef.current

    const draw = (now: number) => {
      const t  = (now - startRef.current) / 1000
      const dt = Math.min((now - lastRef.current) / 1000, 0.05) // clamp large dt
      lastRef.current = now

      // Slowly interpolate blob params toward target (2.5s transition)
      lerpTRef.current = Math.min(1, lerpTRef.current + dt / 2.5)
      const lp = easeOutCubic(lerpTRef.current)
      const cp = curRef.current
      const tp = tgtRef.current
      cp.A1 = lerp(cp.A1, tp.A1, lp); cp.A2 = lerp(cp.A2, tp.A2, lp); cp.A3 = lerp(cp.A3, tp.A3, lp)
      cp.F1 = lerp(cp.F1, tp.F1, lp); cp.F2 = lerp(cp.F2, tp.F2, lp); cp.F3 = lerp(cp.F3, tp.F3, lp)
      cp.glowOpacity     = lerp(cp.glowOpacity,     tp.glowOpacity,     lp)
      cp.innerBrightness = lerp(cp.innerBrightness, tp.innerBrightness, lp)

      // Particle alpha fades in during THINKING, fades out otherwise
      const targetPA       = stateRef.current === 'THINKING' ? 1 : 0
      particleAlphaRef.current = lerp(particleAlphaRef.current, targetPA, Math.min(1, dt / 1.2))

      // Gentle breathing — 5-second cycle, very calm
      const breathe = Math.sin(t * (Math.PI * 2 / 5)) * 2.5 + (BASE_RADIUS + 2.5)
      const R = breathe

      // Slowly oscillating glow
      const glowPulse  = (Math.sin(t * (Math.PI * 2 / 7)) + 1) / 2
      const glowOpacity = lerp(0.55, 1.0, glowPulse) * cp.glowOpacity
      const fillPulse  = (Math.sin(t * (Math.PI * 2 / 5)) + 1) / 2
      const fillAlpha  = lerp(0.26, 0.44, fillPulse)

      const [cr, cg, cb] = rgbRef.current
      const c = (a: number) => `rgba(${cr},${cg},${cb},${a.toFixed(3)})`

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      // ── Layer 1: Ambient outer glow ──
      const glowConfigs = stateRef.current === 'THINKING'
        ? [{ r: 155, a: 0.065 }, { r: 132, a: 0.120 }, { r: 110, a: 0.180 }]
        : [{ r: 138, a: 0.045 }, { r: 116, a: 0.090 }, { r:  96, a: 0.145 }]
      for (const g of glowConfigs) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, g.r)
        grad.addColorStop(0, c(g.a * glowOpacity))
        grad.addColorStop(1, c(0))
        ctx.beginPath(); ctx.arc(cx, cy, g.r, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
      }

      // ── Layer 2: Blob body ──
      const pts     = getBlobVertices(t, cp.A1, cp.A2, cp.A3, cp.F1, cp.F2, cp.F3, R, cx, cy)
      const bodyGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 10)
      bodyGrad.addColorStop(0,   c(fillAlpha))
      bodyGrad.addColorStop(0.6, c(fillAlpha * 0.45))
      bodyGrad.addColorStop(1,   c(0.012))
      drawBlobPath(ctx, pts); ctx.fillStyle = bodyGrad; ctx.fill()

      // ── Layer 3: Edge stroke ──
      drawBlobPath(ctx, pts)
      ctx.save()
      ctx.strokeStyle = c(0.58)
      ctx.lineWidth   = 1.3
      ctx.stroke()
      ctx.restore()

      // ── Layer 4: Inner core shimmer ──
      const innerPts  = getBlobVertices(t + Math.PI * 0.7, cp.A1 * 0.5, cp.A2 * 0.5, cp.A3 * 0.5, cp.F1, cp.F2, cp.F3, R * 0.50, cx, cy)
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.52)
      innerGrad.addColorStop(0, c(cp.innerBrightness * 1.8))
      innerGrad.addColorStop(1, c(0))
      drawBlobPath(ctx, innerPts); ctx.fillStyle = innerGrad; ctx.fill()

      // ── Layer 5: THINKING particles ──
      const pa = particleAlphaRef.current
      if (pa > 0.005) {
        for (const p of PARTICLES) {
          const angle  = p.phase + t * p.speed
          const px     = cx + Math.cos(angle) * p.radius
          const py     = cy + Math.sin(angle) * p.radius
          const blink  = (Math.sin(t * 1.6 + p.phase) + 1) / 2
          const alpha  = pa * p.opacity * lerp(0.35, 1.0, blink)
          const pGrad  = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.5)
          pGrad.addColorStop(0, c(alpha))
          pGrad.addColorStop(1, c(0))
          ctx.beginPath(); ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = pGrad; ctx.fill()
        }

        // Inner energy ring
        const ringPulse = (Math.sin(t * 1.4) + 1) / 2
        const rGrad     = ctx.createRadialGradient(cx, cy, R * 0.15, cx, cy, R * 0.52)
        rGrad.addColorStop(0,   c(0))
        rGrad.addColorStop(0.5, c(pa * cp.innerBrightness * lerp(0.45, 0.90, ringPulse)))
        rGrad.addColorStop(1,   c(0))
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2)
        ctx.fillStyle = rGrad; ctx.fill()
      }

      // ── Layer 6: Top-left highlight ──
      const hlX    = cx - R * 0.24
      const hlY    = cy - R * 0.26
      const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, 22)
      hlGrad.addColorStop(0, 'rgba(255,255,255,0.13)')
      hlGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath(); ctx.arc(hlX, hlY, 22, 0, Math.PI * 2)
      ctx.fillStyle = hlGrad; ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return <canvas ref={canvasRef} style={{ display: 'block' }} />
}

// ─── Status ticker ────────────────────────────────────────────────────────────

function StatusTicker({ rgb }: { rgb: RGB }) {
  const [idx, setIdx]         = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(p => (p + 1) % THINKING_STATUSES.length); setVisible(true) }, 400)
    }, 3400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-center gap-1.5 h-5">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: visible ? 0.55 : 0, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`, letterSpacing: '0.02em' }}
        >
          {THINKING_STATUSES[idx]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
        style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.35)` }}
      >
        |
      </motion.span>
    </div>
  )
}

// ─── Panel root ───────────────────────────────────────────────────────────────

export function UnderstandingPanel() {
  const router      = useRouter()
  const understanding = useUnderstanding()
  const isStreaming   = useFounderSessionStore((s) => s.isStreaming)
  const { overallConfidence, isComplete, weakestCategory } = understanding

  const isPreSession = weakestCategory === null && overallConfidence === 0

  // The orb is always alive. State changes only affect glow intensity.
  const orbState: OrbState = isStreaming ? 'THINKING' : 'AMBIENT'

  const accentRgb: RGB = (isPreSession || overallConfidence >= 75)
    ? [79, 250, 176]
    : overallConfidence >= 40 ? [245, 158, 11] : [239, 68, 68]
  const accentColor    = `rgb(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]})`
  const focusLabel     = weakestCategory ? FOCUS_LABEL[weakestCategory] : null
  const contextText    = isStreaming
    ? 'Connecting ideas and updating the mental model.'
    : !isPreSession && !isComplete
    ? 'Continuously understanding your startup.'
    : null

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F0F0F' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{ height: 44, borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111111' }}
      >
        <span className="text-foreground text-[13px] font-semibold tracking-[-0.015em]">
          Startup Understanding
        </span>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.span
              key="complete"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(79,250,176,0.12)', color: '#4FFAB0', border: '1px solid rgba(79,250,176,0.25)', letterSpacing: '0.03em' }}
            >
              ✓ Complete
            </motion.span>
          ) : (
            <motion.span
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 font-mono text-[10px]"
              style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}
            >
              <span
                className="w-[5px] h-[5px] rounded-full bg-[#44E5A9] animate-pulse"
                style={{ boxShadow: '0 0 5px rgba(68,229,169,0.7)' }}
              />
              LIVE
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 py-8 px-6">

        {/* Identity + context */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-lg" />
            <span style={{ fontFamily: 'Geist, ui-sans-serif, sans-serif', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.80)' }}>
              Xenysis
            </span>
          </div>
          <AnimatePresence mode="wait">
            {contextText && (
              <motion.p
                key={contextText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', maxWidth: 200, lineHeight: 1.6 }}
              >
                {contextText}
              </motion.p>
            )}
            {isComplete && (
              <motion.p
                key="complete-sub"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', maxWidth: 200, lineHeight: 1.6 }}
              >
                The startup model is complete and ready for analysis.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Orb with text overlaid inside */}
        <div style={{ position: 'relative', width: CANVAS_SIZE, height: CANVAS_SIZE, flexShrink: 0 }}>
          <OrbCanvas orbState={orbState} rgb={accentRgb} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, pointerEvents: 'none' }}>
            <motion.p
              key={overallConfidence}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Geist, ui-sans-serif, sans-serif',
                fontSize: 46,
                fontWeight: 600,
                color: isPreSession ? 'rgba(255,255,255,0.18)' : accentColor,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                textAlign: 'center',
              }}
            >
              {overallConfidence}%
            </motion.p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.20em', textAlign: 'center' }}>
              understood
            </p>
          </div>
        </div>

        {/* Status below orb */}
        <div className="flex flex-col items-center gap-2 w-full">

          <AnimatePresence mode="wait">
            {focusLabel && !isPreSession && !isComplete && (
              <motion.div
                key={focusLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 mt-1"
              >
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Current Focus
                </span>
                <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.12)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'Geist, ui-sans-serif, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.60)', letterSpacing: '-0.01em' }}>
                  {focusLabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <StatusTicker rgb={accentRgb} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isPreSession && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em', marginTop: 4 }}
              >
                Waiting for your input...
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CTA ── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              onClick={() => router.push('/session-summary')}
              className="w-full flex items-center justify-center gap-2 rounded-[8px] h-9 font-semibold tracking-[-0.01em] transition-all duration-200 cursor-pointer"
              style={{ fontSize: 13, background: '#4FFAB0', color: '#0A0A0A' }}
            >
              Generate Founder Report
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
