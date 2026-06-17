'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
}

const FEATURES = [
  'Product Requirements',
  'Technical Architecture',
  'Database and APIs',
  'UI Generation',
  'Frontend and Backend Code',
  'Interactive Preview',
  'Deployment Preparation',
]

export function WaitlistModal({ isOpen, onClose, userEmail }: WaitlistModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-[460px] bg-[#111111] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
            >
              {/* Top row: badge + close */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Early Access
                </span>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title + description */}
              <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">
                Workspace Generation
              </h2>
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-6">
                You have completed your Startup Blueprint. Workspace Generation transforms your
                blueprint into a working product. Generate requirements, architecture, UI, code,
                previews, and deployment-ready assets from a single startup blueprint.
              </p>

              {/* What you will get */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-3">
                What you will get
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[13px] text-white font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Email card */}
              <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4 mb-4">
                <p className="text-[13px] font-semibold text-white mb-1">Join Early Access</p>
                <p className="text-[12px] text-zinc-500 leading-relaxed mb-3">
                  Workspace Generation is currently in development. We will notify you when early
                  access becomes available.
                </p>
                {userEmail ? (
                  <>
                    <p className="text-[15px] font-medium text-white mb-1">{userEmail}</p>
                    <p className="text-[11px] text-zinc-600">
                      You are already on Xenysis. No additional signup required.
                    </p>
                  </>
                ) : (
                  <input
                    type="email"
                    placeholder="you@startup.com"
                    className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                )}
              </div>

              {/* CTA */}
              <button className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-[14px] font-bold transition-colors mb-3">
                Join Early Access
              </button>
              <button
                onClick={onClose}
                className="w-full text-center text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Maybe Later
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
