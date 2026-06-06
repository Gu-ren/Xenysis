'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useFounderSessionStore } from '@/store/founder-session'

/**
 * Xenysis Onboarding - Step 1: Idea Validation
 * A refined, high-end onboarding experience for founders.
 */

interface ChipProps {
  label: string
  onClick: (val: string) => void
}

const ExampleChip = ({ label, onClick }: ChipProps) => {
  return (
    <button
      onClick={() => onClick(label)}
      className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-full px-[14px] py-[6px] text-[12.5px] font-sans text-[rgba(255,255,255,0.55)] transition-all duration-200 hover:border-[rgba(68,229,169,0.3)] hover:text-[rgba(255,255,255,0.85)] cursor-pointer"
    >
      {label}
    </button>
  )
}

export function WelcomeStep() {
  const [idea, setIdea] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
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

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  const handleChipClick = (val: string) => {
    setIdea(val)
  }

  const exampleChips = [
    'AI CRM for Real Estate',
    'Pet Sitter Marketplace',
    'Restaurant Inventory SaaS',
  ]

  return (
    <div
      className="relative min-h-screen w-full bg-[#0B0C0E] text-white flex flex-col font-sans overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-[5vh] pb-[10vh]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[720px] flex flex-col items-center text-center -mt-[8vh]"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8 flex gap-2">
          <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
      <span className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
        Xenysis
      </span>
            </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-[42px] md:text-[52px] font-medium leading-[1.1] tracking-[-0.035em] mb-4 text-white"
          >
            What are you building?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-[16px] text-[rgba(255,255,255,0.5)] leading-relaxed max-w-[560px] mb-8"
          >
            Tell Xenysis what you&apos;re building. We&apos;ll research the market, challenge
            assumptions, and help determine whether the opportunity is worth pursuing.
          </motion.p>

          {/* Input Section */}
          <motion.div variants={itemVariants} className="w-full space-y-4 mb-6">
            <div className="relative w-full group">
              <textarea
                ref={textareaRef}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="e.g. AI CRM for Real Estate Teams, Marketplace for Pet Sitters, SaaS for Restaurant Inventory..."
                className={cn(
                  'w-full min-h-[180px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[14px] p-6 text-[16px] text-[rgba(255,255,255,0.85)] placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[rgba(68,229,169,0.4)] focus:shadow-[0_0_0_3px_rgba(68,229,169,0.07)] transition-all duration-300 resize-none font-sans',
                )}
              />
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-3">
              {exampleChips.map((chip) => (
                <ExampleChip key={chip} label={chip} onClick={handleChipClick} />
              ))}
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center gap-4">
            <motion.button
              onClick={handleSubmit}
              disabled={submitted}
              whileHover={{
                scale: 1.01,
                backgroundColor: '#52f0b4',
              }}
              whileTap={{
                scale: 0.99,
              }}
              className="w-full h-[52px] bg-[#44E5A9] text-[#111111] font-sans font-semibold text-[15px] tracking-[-0.01em] rounded-full flex items-center justify-center cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Start Founder Session →
            </motion.button>
            <span className="font-mono text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-wide">
              Xenysis will build a business case before making a recommendation.
            </span>
          </motion.div>
        </motion.div>
      </main>

      {/* Progress Indicator */}
      <div className="fixed bottom-0 left-0 w-full h-[3px] bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full bg-[#44E5A9] relative transition-all duration-1000 ease-out"
          style={{
            width: '20%',
          }}
        >
          <div className="absolute top-0 right-0 h-full w-[40px] bg-gradient-to-l from-[#44E5A9] to-transparent opacity-50" />
        </div>
      </div>

    </div>
  )
}
