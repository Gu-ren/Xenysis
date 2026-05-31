import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StartupWithHealth } from "../types"

interface StartupStatsBarProps {
  startups: StartupWithHealth[]
}

function portfolioSignal(startups: StartupWithHealth[]): {
  label: string
  dotClass: string
} {
  if (startups.length === 0) {
    return { label: "No startups yet", dotClass: "bg-border" }
  }
  const avg =
    startups.reduce((sum, s) => sum + s.health.score, 0) / startups.length
  if (avg >= 80) return { label: "Portfolio healthy", dotClass: "bg-primary shadow-[0_0_6px_rgba(79,250,176,0.4)]" }
  if (avg >= 50) return { label: "Needs attention", dotClass: "bg-amber-400" }
  return { label: "Action required", dotClass: "bg-danger" }
}

export function StartupStatsBar({ startups }: StartupStatsBarProps) {
  const total = startups.length
  const live = startups.filter((s) => s.lifecycleStage === "deployed").length
  const building = startups.filter((s) =>
    (["generating", "preview", "build"] as const).includes(s.lifecycleStage as "generating" | "preview" | "build")
  ).length

  const totalAssets = startups.reduce((sum, s) => sum + s.health.assetCount, 0)
  const activeWorkflows = startups.reduce(
    (sum, s) => sum + s.health.workflowsActive,
    0
  )

  const signal = portfolioSignal(startups)

  const stats = [
    { label: "total", value: String(total) },
    { label: "live", value: String(live) },
    { label: "building", value: String(building) },
    { label: "assets", value: String(totalAssets) },
    { label: "workflows", value: String(activeWorkflows) },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-foreground tracking-tight">
            {stat.value}
          </span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
            {stat.label}
          </span>
        </div>
      ))}

      <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <Activity size={12} strokeWidth={1.75} className="text-primary shrink-0" />
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            signal.dotClass
          )}
        />
        <span className="text-[10px] font-mono text-muted">
          {signal.label}
        </span>
      </div>
    </div>
  )
}
