'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useFounderSessionStore } from '@/store/founder-session'
import { BlueprintCard } from './components/blueprint-card'

export function SummaryStep() {
  const router = useRouter()
  const { idea, blueprint } = useFounderSessionStore()

  useEffect(() => {
    if (!blueprint) router.replace('/founder-session')
  }, [blueprint, router])

  if (!blueprint) return null

  const handleGenerate = () => {
    router.push('/generating')
  }

  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden px-6 py-16">
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
          background:
            'radial-gradient(ellipse at center, rgba(79,250,176,0.06) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      />

      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center gap-8">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <div
            className="w-7 h-7 flex items-center justify-center shrink-0"
          >
            <Image src="/logo.svg" alt="Xenysis" width={28} height={28} className="rounded-sm" />
          </div>
          <span className="text-[16px] font-bold text-foreground tracking-[-0.025em]">
            Xenysis
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center flex flex-col gap-2"
        >
          <h1 className="text-[28px] font-medium text-foreground tracking-[-0.035em] leading-[1.2] m-0">
            Here&apos;s what we&apos;re building
          </h1>
          {idea && (
            <p className="text-[14px] text-muted tracking-[-0.01em] leading-relaxed m-0">
              &quot;{idea}&quot;
            </p>
          )}
        </motion.div>

        {/* Blueprint card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <BlueprintCard blueprint={blueprint} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center gap-3"
        >
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 px-6 py-[15px] bg-primary text-background font-semibold text-[15px] tracking-[-0.015em] rounded-[9px] border-none cursor-pointer hover:bg-primary-hover transition-colors"
          >
            Generate Startup
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <p
            className="text-[12px] font-mono tracking-[0.01em] text-center m-0"
            style={{ color: 'rgba(250,250,250,0.30)' }}
          >
            This will create your complete startup workspace.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
