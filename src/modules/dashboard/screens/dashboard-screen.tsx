"use client"

import { useStartups } from "@/modules/projects/hooks/use-startups"
import { QuickActions } from "../components/quick-actions"
import { PortfolioHealth } from "../components/portfolio-health"
import { RecentActivity } from "../components/recent-activity"
import { StartupSummary } from "../components/startup-summary"
import type { ActivityItem } from "@/types"

// BACKEND: replace with apiGet<ActivityItem[]>('/activity?limit=10')
const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act_01",
    type: "deployed",
    description: "NovaCRM deployed to production",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_02",
    type: "generated",
    description: "Pulse Analytics workspace generated",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_03",
    type: "session",
    description: "Founder Session completed for Pulse Analytics",
    timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
  },
]

export function DashboardScreen() {
  const { startups } = useStartups()

  return (
    <div className="px-8 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
          Dashboard
        </h1>
        <p className="text-[11px] font-mono text-muted">
          Overview of your startup portfolio
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — 2/3 width */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <StartupSummary startups={startups} />
          <PortfolioHealth startups={startups} />
        </div>

        {/* Right column — 1/3 width */}
        <div className="flex flex-col gap-5">
          <QuickActions />
          <RecentActivity items={MOCK_ACTIVITY} />
        </div>
      </div>
    </div>
  )
}
