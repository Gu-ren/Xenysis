import { cn } from "@/lib/utils"
import type { StartupLifecycleStage } from "@/types"

interface LifecycleStageBadgeProps {
  stage: StartupLifecycleStage
  className?: string
}

const STAGE_CONFIG: Record<
  StartupLifecycleStage,
  { label: string; className: string }
> = {
  "founder-session": {
    label: "Session",
    className: "text-muted border-border bg-card",
  },
  generating: {
    label: "Generating",
    className: "text-amber-400 border-amber-400/25 bg-amber-400/8",
  },
  preview: {
    label: "Preview",
    className: "text-blue-400 border-blue-400/25 bg-blue-400/8",
  },
  build: {
    label: "Build",
    className: "text-orange-400 border-orange-400/25 bg-orange-400/8",
  },
  deployed: {
    label: "Live",
    className: "text-primary border-primary/25 bg-primary/8",
  },
}

export function LifecycleStageBadge({
  stage,
  className,
}: LifecycleStageBadgeProps) {
  const config = STAGE_CONFIG[stage]
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-medium uppercase tracking-widest border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
