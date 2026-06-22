'use client'

import { useState } from 'react'
import { X, CheckCircle2, Calendar, Mail, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { joinWorkspaceWaitlist } from '../services/waitlist'
import type { WaitlistEntry } from '../services/waitlist'

interface WaitlistModalProps {
  isOpen:       boolean
  onClose:      () => void
  userEmail?:   string
  startupId?:   string | null
  blueprintId?: string | null
}

type ModalState = 'idle' | 'loading' | 'success' | 'error'

const FEATURES = [
  'Product Requirements',
  'Technical Architecture',
  'Database Design',
  'API Specifications',
  'UI Generation',
  'Interactive Product Preview',
  'Deployment Assets',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

export function WaitlistModal({ isOpen, onClose, userEmail, startupId, blueprintId }: WaitlistModalProps) {
  const [state, setState]   = useState<ModalState>('idle')
  const [entry, setEntry]   = useState<WaitlistEntry | null>(null)
  const [error, setError]   = useState<string | null>(null)

  const handleClose = () => {
    onClose()
    // Reset after exit animation
    setTimeout(() => {
      setState('idle')
      setEntry(null)
      setError(null)
    }, 300)
  }

  const handleJoin = async () => {
    if (!startupId || state === 'loading') return
    setState('loading')
    setError(null)

    try {
      const result = await joinWorkspaceWaitlist({
        startupId,
        blueprintId: blueprintId ?? undefined,
      })
      setEntry(result)
      setState('success')
    } catch {
      setError('Something went wrong. Please try again.')
      setState('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              {state === 'success' && entry ? (
                <SuccessView entry={entry} userEmail={userEmail} onClose={handleClose} />
              ) : (
                <RegisterView
                  userEmail={userEmail}
                  state={state}
                  error={error}
                  onClose={handleClose}
                  onJoin={handleJoin}
                  hasStartupId={Boolean(startupId)}
                />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Register view ─────────────────────────────────────────────────────────────

interface RegisterViewProps {
  userEmail?:     string
  state:          ModalState
  error:          string | null
  hasStartupId:   boolean
  onClose:        () => void
  onJoin:         () => void
}

function RegisterView({ userEmail, state, error, hasStartupId, onClose, onJoin }: RegisterViewProps) {
  const isLoading = state === 'loading'

  return (
    <>
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

      <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">
        Workspace Generation
      </h2>
      <p className="text-[13px] text-zinc-400 leading-relaxed mb-6">
        You have completed your Startup Blueprint. Workspace Generation transforms your
        blueprint into a working product. Generate requirements, architecture, UI, code,
        previews, and deployment-ready assets from a single startup blueprint.
      </p>

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

      {error && (
        <p className="text-[12px] text-red-400 mb-3">{error}</p>
      )}

      <button
        onClick={onJoin}
        disabled={isLoading || !hasStartupId}
        className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-[14px] font-bold transition-colors mb-3 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-[14px] h-[14px] border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Joining…
          </>
        ) : (
          'Join Early Access'
        )}
      </button>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="w-full text-center text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-50"
      >
        Maybe Later
      </button>
    </>
  )
}

// ── Success view ──────────────────────────────────────────────────────────────

interface SuccessViewProps {
  entry:       WaitlistEntry
  userEmail?:  string
  onClose:     () => void
}

function SuccessView({ entry, userEmail, onClose }: SuccessViewProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Confirmed
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">
          You&apos;re on the list
        </h2>
        <p className="text-[13px] text-zinc-400 leading-relaxed mb-6">
          We&apos;ll notify you when Workspace Generation becomes available for your startup.
        </p>

        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl divide-y divide-white/[0.05]">
          <div className="flex items-center gap-3 p-4">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 mb-0.5">Startup</p>
              <p className="text-[14px] font-semibold text-white truncate">{entry.startupName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 mb-0.5">Notification sent to</p>
              <p className="text-[13px] text-zinc-300 truncate">{entry.email || userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600 mb-0.5">Joined</p>
              <p className="text-[13px] text-zinc-300">{formatDate(entry.joinedAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-5">
        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl border border-white/[0.08] hover:border-white/[0.14] text-zinc-300 text-[14px] font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </>
  )
}
