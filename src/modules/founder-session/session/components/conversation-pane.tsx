'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { useFounderSessionStore } from '@/store/founder-session'
import {
  streamChatMessage,
  continueDiscovery,
  generateChoices,
} from '@/modules/founder-session/services/sessions'
import { useUnderstanding } from '@/modules/founder-session/session/hooks/use-understanding'
import { focusLabelFor, type UnderstandingCategory } from '@/modules/founder-session/types/understanding'
import { AnswerChoices } from '@/modules/founder-session/session/components/answer-choices'
import type { AnswerChoice } from '@/modules/founder-session/utils/answer-choices'

const LINE_HEIGHT = 22
const MAX_ROWS = 9

const COMPOSER_PLACEHOLDERS: Record<UnderstandingCategory, string> = {
  problem:     'Describe the specific pain — who feels it, how often, and what workaround they use today…',
  customer:    'Name the buyer — role, company size, and what triggers them to search for a solution…',
  solution:      'Explain what you\'re building and why it beats the current workaround…',
  market:      'Share market size, growth signals, or timing — include numbers if you have them…',
  pricing:     'Describe your revenue model, price point, and any willingness-to-pay signals…',
  competition: 'Name competitors or alternatives and why customers would switch to you…',
  risks:       'Describe the biggest threat and your key unproven assumption…',
  founder_fit: 'Share your domain expertise, customer access, and why you can win…',
  supply_side: 'Explain how you recruit, onboard, and retain supply-side participants…',
}

const DEFAULT_PLACEHOLDER =
  'What are you building? Describe your idea, target customers, and the problem you\'re solving…'

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = LINE_HEIGHT * MAX_ROWS
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [value])

  return ref
}

interface Message {
  role: 'user' | 'ai'
  content: string
  choices?: AnswerChoice[]
  selectedChoice?: string
  choicesDismissed?: boolean
}

