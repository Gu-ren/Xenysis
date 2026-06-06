'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'
import { useFounderSessionStore } from '@/store/founder-session'
import type { StartupBlueprint } from '../../types'
import Image from 'next/image'

const STREAMING_TEXT =
  "Real estate teams manage high-value, relationship-driven pipelines — they need a system that mirrors how agents actually work. I'm mapping the CRM around lead lifecycle, not just contacts. The property data model will support deal tracking with staged workflows, and the client portal will let buyers check progress without clogging your inbox."

const OPTION_CHIPS = [
  { id: 'oc1', label: 'Monthly subscription' },
  { id: 'oc2', label: 'Per-seat pricing' },
  { id: 'oc3', label: 'One-time purchase' },
]

const ORCHESTRATION_LINES: {
  id: string
  text: string
  state: 'done' | 'shimmer' | 'active' | 'queued'
}[] = [
  { id: 'ol1', text: 'Mapping ideal customer profile', state: 'done' },
  { id: 'ol2', text: 'Detecting revenue model signals', state: 'shimmer' },
  { id: 'ol3', text: 'Generating competitive landscape', state: 'active' },
  { id: 'ol4', text: 'Building differentiation matrix', state: 'queued' },
]

function OptionChip({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="font-mono text-[11px] text-foreground px-[10px] py-[5px] rounded-md cursor-pointer tracking-[0.01em] transition-[border-color,background] duration-[180ms]"
      style={{
        border: `1px solid ${hovered ? 'rgba(79,250,176,0.3)' : 'rgba(255,255,255,0.1)'}`,
        background: hovered ? 'rgba(79,250,176,0.05)' : 'transparent',
      }}
    >
      {label}
    </button>
  )
}

