'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'
import { PatternCard } from './pattern-card'
import { OpportunityCard } from './opportunity-card'
import { InsightCard } from './insight-card'
import { useFounderSessionStore } from '@/store/founder-session'
import { STREAMING_FULL_TEXT } from '../constants'
import type { StartupBlueprint } from '../../types'

// ── Startup DNA signals ───────────────────────────────────────────────────────
// What Xenysis has confirmed about this business. Surfaces in PatternCard.
const DNA_SIGNALS = [
  'B2B SaaS',
  'Real Estate Teams',
  'Per-seat Billing',
  'Team Collaboration',
  'Pipeline-driven',
]

// ── Stage marker ──────────────────────────────────────────────────────────────
function StageMarker({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <span
        className="font-mono uppercase shrink-0"
        style={{ fontSize: 9, letterSpacing: '0.08em', color: 'rgba(250,250,250,0.22)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </div>
  )
}

// ── Xenysis attribution ───────────────────────────────────────────────────────
// Appears once above each Xenysis message block.
function XenysisLabel() {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="var(--primary)" opacity="0.65" />
      </svg>
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9.5, letterSpacing: '0.08em', color: 'rgba(79,250,176,0.55)' }}
      >
        Xenysis
      </span>
    </div>
  )
}

// ── ConversationPane ──────────────────────────────────────────────────────────

export function ConversationPane() {
  const router = useRouter()
  const setBlueprint = useFounderSessionStore((s) => s.setBlueprint)
  const pingCanvas = useFounderSessionStore((s) => s.pingCanvas)

  const [inputValue, setInputValue] = useState('')
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)
  // Canvas synchronization: OpportunityCard appears after streaming ends,
  // echoing the opportunity node the canvas has been showing since mount.
  const [showOpportunity, setShowOpportunity] = useState(false)

  const scrollEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const opportunityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEndSession = () => {
    const blueprint: StartupBlueprint = {
      businessModel: 'B2B SaaS',
      detectedPattern: 'B2B SaaS — Real Estate Teams',
      systems: [
        { name: 'Customer Sign Up', status: 'wired' },
        { name: 'Team Access', status: 'wired' },
        { name: 'Lead Management', status: 'active' },
        { name: 'Client Activity', status: 'generating' },
      ],
      architectureScore: 94,
      workflowConfidence: 'High',
    }
    setBlueprint(blueprint)
    router.push('/session-summary')
  }

  // Stream the Xenysis response on mount
  useEffect(() => {
    let idx = 0
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreamedText('')
    streamRef.current = setInterval(() => {
      idx++
      setStreamedText(STREAMING_FULL_TEXT.slice(0, idx))
      if (idx >= STREAMING_FULL_TEXT.length) {
        if (streamRef.current) clearInterval(streamRef.current)
        setIsStreaming(false)
      }
    }, 22)
    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [])

  // When streaming ends, surface the OpportunityCard — canvas has been showing
  // the Client Portal opportunity node the whole time; conversation now catches up.
  useEffect(() => {
    if (!isStreaming) {
      opportunityTimerRef.current = setTimeout(() => setShowOpportunity(true), 520)
      return () => {
        if (opportunityTimerRef.current) clearTimeout(opportunityTimerRef.current)
      }
    }
  }, [isStreaming])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamedText, showOpportunity])

  const handleSend = useCallback(() => {
    setInputValue('')
    pingCanvas()
  }, [pingCanvas])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSend()
    },
    [handleSend],
  )

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0 border-b border-border"
        style={{ height: 44, background: 'rgba(255,255,255,0.01)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="var(--primary)" />
          </svg>
          <span className="text-foreground text-[13px] font-semibold tracking-[-0.02em]">
            Xenysis
          </span>
          <span className="w-[5px] h-[5px] rounded-full bg-primary shrink-0" />
          <span className="text-muted text-[12px] tracking-[-0.01em]">Founder Session</span>
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-background text-[11px] font-semibold tracking-[-0.01em] rounded-[7px] hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
        >
          End Session
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">

        {/* PatternCard — Xenysis locks in the business model */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <PatternCard
            pattern="B2B SaaS — Real Estate Teams"
            dnaSignals={DNA_SIGNALS}
          />
        </motion.div>

        {/* Founder message 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end mb-6"
        >
          <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
            <p className="text-foreground text-[14px] leading-relaxed m-0 tracking-[-0.01em]">
              An AI CRM for real estate teams.
            </p>
          </div>
        </motion.div>

        {/* Xenysis — cofounder strategic question */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <XenysisLabel />
          <p className="text-foreground text-[14px] leading-[1.72] tracking-[-0.01em] m-0">
            Real estate teams close deals over weeks — so the CRM&apos;s core job is relationship depth,
            not contact volume. Most tools in this space fail because they treat leads like support
            tickets instead of long-cycle relationships.
          </p>
          <p className="text-muted text-[13px] leading-relaxed m-0 mt-2">
            Should agents manage their own pipelines independently, or do team leads need visibility
            across all deals?
          </p>
        </motion.div>

        {/* Founder message 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end mb-6"
        >
          <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
            <p className="text-foreground text-[14px] leading-relaxed m-0 tracking-[-0.01em]">
              Yes, include billing. Also need property listings.
            </p>
          </div>
        </motion.div>

        {/* Stage 2 — transition from business understanding to product architecture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.46, ease: 'easeOut' }}
        >
          <StageMarker label="Stage 2 · Product Architecture" />
        </motion.div>

        {/* InsightCard — strategic business truth about the revenue model */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <InsightCard>
            Since your customers are teams, per-seat subscriptions create a natural expansion
            model — as brokerages grow, revenue grows without additional sales effort.
          </InsightCard>
        </motion.div>

        {/* Xenysis — streaming response, mentions client portal (canvas already shows it) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <XenysisLabel />
          <p className="text-foreground text-[14px] leading-[1.65] whitespace-pre-line m-0 tracking-[-0.01em]">
            {streamedText}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 align-middle"
                style={{ animation: 'fs-cursor 0.9s step-end infinite' }}
              />
            )}
          </p>
        </motion.div>

        {/* OpportunityCard — appears after streaming ends, echoing the canvas node.
            The canvas has been showing Client Portal since mount. This card catches up. */}
        <AnimatePresence>
          {showOpportunity && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5"
            >
              <OpportunityCard
                title="Client Portal"
                description="Real estate agencies want a white-labeled space for clients to track their deals. This creates recurring value beyond the CRM itself and justifies a higher-tier subscription plan."
                type="revenue"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollEndRef} />
      </div>

      {/* Thinking indicator + input */}
      <div className="px-4 pb-4 bg-background shrink-0">
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-2 mb-2 pl-1"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                style={{ animation: 'fs-pulse-dot 1.5s ease-in-out infinite' }}
              />
              <span className="font-mono text-[11px] text-muted tracking-[0.01em]">
                Xenysis is mapping your product…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 bg-card border border-border rounded-[10px] px-4 h-[46px] transition-colors duration-200 focus-within:border-primary/30 focus-within:[box-shadow:0_0_0_3px_rgba(79,250,176,0.12)]">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue the session…"
            className="flex-1 bg-transparent border-none outline-none text-foreground text-[14px] tracking-[-0.01em] placeholder:text-muted/50"
            style={{ caretColor: 'var(--primary)' }}
          />
          <button
            onClick={handleSend}
            aria-label="Send"
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