export function ConversationPane() {
  const router = useRouter()
  const startupId = useFounderSessionStore((s) => s.startupId)
  const sessionId = useFounderSessionStore((s) => s.sessionId)
  const pingExchange = useFounderSessionStore((s) => s.pingExchange)
  const isSessionComplete = useFounderSessionStore((s) => s.isSessionComplete)
  const setIsTyping = useFounderSessionStore((s) => s.setIsTyping)
  const setStreamingInStore = useFounderSessionStore((s) => s.setIsStreaming)
  const continueDiscoveryPingAt = useFounderSessionStore((s) => s.continueDiscoveryPingAt)
  const reset = useFounderSessionStore((s) => s.reset)

  const understanding = useUnderstanding()
  const { earlyExitEligible } = understanding

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [pendingChoice, setPendingChoice] = useState<string | null>(null)
  const [gateDismissedThisCycle, setGateDismissedThisCycle] = useState(false)
  const [choicesUnlocked, setChoicesUnlocked] = useState(false)
  const [isGeneratingChoices, setIsGeneratingChoices] = useState(false)
  const [lowEffortBanner, setLowEffortBanner] = useState(false)

  const composerPlaceholder = understanding.weakestCategory
    ? (COMPOSER_PLACEHOLDERS[understanding.weakestCategory] ?? DEFAULT_PLACEHOLDER)
    : DEFAULT_PLACEHOLDER

  const scrollEndRef   = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const startupIdRef   = useRef(startupId)
  const sessionIdRef   = useRef(sessionId)
  const prevEligibleRef = useRef(false)
  const continueDiscoveryPingRef = useRef<number | null>(null)
  const textareaRef    = useAutoResize(inputValue)

  const showDiscoveryGate =
    earlyExitEligible &&
    !gateDismissedThisCycle &&
    !isSessionComplete &&
    !isStreaming

  const canShowChoices = !showDiscoveryGate || choicesUnlocked

  useEffect(() => { startupIdRef.current = startupId }, [startupId])
  useEffect(() => { sessionIdRef.current = sessionId }, [sessionId])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (earlyExitEligible && !prevEligibleRef.current) {
      setGateDismissedThisCycle(false)
      setChoicesUnlocked(false)
    }
    prevEligibleRef.current = earlyExitEligible
  }, [earlyExitEligible])

  const handleContinueDiscovery = useCallback(async () => {
    const sid = startupIdRef.current
    const sessId = sessionIdRef.current
    if (!sid || !sessId || isGeneratingChoices || isStreaming) return

    const lastAiIndex = messages.findLastIndex((m) => m.role === 'ai')
    const lastAi = lastAiIndex >= 0 ? messages[lastAiIndex] : null
    if (!lastAi?.content.trim()) return

    setIsGeneratingChoices(true)
    try {
      await continueDiscovery(sid, sessId)
      setGateDismissedThisCycle(true)
      setChoicesUnlocked(true)
      pingExchange()

      const choices = await generateChoices(sid, sessId, lastAi.content)
      if (choices.length > 0) {
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === lastAiIndex && msg.role === 'ai'
              ? { ...msg, choices }
              : msg,
          ),
        )
      }
    } catch {
      // gate stays active on failure
    } finally {
      setIsGeneratingChoices(false)
    }
  }, [messages, isGeneratingChoices, isStreaming, pingExchange])

  useEffect(() => {
    if (!continueDiscoveryPingAt) return
    if (continueDiscoveryPingAt === continueDiscoveryPingRef.current) return
    continueDiscoveryPingRef.current = continueDiscoveryPingAt
    void handleContinueDiscovery()
  }, [continueDiscoveryPingAt, handleContinueDiscovery])

  const doStream = useCallback(async (text: string, isInitial = false) => {
    const sid = startupIdRef.current
    const sessId = sessionIdRef.current
    if (!sid || !sessId) return

    if (!isInitial) {
      setMessages((prev) => {
        const updated = prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.role === 'ai' && msg.choices?.length
            ? { ...msg, choicesDismissed: true }
            : msg,
        )
        return [...updated, { role: 'user', content: text }]
      })
      setPendingChoice(null)
    }
    setIsStreaming(true)
    setStreamingInStore(true)
    setMessages((prev) => [...prev, { role: 'ai', content: '' }])

    await streamChatMessage(sid, sessId, text, {
      onChunk: (chunk) => {
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.role === 'ai') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })
      },
      onComplete: (_jobId, choices) => {
        setIsStreaming(false)
        setStreamingInStore(false)
        pingExchange()
        if (choices && choices.length > 0) {
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last?.role === 'ai') {
              updated[updated.length - 1] = { ...last, choices }
            }
            return updated
          })
        }
      },
      onError: (_message, status, errorCode) => {
        setIsStreaming(false)
        setStreamingInStore(false)
        if (status === 404 || (status === 422 && errorCode === 'BUSINESS_RULE')) {
          reset()
          router.replace('/founder-session?fresh=true')
          return
        }
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.role === 'ai') {
            updated[updated.length - 1] = { ...last, content: 'Something went wrong. Please try again.' }
          }
          return updated
        })
      },
    })
  }, [pingExchange, reset, router])

  // Trigger initial AI question when session IDs are ready.
  // Guard with isSessionComplete: if the persisted store has a completed session,
  // do NOT re-send the opener to an already-finished session (avoids 422 BUSINESS_RULE).
  useEffect(() => {
    if (!startupId || !sessionId || initializedRef.current || isSessionComplete) return
    initializedRef.current = true
    doStream('Let\'s begin the founder discovery session.', true)
  }, [startupId, sessionId, doStream, isSessionComplete])

  const handleChoiceSelect = useCallback((choice: AnswerChoice, messageIndex: number) => {
    if (isStreaming || isSessionComplete) return
    setInputValue(choice.text)
    setPendingChoice(choice.text)
    setIsTyping(true)
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === messageIndex && msg.role === 'ai'
          ? { ...msg, selectedChoice: choice.text }
          : msg,
      ),
    )
    textareaRef.current?.focus()
  }, [isStreaming, isSessionComplete, setIsTyping, textareaRef])

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text || isStreaming) return

    if (pendingChoice && text === pendingChoice && text.length < 120) {
      setLowEffortBanner(true)
      return
    }

    if (text.length < 40 && !window.confirm('Short answers slow discovery. Send anyway?')) {
      return
    }

    setLowEffortBanner(false)
    setInputValue('')
    setIsTyping(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.overflowY = 'hidden'
    }
    doStream(text)
  }, [inputValue, isStreaming, doStream, setIsTyping, textareaRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === 'Enter') {
        e.preventDefault()
        handleSend()
        return
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleEndSession = () => {
    router.push('/session-summary')
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0 border-b border-border"
        style={{ height: 44, background: 'rgba(255,255,255,0.01)' }}
      >
        
        <div className="flex items-center gap-3">
          <span className=" text-[16px] text-white">Founder Session</span>
        </div>
        
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-[18px] pt-[18px] pb-2">

        {/* Static intro framing */}
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

        {/* Dynamic messages */}
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-end mb-[14px]"
            >
              <div className="max-w-[76%] bg-card border border-border rounded-lg px-3.5 py-2.5">
                <p className="text-foreground text-[13px] leading-relaxed m-0 tracking-[-0.01em]">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-[18px]"
            >
              <span
                className="block font-mono uppercase mb-[6px]"
                style={{ fontSize: 9, letterSpacing: '0.08em', color: 'var(--primary)' }}
              >
                Xenysis
              </span>
              <p className="text-foreground text-[14px] leading-[1.65] whitespace-pre-line m-0 tracking-[-0.01em]">
                {msg.content}
                {isStreaming && i === messages.length - 1 && (
                  <span
                    className="inline-block w-0.5 h-[13px] bg-primary ml-0.5 align-middle"
                    style={{ animation: 'fs-cursor 0.9s step-end infinite' }}
                  />
                )}
              </p>
              {msg.role === 'ai' &&
                msg.choices &&
                msg.choices.length > 0 &&
                !msg.choicesDismissed &&
                !isStreaming &&
                canShowChoices &&
                i === messages.length - 1 && (
                  <AnswerChoices
                    choices={msg.choices}
                    selectedChoice={msg.selectedChoice ?? pendingChoice}
                    disabled={isSessionComplete}
                    onSelect={(choice) => handleChoiceSelect(choice, i)}
                  />
                )}
            </motion.div>
          ),
        )}

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
                Xenysis is thinking…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSessionComplete && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 mb-2 pl-1"
            >
              <span
                className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
                style={{ background: 'var(--primary)', boxShadow: '0 0 6px rgba(79,250,176,0.6)' }}
              />
              <span
                className="font-mono text-[10px]"
                style={{ color: 'var(--primary)', letterSpacing: '0.04em' }}
              >
                Discovery Complete — Generate your Founder Report to continue.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {showDiscoveryGate ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10px] text-muted tracking-[0.02em] m-0 pl-1">
              {understanding.earlyExitDismissed
                ? 'You\'ve reached 90% understanding — continue exploring or generate your assessment.'
                : 'You\'ve reached 80% understanding — continue exploring or generate your assessment.'}
            </p>
            <button
              type="button"
              onClick={() => void handleContinueDiscovery()}
              disabled={isGeneratingChoices}
              className="w-full flex items-center justify-center gap-2 rounded-2xl h-11 font-semibold tracking-[-0.01em] transition-all duration-200 disabled:opacity-60"
              style={{
                fontSize: 13,
                background: 'rgba(79,250,176,0.12)',
                color: 'var(--primary)',
                border: '1px solid rgba(79,250,176,0.35)',
              }}
            >
              {isGeneratingChoices ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating suggestions…
                </>
              ) : (
                'Continue Discovery'
              )}
            </button>
          </div>
        ) : (
        <>
        {lowEffortBanner && (
          <p className="font-mono text-[10px] text-muted tracking-[0.02em] m-0 mb-2 pl-1">
            Add your specifics — who, when, and a real example — before sending.
          </p>
        )}
        {!isSessionComplete && !showDiscoveryGate && understanding.weakestCategory && (
          <p className="font-mono text-[10px] text-muted tracking-[0.02em] m-0 mb-2 pl-1">
            Focus: {focusLabelFor(understanding.weakestCategory)} — specific examples and numbers help Xenysis understand faster.
          </p>
        )}
        <div
          className="flex flex-col bg-card rounded-2xl transition-[border-color,box-shadow] duration-200"
          style={{
            border: isFocused
              ? '1px solid rgba(79,250,176,0.35)'
              : '1px solid var(--border)',
            boxShadow: isFocused
              ? '0 0 0 3px rgba(79,250,176,0.10)'
              : 'none',
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsTyping(e.target.value.length > 0)
              if (lowEffortBanner) setLowEffortBanner(false)
              if (pendingChoice && e.target.value !== pendingChoice) {
                setPendingChoice(null)
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              pendingChoice
                ? 'Refine your selected answer — add details, context, or corrections…'
                : composerPlaceholder
            }
            disabled={isStreaming || isSessionComplete}
            rows={1}
            aria-label="Message composer"
            aria-multiline="true"
            className="w-full bg-transparent border-none outline-none resize-none text-foreground text-[13px] leading-[22px] tracking-[-0.01em] placeholder:text-muted/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 pt-3 pb-1"
            style={{
              caretColor: 'var(--primary)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(79,250,176,0.25) transparent',
            }}
          />
          <div className="flex justify-end px-3 pb-3 pt-1">
            <button
              onClick={handleSend}
              disabled={isStreaming || isSessionComplete || !inputValue.trim()}
              aria-label="Send message"
              className="w-[28px] h-[28px] flex items-center justify-center rounded-lg transition-all duration-150 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{
                background:
                  inputValue.trim() && !isStreaming && !isSessionComplete
                    ? 'rgba(79,250,176,0.12)'
                    : 'transparent',
                color:
                  inputValue.trim() && !isStreaming && !isSessionComplete
                    ? 'var(--primary)'
                    : 'rgba(85,85,85,1)',
                outlineColor: 'var(--primary)',
              }}
            >
              {isStreaming ? (
                <Loader2 style={{ width: 13, height: 13 }} strokeWidth={2} className="animate-spin" />
              ) : (
                <Send style={{ width: 13, height: 13 }} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}
