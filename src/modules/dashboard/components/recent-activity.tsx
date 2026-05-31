import type { ActivityItem } from "@/types"

interface RecentActivityProps {
  items: ActivityItem[]
}

const TYPE_LABEL: Record<string, string> = {
  session: "Session",
  generated: "Generated",
  deployed: "Deployed",
  build: "Build",
  preview: "Preview",
}

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Recent Activity
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted">No activity yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground leading-snug">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-muted">
                    {TYPE_LABEL[item.type] ?? item.type}
                  </span>
                  <span className="text-border select-none">·</span>
                  <span className="text-[10px] font-mono text-muted">
                    {relativeTime(item.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
