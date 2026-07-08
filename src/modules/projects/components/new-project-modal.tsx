'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Briefcase, X } from 'lucide-react'
import { useFounderSessionStore } from '@/store/founder-session'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

const PROJECT_TYPES = [
  {
    id: 'founder',
    icon: Lightbulb,
    title: 'Founder Session',
    description:
      'For early-stage founders building a new startup. Discover your customer, validate your problem, and generate a build-ready blueprint.',
    label: 'For founders & entrepreneurs',
    href: '/founder-session',
  },
  {
    id: 'business',
    icon: Briefcase,
    title: 'Business Session',
    description:
      'For established businesses exploring a new product or vertical. Map your market, define your offer, and structure your go-to-market.',
    label: 'For teams & operators',
    href: '/founder-session',
  },
]

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const router = useRouter()
  const reset = useFounderSessionStore((s) => s.reset)

  const handleSelect = (href: string) => {
    onClose()
    reset()
    router.push(`${href}?fresh=true`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="w-full max-w-[540px] rounded-2xl p-6 pointer-events-auto"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2
                    className="text-[18px] font-semibold tracking-[-0.03em]"
                    style={{ color: '#F5F5F5' }}
                  >
                    Start a new project
                  </h2>
                  <p className="text-[13px] mt-0.5" style={{ color: '#666666' }}>
                    Choose the type that fits your goal.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#666666' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F5F5F5'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#666666'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Type cards */}
              <div className="grid grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelect(type.href)}
                      className="group text-left rounded-[12px] p-4 transition-all duration-150"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.background = 'rgba(79,250,176,0.05)'
                        el.style.border = '1px solid rgba(79,250,176,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.background = 'rgba(255,255,255,0.03)'
                        el.style.border = '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                        style={{
                          background: 'rgba(79,250,176,0.08)',
                          border: '1px solid rgba(79,250,176,0.15)',
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: '#4FFAB0' }} strokeWidth={1.5} />
                      </div>
                      <p
                        className="text-[14px] font-semibold tracking-[-0.02em] mb-1"
                        style={{ color: '#F5F5F5' }}
                      >
                        {type.title}
                      </p>
                      <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#666666' }}>
                        {type.description}
                      </p>
                      <span
                        className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(79,250,176,0.08)',
                          border: '1px solid rgba(79,250,176,0.15)',
                          color: '#4FFAB0',
                        }}
                      >
                        {type.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
