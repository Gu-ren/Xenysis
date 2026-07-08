'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { AppNav } from '@/components/layout/app-nav'
import { ProjectCard } from '../components/project-card'
import { useStartups } from '../hooks/use-startups'

// ── Skeleton ──────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div
      className="rounded-[12px] p-5 animate-pulse"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="h-4 rounded mb-3 w-3/4"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />
      <div
        className="h-3 rounded mb-1.5 w-full"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
      <div
        className="h-3 rounded mb-4 w-2/3"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
      <div className="flex items-center justify-between">
        <div
          className="h-5 w-16 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <div
          className="h-3 w-20 rounded"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(79,250,176,0.08)', border: '1px solid rgba(79,250,176,0.15)' }}
      >
        <Sparkles className="w-6 h-6" style={{ color: '#4FFAB0' }} strokeWidth={1.5} />
      </div>

      <h2
        className="text-[20px] font-semibold tracking-[-0.03em] mb-2"
        style={{ color: '#F5F5F5' }}
      >
        No projects yet
      </h2>
      <p className="text-[13px] leading-relaxed mb-8 max-w-[320px]" style={{ color: '#888888' }}>
        Start your first AI-powered startup discovery session to generate a complete blueprint.
      </p>

      <button
        onClick={onNew}
        className="flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-mono font-semibold transition-colors duration-150"
        style={{ background: '#4FFAB0', color: '#0A0A0A' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#44E5A9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#4FFAB0'
        }}
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Start your first project
      </button>
    </motion.div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ProjectsDashboard() {
  const router = useRouter()
  const { startups, loading, error } = useStartups()

  const handleNewProject = () => router.push('/founder-session')

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <AppNav />

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-[24px] font-semibold tracking-[-0.03em]"
              style={{ color: '#F5F5F5' }}
            >
              Your Projects
            </h1>
            {!loading && startups.length > 0 && (
              <p className="text-[13px] mt-1" style={{ color: '#888888' }}>
                {startups.length} project{startups.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {!loading && startups.length > 0 && (
            <button
              onClick={handleNewProject}
              className="flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-[13px] font-mono font-medium transition-colors duration-150"
              style={{
                background: 'rgba(79,250,176,0.1)',
                color: '#4FFAB0',
                border: '1px solid rgba(79,250,176,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(79,250,176,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(79,250,176,0.1)'
              }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              New Project
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div
            className="rounded-[8px] px-4 py-3 mb-6 text-[13px]"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#EF4444',
            }}
          >
            Failed to load projects. Please refresh the page.
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && startups.length === 0 && (
          <EmptyState onNew={handleNewProject} />
        )}

        {/* Project grid */}
        {!loading && startups.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {startups.map((startup) => (
              <motion.div key={startup.id} variants={cardVariants}>
                <ProjectCard startup={startup} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}
