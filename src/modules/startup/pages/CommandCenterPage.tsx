"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

const SYSTEM_SERVICES = [
  { label: "API Gateway", status: "operational" as const, latency: "42ms" },
  { label: "Database", status: "operational" as const, latency: "8ms" },
  { label: "AI Engine", status: "operational" as const, latency: "320ms" },
  { label: "Build Pipeline", status: "degraded" as const, latency: "—" },
  { label: "CDN", status: "operational" as const, latency: "12ms" },
]

const GENERATION_TASKS = [
  { label: "Architecture", count: 6, total: 6 },
  { label: "Database Schema", count: 4, total: 4 },
  { label: "Pages & UI", count: 8, total: 12 },
  { label: "API Workflows", count: 4, total: 6 },
  { label: "Deployment Config", count: 2, total: 2 },
]

const AI_ACTIVITY = [
  { action: "Generated 3 API route handlers for Orders module", time: "4m ago" },
  { action: "Completed database schema for Users module", time: "18m ago" },
  { action: "Scaffolded Dashboard page layout with mock data", time: "34m ago" },
  { action: "Optimized query logic for Billing service", time: "1h ago" },
  { action: "Created authentication middleware chain", time: "2h ago" },
]

function statusColor(status: "operational" | "degraded" | "down") {
  if (status === "operational") return "bg-primary"
  if (status === "degraded") return "bg-amber-400"
  return "bg-danger"
}

function statusTextColor(status: "operational" | "degraded" | "down") {
  if (status === "operational") return "text-primary"
  if (status === "degraded") return "text-amber-400"
  return "text-danger"
}

export default function CommandCenterPage() {
  const params = useParams()
  const startupId = params.startupId as string

  const totalAssets = GENERATION_TASKS.reduce((s, t) => s + t.total, 0)
  const builtAssets = GENERATION_TASKS.reduce((s, t) => s + t.count, 0)
  const overallPct = Math.round((builtAssets / totalAssets) * 100)

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">
          Command Center
        </h1>
        <p className="text-[11px] font-mono text-muted">
          Health dashboard, deployment status, and AI activity
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wide mb-2">
            Health Score
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-2xl font-bold text-foreground">87</span>
            <span className="text-xs text-muted mb-0.5">/ 100</span>
          </div>
          <div className="w-full h-1 rounded-full bg-background overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "87%" }} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wide mb-2">
            Assets Built
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-2xl font-bold text-foreground">{builtAssets}</span>
            <span className="text-xs text-muted mb-0.5">/ {totalAssets}</span>
          </div>
          <div className="w-full h-1 rounded-full bg-background overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wide mb-2">
            Build Status
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground">Passing</span>
          </div>
          <p className="text-[10px] font-mono text-muted mt-2">Last run 12m ago</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] font-mono text-muted uppercase tracking-wide mb-2">
            Deploy Readiness
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-2xl font-bold text-foreground">91</span>
            <span className="text-xs text-muted mb-0.5">%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-background overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "91%" }} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* System Status */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">System Status</h2>
            <div className="flex flex-col gap-3">
              {SYSTEM_SERVICES.map(({ label, status, latency }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusColor(status))} />
                    <span className="text-xs text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-mono text-muted">{latency}</span>
                    <span className={cn("text-[10px] font-mono capitalize w-20 text-right", statusTextColor(status))}>
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generation Progress */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Generation Progress</h2>
              <span className="text-[10px] font-mono text-muted">{overallPct}% complete</span>
            </div>
            <div className="flex flex-col gap-4">
              {GENERATION_TASKS.map(({ label, count, total }) => {
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-foreground">{label}</span>
                      <span className="text-[10px] font-mono text-muted">
                        {count} / {total}
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-background overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          pct === 100 ? "bg-primary" : "bg-primary/50"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right — 1/3 */}
        <div className="flex flex-col gap-5">
          {/* AI Activity */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">AI Activity</h2>
            <div className="flex flex-col gap-3">
              {AI_ACTIVITY.map(({ action, time }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground leading-snug">{action}</p>
                    <p className="text-[10px] font-mono text-muted mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link
                href={`/startup/${startupId}/deploy`}
                className="w-full text-center px-3 py-2 rounded-[10px] text-xs font-semibold bg-primary text-background hover:bg-[#44E5A9] transition-colors"
              >
                Deploy to Production
              </Link>
              <Link
                href={`/p/${startupId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-3 py-2 rounded-[10px] text-xs border border-border text-foreground hover:bg-background transition-colors"
              >
                Preview Build
              </Link>
              <Link
                href={`/startup/${startupId}/workspace`}
                className="w-full text-center px-3 py-2 rounded-[10px] text-xs border border-border text-foreground hover:bg-background transition-colors"
              >
                View Workspace
              </Link>
              <button className="w-full text-center px-3 py-2 rounded-[10px] text-xs border border-border text-foreground hover:bg-background transition-colors">
                Run Health Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
