import type { StartupWithHealth } from "@/modules/projects/types"
import type { StartupLifecycleStage } from "@/types"

interface StartupSummaryProps {
  startups: StartupWithHealth[]
}

const STAGES: { stage: StartupLifecycleStage; label: string }[] = [
  { stage: "founder-session", label: "Session" },
  { stage: "generating", label: "Generating" },
  { stage: "preview", label: "Preview" },
  { stage: "build", label: "Build" },
  { stage: "deployed", label: "Deployed" },
]

export function StartupSummary({ startups }: StartupSummaryProps) {
  const countByStage = STAGES.map(({ stage, label }) => ({
    label,
    count: startups.filter((s) => s.lifecycleStage === stage).length,
  }))

  const totalAssets = startups.reduce((sum, s) => sum + s.health.assetCount, 0)
  const totalWorkflows = startups.reduce(
    (sum, s) => sum + s.health.workflowsActive,
    0
  )

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Startup Summary
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-foreground tracking-tight">
            {startups.length}
          </span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
            Total
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-foreground tracking-tight">
            {totalAssets}
          </span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
            Assets
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-foreground tracking-tight">
            {totalWorkflows}
          </span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
            Workflows
          </span>
        </div>
      </div>

      <div className="h-px bg-border mb-4" />

      <div className="flex flex-col gap-2">
        {countByStage.map(({ label, count }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-muted">{label}</span>
            <span className="text-xs font-mono text-foreground">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
