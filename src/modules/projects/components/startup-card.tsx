"use client"

import { useRouter } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { LifecycleStageBadge } from "./lifecycle-stage-badge"
import type { StartupWithHealth } from "../types"

interface StartupCardProps {
  startup: StartupWithHealth
}

function DeploymentDot({
  status,
}: {
  status: StartupWithHealth["health"]["deploymentStatus"]
}) {
  const colorMap = {
    deployed: "bg-primary shadow-[0_0_6px_rgba(79,250,176,0.4)]",
    "in-progress": "bg-amber-400",
    "not-started": "bg-border",
    error: "bg-danger",
  }
  const labelMap = {
    deployed: "Deployed",
    "in-progress": "Building",
    "not-started": "Not started",
    error: "Error",
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colorMap[status]}`} />
      <span className="text-[10px] font-mono text-muted">{labelMap[status]}</span>
    </div>
  )
}

export function StartupCard({ startup }: StartupCardProps) {
  const router = useRouter()
  const { health, lifecycleStage } = startup
  const showProgress = lifecycleStage !== "deployed"

  return (
    <div
      onClick={() => router.push(`/startup/${startup.id}/workspace`)}
      className="group flex flex-col bg-card border border-border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-primary/25 hover:shadow-[0_0_0_1px_rgba(79,250,176,0.15)]"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-base font-semibold text-foreground tracking-tight truncate mr-3">
          {startup.name}
        </span>
        <LifecycleStageBadge stage={lifecycleStage} />
      </div>

      {/* Description */}
      <p className="text-sm text-muted leading-snug mb-4 line-clamp-2">
        {startup.description}
      </p>

      {/* Progress bar — hidden once deployed */}
      {showProgress && (
        <div className="mb-4">
          <div className="w-full h-[3px] rounded-full bg-background overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${health.generationProgress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-mono text-muted">
            {health.generationProgress}% Generated
          </p>
        </div>
      )}

      {/* Spacer when no progress bar */}
      {!showProgress && <div className="flex-1" />}

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/startup/${startup.id}/workspace`)
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-primary text-background text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ExternalLink size={11} strokeWidth={2.5} />
          Open Startup
        </button>
        <DeploymentDot status={health.deploymentStatus} />
      </div>
    </div>
  )
}
