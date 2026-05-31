'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { IdeaInput } from './components/idea-input'
import { useFounderSessionStore } from '@/store/founder-session'
import { HINT_DOT_DELAYS } from './constants'

export function WelcomeStep() {
  const [idea, setIdea] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const storeSetIdea = useFounderSessionStore((s) => s.setIdea)
  const setStep = useFounderSessionStore((s) => s.setStep)

  const handleSubmit = () => {
    if (!idea.trim()) {
      textareaRef.current?.focus()
      return
    }
    setSubmitted(true)
    storeSetIdea(idea.trim())
    setStep('session')
  }

  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(79,250,176,0.06) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative w-full max-w-[580px] px-6 flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-[9px] mb-[52px]"
        >
          <div
            className="w-[30px] h-[30px] flex items-center justify-center shrink-0"
          >
            <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" />
          </div>
          <span className="text-[18px] font-bold text-foreground tracking-[-0.025em]">
            Xenysis
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-9"
        >
          <h1 className="text-[clamp(36px,6vw,54px)] font-medium text-foreground tracking-[-0.04em] leading-[1.1] m-0 mb-3.5">
            What are you building?
          </h1>
          <p className="text-base text-muted tracking-[-0.01em] leading-relaxed m-0">
            Describe your startup idea.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <IdeaInput
            value={idea}
            onChange={setIdea}
            onSubmit={handleSubmit}
            submitted={submitted}
            textareaRef={textareaRef}
          />
        </motion.div>

        {/* Hint footer */}
        <AnimatePresence>
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 text-center flex flex-col items-center gap-2.5"
          >
            <div className="flex items-center gap-1.5">
              {HINT_DOT_DELAYS.map((delayMs) => (
                <motion.div
                  key={delayMs}
                  animate={{ opacity: [0.2, 0.85, 0.2] }}
                  transition={{
                    duration: 2.4,
                    delay: delayMs / 1000,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1 h-1 rounded-full"
                  style={{ background: 'rgba(79,250,176,0.7)' }}
                />
              ))}
            </div>

            <p
              className="text-[13px] tracking-[0.01em] leading-relaxed m-0"
              style={{ color: 'rgba(250,250,250,0.35)' }}
            >
              Xenysis will guide the discovery conversation. Then it builds.
            </p>

            <p
              className="text-[11px] font-mono m-0 tracking-[0.06em]"
              style={{ color: 'rgba(250,250,250,0.22)' }}
            >
              <span>⌘ + Enter</span>
              <span className="mx-1.5">·</span>
              <span>to submit</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
