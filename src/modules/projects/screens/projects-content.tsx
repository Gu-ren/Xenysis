"use client"

import { motion } from "framer-motion"
import { StartupGrid } from "../components/startup-grid"
import { StartupStatsBar } from "../components/startup-stats-bar"
import type { StartupWithHealth } from "../types"

interface ProjectsContentProps {
  startups: StartupWithHealth[]
  count: number
}

const ease = [0.22, 1, 0.36, 1] as const

export function ProjectsContent({ startups, count }: ProjectsContentProps) {
  return (
    <div className="px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="mb-8"
      >
        <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
          Startups
        </h1>
        <p className="text-[11px] font-mono text-muted">
          {count === 0
            ? "No startups yet — build your first one"
            : `${count} startup${count !== 1 ? "s" : ""} generated`}
        </p>
      </motion.div>

      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.05 }}
          className="mb-8"
        >
          <StartupStatsBar startups={startups} />
        </motion.div>
      )}

      <div className="h-px bg-border mb-8" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease, delay: 0.1 }}
      >
        <StartupGrid startups={startups} />
      </motion.div>
    </div>
  )
}
