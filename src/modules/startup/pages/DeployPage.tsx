"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"

type Environment = "production" | "staging" | "development"
type DeployStatus = "success" | "failed" | "in_progress" | "queued"

const ENVIRONMENTS: { id: Environment; label: string }[] = [
  { id: "production", label: "Production" },
  { id: "staging", label: "Staging" },
  { id: "development", label: "Development" },
]

const ENV_CONFIG: Record<Environment, { branch: string; region: string; url: string }> = {
  production: { branch: "main", region: "us-east-1", url: "https://myapp.vercel.app" },
  staging: { branch: "staging", region: "us-east-1", url: "https://staging.myapp.vercel.app" },
  development: { branch: "dev", region: "us-west-2", url: "https://dev.myapp.vercel.app" },
}

const RELEASES: {
  id: string
  version: string
  status: DeployStatus
  time: string
  commit: string
  env: Environment
}[] = [
  { id: "r1", version: "v0.4.1", status: "success", time: "2h ago", commit: "a3f12b", env: "production" },
  { id: "r2", version: "v0.4.0", status: "success", time: "1d ago", commit: "9c8e22", env: "production" },
  { id: "r3", version: "v0.3.9", status: "failed", time: "2d ago", commit: "f01d44", env: "staging" },
  { id: "r4", version: "v0.3.8", status: "success", time: "3d ago", commit: "b7a903", env: "production" },
  { id: "r5", version: "v0.3.7", status: "success", time: "5d ago", commit: "cc219e", env: "staging" },
]

const ENV_VARS = [
  { key: "DATABASE_URL", value: "postgres://••••••••@db.host/prod" },
  { key: "NEXTAUTH_SECRET", value: "••••••••••••••••" },
  { key: "OPENAI_API_KEY", value: "sk-••••••••••••••••" },
  { key: "REDIS_URL", value: "redis://••••••••@cache.host:6379" },
]

function StatusIcon({ status }: { status: DeployStatus }) {
  if (status === "success")
    return <CheckCircle2 size={13} className="text-primary shrink-0" />
  if (status === "failed")
    return <XCircle size={13} className="text-danger shrink-0" />
  if (status === "in_progress")
    return <Loader2 size={13} className="text-amber-400 shrink-0 animate-spin" />
  return <Clock size={13} className="text-muted shrink-0" />
}

function statusLabel(status: DeployStatus): string {
  if (status === "success") return "Deployed"
  if (status === "failed") return "Failed"
  if (status === "in_progress") return "Deploying"
  return "Queued"
}

export default function DeployPage() {
  const [env, setEnv] = useState<Environment>("production")
  const [deploying, setDeploying] = useState(false)

  const config = ENV_CONFIG[env]

  function handleDeploy() {
    setDeploying(true)
    setTimeout(() => setDeploying(false), 3000)
  }

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-foreground tracking-tight mb-1">Deploy</h1>
        <p className="text-[11px] font-mono text-muted">
          Configure and release your startup to production
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Environment Selector */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Environment</h2>
            <div className="flex gap-2 mb-5">
              {ENVIRONMENTS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setEnv(id)}
                  className={cn(
                    "px-3 py-1.5 rounded-[8px] text-xs transition-colors border",
                    env === id
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "border-border text-muted hover:text-foreground hover:border-border"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Branch", value: config.branch },
                { label: "Region", value: config.region },
                { label: "Platform", value: "Vercel" },
                { label: "Build Command", value: "next build" },
                { label: "Output Dir", value: ".next" },
                { label: "URL", value: config.url },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-xs text-foreground font-mono truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Environment Variables</h2>
              <span className="text-[10px] font-mono text-muted">{ENV_VARS.length} vars</span>
            </div>
            <div className="flex flex-col gap-0 rounded-[10px] border border-border overflow-hidden">
              {ENV_VARS.map(({ key, value }, i) => (
                <div
                  key={key}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5",
                    i !== ENV_VARS.length - 1 && "border-b border-border"
                  )}
                >
                  <span className="text-xs font-mono text-foreground">{key}</span>
                  <span className="text-[11px] font-mono text-muted">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — 1/3 */}
        <div className="flex flex-col gap-5">
          {/* Deploy Action */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-1">Deploy Now</h2>
            <p className="text-[11px] text-muted mb-5">
              Push the latest build to{" "}
              <span className="text-foreground font-semibold capitalize">{env}</span>.
            </p>

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold transition-colors",
                deploying
                  ? "bg-primary/50 text-background cursor-not-allowed"
                  : "bg-primary text-background hover:bg-[#44E5A9]"
              )}
            >
              {deploying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deploying…
                </>
              ) : (
                "Deploy to " + env.charAt(0).toUpperCase() + env.slice(1)
              )}
            </button>

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted">Last deployed</span>
                <span className="text-[10px] font-mono text-foreground">2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted">Version</span>
                <span className="text-[10px] font-mono text-foreground">v0.4.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted">Status</span>
                <span className="text-[10px] font-mono text-primary">Live</span>
              </div>
            </div>
          </div>

          {/* Release History */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Release History</h2>
            <div className="flex flex-col gap-3">
              {RELEASES.map(({ id, version, status, time, commit, env: releaseEnv }) => (
                <div key={id} className="flex items-center gap-3">
                  <StatusIcon status={status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-foreground">{version}</span>
                      <span className="text-[10px] font-mono text-muted capitalize">
                        {releaseEnv}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted">{commit}</span>
                      <span className="text-border select-none">·</span>
                      <span className="text-[10px] font-mono text-muted">{time}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono shrink-0",
                      status === "success"
                        ? "text-primary"
                        : status === "failed"
                        ? "text-danger"
                        : "text-amber-400"
                    )}
                  >
                    {statusLabel(status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
