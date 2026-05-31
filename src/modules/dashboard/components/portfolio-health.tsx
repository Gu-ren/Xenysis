import { cn } from "@/lib/utils"
import type { StartupWithHealth } from "@/modules/projects/types"

interface PortfolioHealthProps {
  startups: StartupWithHealth[]
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-primary"
  if (score >= 50) return "bg-amber-400"
  return "bg-danger"
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Healthy"
  if (score >= 50) return "Fair"
  return "Critical"
}

export function PortfolioHealth({ startups }: PortfolioHealthProps) {
  const avgScore =
    startups.length > 0
      ? Math.round(
          startups.reduce((sum, s) => sum + s.health.score, 0) / startups.length
        )
      : 0

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Portfolio Health
      </h2>

      {startups.length === 0 ? (
        <p className="text-sm text-muted">No startups to analyze.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Aggregate score */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted">Avg health score</span>
            <span className="text-sm font-semibold text-foreground">
              {avgScore}
              <span className="text-xs text-muted font-normal"> / 100</span>
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", scoreColor(avgScore))}
              style={{ width: `${avgScore}%` }}
            />
          </div>

          {/* Per-startup dots */}
          <div className="flex flex-col gap-2.5 pt-1">
            {startups.map((startup) => (
              <div
                key={startup.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      scoreColor(startup.health.score)
                    )}
                  />
                  <span className="text-xs text-muted truncate">
                    {startup.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted shrink-0 ml-3">
                  {scoreLabel(startup.health.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