export function ConversationPane() {
  const router = useRouter()
  const setBlueprint = useFounderSessionStore((s) => s.setBlueprint)
  const pingCanvas = useFounderSessionStore((s) => s.pingCanvas)

  const [inputValue, setInputValue] = useState('')
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  const scrollEndRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  useEffect(() => {
    let idx = 0
    setStreamedText('')
    streamRef.current = setInterval(() => {
      idx++
      setStreamedText(STREAMING_TEXT.slice(0, idx))
      if (idx >= STREAMING_TEXT.length) {
        if (streamRef.current) clearInterval(streamRef.current)
        setIsStreaming(false)
      }
    }, 20)
    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamedText])

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
        <motion.div  className=" flex gap-2">
          <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
      <span className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
        Xenysis
      </span>
            </motion.div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-muted">Founder Session</span>
         
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-background text-[11px] font-semibold tracking-[-0.01em] rounded-[7px] hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
        >
          End Session
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-[18px] pt-[18px] pb-2">

        {/* Opening role framing */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[22px]"
        >
          <div className="flex gap-[11px]">
            <div className="w-0.5 bg-primary shrink-0" />
            <div>
              <span
                className="block font-mono uppercase mb-[5px]"
                style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--primary)' }}
              >
                Business Discovery · Phase 1
              </span>
              <p className="text-foreground text-[15px] font-semibold tracking-[-0.02em] m-0 mb-[5px]">
                Let&apos;s build your foundation.
              </p>
              <p className="text-muted text-[13px] leading-relaxed m-0">
                I&apos;m acting as your business consultant for this phase. I&apos;ll ask questions to
                understand your customer, market, and monetization — then map your startup architecture
                from your answers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Q1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[10px]"
        >
          <span
            className="block font-mono uppercase mb-[5px]"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            Xenysis · Q1
          </span>
          <p className="text-foreground text-[14px] leading-[1.65] tracking-[-0.01em] m-0">
            Who is your ideal customer? Are they independent agents, small brokerages, or large real
            estate firms?
          </p>
        </motion.div>

        {/* User answer 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end mb-[18px]"
        >
          <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
            <p className="text-foreground text-[13px] leading-relaxed m-0 tracking-[-0.01em]">
              Small to mid-sized brokerages — teams of 5 to 30 agents.
            </p>
          </div>
        </motion.div>

        {/* Q2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[10px]"
        >
          <span
            className="block font-mono uppercase mb-[5px]"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            Xenysis · Q2
          </span>
          <p className="text-foreground text-[14px] leading-[1.65] tracking-[-0.01em] m-0">
            How do these teams currently manage their leads and client relationships? Spreadsheets,
            generic CRMs, something else?
          </p>
        </motion.div>

        {/* User answer 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end mb-[18px]"
        >
          <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
            <p className="text-foreground text-[13px] leading-relaxed m-0 tracking-[-0.01em]">
              Mostly spreadsheets and generic CRMs that weren&apos;t built for real estate. They miss deal
              stages, property linking, and client visibility.
            </p>
          </div>
        </motion.div>

        {/* Q3 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[18px]"
        >
          <span
            className="block font-mono uppercase mb-[5px]"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            Xenysis · Q3
          </span>
          <p className="text-foreground text-[14px] leading-[1.65] tracking-[-0.01em] m-0 mb-[10px]">
            How will customers pay? A subscription gives you predictable revenue and aligns well with
            team-based usage.
          </p>
          <div className="flex flex-wrap gap-2">
            {OPTION_CHIPS.map((chip) => (
              <OptionChip key={chip.id} label={chip.label} />
            ))}
          </div>
        </motion.div>

        {/* User answer 3 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end mb-[18px]"
        >
          <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
            <p className="text-foreground text-[13px] leading-relaxed m-0 tracking-[-0.01em]">
              Monthly subscription, per team. Maybe per-seat for larger brokerages.
            </p>
          </div>
        </motion.div>

        {/* Infrastructure insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[22px]"
        >
          <div className="flex gap-[11px]">
            <div
              className="shrink-0"
              style={{ width: 1, background: 'rgba(79,250,176,0.3)' }}
            />
            <div>
              <span
                className="block font-mono uppercase mb-[6px]"
                style={{ fontSize: 9, letterSpacing: '0.1em', color: 'var(--muted)' }}
              >
                Infrastructure Insight
              </span>
              <p className="text-muted text-[13px] leading-relaxed m-0">
                Workspace-scoped billing fits naturally here. Per-seat pricing can be calculated
                automatically from your role permissions model — no extra overhead.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Q4 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[18px]"
        >
          <span
            className="block font-mono uppercase mb-[5px]"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            Xenysis · Q4
          </span>
          <p className="text-foreground text-[14px] leading-[1.65] tracking-[-0.01em] m-0">
            What makes your solution different? Why will a brokerage choose you over Salesforce or
            HubSpot?
          </p>
        </motion.div>

        {/* Streaming AI response */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[14px]"
        >
          <span
            className="block font-mono uppercase mb-[6px]"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--primary)' }}
          >
            Xenysis
          </span>
          <p className="text-foreground text-[13px] leading-[1.65] whitespace-pre-line m-0 tracking-[-0.01em]">
            {streamedText}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-[13px] bg-primary ml-0.5 align-middle"
                style={{ animation: 'fs-cursor 0.9s step-end infinite' }}
              />
            )}
          </p>
        </motion.div>

        {/* Orchestration state */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-lg px-[14px] py-[10px] mb-5"
        >
          {ORCHESTRATION_LINES.map((line) => (
            <div key={line.id} className="flex items-center gap-2 mb-1.5 last:mb-0">
              {line.state === 'done' ? (
                <span
                  className="font-mono w-3 shrink-0"
                  style={{ fontSize: 10, color: 'var(--primary)' }}
                >
                  ✓
                </span>
              ) : line.state === 'active' ? (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: 'var(--primary)',
                    animation: 'fs-pulse-dot 1.5s ease-in-out infinite',
                  }}
                />
              ) : (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'rgba(85,85,85,1)' }}
                />
              )}
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color:
                    line.state === 'active'
                      ? 'var(--foreground)'
                      : line.state === 'done'
                        ? 'var(--muted)'
                        : 'rgba(85,85,85,1)',
                  animation:
                    line.state === 'shimmer' ? 'fs-shimmer 2.2s ease-in-out infinite' : undefined,
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </motion.div>

        <div ref={scrollEndRef} />
      </div>

      {/* Input area */}
      <div className="px-[14px] pb-[14px] bg-background shrink-0">
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
                className="inline-block w-[5px] h-[5px] rounded-full bg-primary shrink-0"
                style={{ animation: 'fs-pulse-dot 1.5s ease-in-out infinite' }}
              />
              <span className="font-mono text-[10px] text-muted tracking-[0.01em]">
                Xenysis is mapping your business…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="flex items-center gap-3 bg-card border border-border rounded-[10px] px-[15px] h-11 transition-[border-color,box-shadow] duration-200 focus-within:border-primary/30 focus-within:[box-shadow:0_0_0_3px_rgba(79,250,176,0.10)]"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Answer or ask Xenysis anything…"
            className="flex-1 bg-transparent border-none outline-none text-foreground text-[13px] tracking-[-0.01em] placeholder:text-muted/50"
            style={{ caretColor: 'var(--primary)' }}
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="w-[27px] h-[27px] flex items-center justify-center rounded-md bg-transparent border-none cursor-pointer shrink-0 p-0 transition-colors duration-150"
            style={{ color: inputValue.trim() ? 'var(--primary)' : 'rgba(85,85,85,1)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = inputValue.trim()
                ? 'var(--primary)'
                : 'rgba(85,85,85,1)'
            }}
          >
            <Send style={{ width: 14, height: 14 }} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
