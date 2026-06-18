'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'
import { useFounderSessionStore } from '@/store/founder-session'
import { streamChatMessage } from '@/modules/founder-session/services/sessions'
import Image from 'next/image'

interface Message {
  role: 'user' | 'ai'
  content: string
}

export function ConversationPane() {
  const router = useRouter()
  const startupId = useFounderSessionStore((s) => s.startupId)
  const sessionId = useFounderSessionStore((s) => s.sessionId)
  const pingExchange = useFounderSessionStore((s) => s.pingExchange)
  const isSessionComplete = useFounderSessionStore((s) => s.isSessionComplete)
  const setIsTyping = useFounderSessionStore((s) => s.setIsTyping)
  const setStreamingInStore = useFounderSessionStore((s) => s.setIsStreaming)
  const reset = useFounderSessionStore((s) => s.reset)

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const scrollEndRef   = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const startupIdRef   = useRef(startupId)
  const sessionIdRef   = useRef(sessionId)

  useEffect(() => { startupIdRef.current = startupId }, [startupId])
  useEffect(() => { sessionIdRef.current = sessionId }, [sessionId])

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const doStream = useCallback(async (text: string, isInitial = false) => {
    const sid = startupIdRef.current
    const sessId = sessionIdRef.current
    if (!sid || !sessId) return

    if (!isInitial) {
      setMessages((prev) => [...prev, { role: 'user', content: text }])
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
      onComplete: () => {
        setIsStreaming(false)
        setStreamingInStore(false)
        pingExchange()
      },
      onError: (_message, status) => {
        setIsStreaming(false)
        setStreamingInStore(false)
        if (status === 404) {
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

  // Trigger initial AI question when session IDs are ready
  useEffect(() => {
    if (!startupId || !sessionId || initializedRef.current) return
    initializedRef.current = true
    doStream('Let\'s begin the founder discovery session.', true)
  }, [startupId, sessionId, doStream])

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text || isStreaming) return
    setInputValue('')
    setIsTyping(false)
    doStream(text)
  }, [inputValue, isStreaming, doStream, setIsTyping])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSend()
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

        <div className="flex items-center gap-3 bg-card border border-border rounded-[10px] px-[15px] h-11 transition-[border-color,box-shadow] duration-200 focus-within:border-primary/30 focus-within:[box-shadow:0_0_0_3px_rgba(79,250,176,0.10)]">
          <input
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setIsTyping(e.target.value.length > 0) }}
            onKeyDown={handleKeyDown}
            placeholder="Answer or ask Xenysis anything…"
            disabled={isStreaming || isSessionComplete}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-[13px] tracking-[-0.01em] placeholder:text-muted/50 disabled:opacity-50"
            style={{ caretColor: 'var(--primary)' }}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || isSessionComplete || !inputValue.trim()}
            aria-label="Send message"
            className="w-[27px] h-[27px] flex items-center justify-center rounded-md bg-transparent border-none cursor-pointer shrink-0 p-0 transition-colors duration-150 disabled:cursor-not-allowed"
            style={{
              color:
                inputValue.trim() && !isStreaming && !isSessionComplete ? 'var(--primary)' : 'rgba(85,85,85,1)',
            }}
          >
            <Send style={{ width: 14, height: 14 }} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
