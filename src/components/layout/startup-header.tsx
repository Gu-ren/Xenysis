"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Bell, ArrowLeft } from "lucide-react"
import { useAuth } from "@/services/auth/use-auth"

const SECTION_LABELS: Record<string, string> = {
  workspace:        "Workspace",
  "command-center": "Command Center",
  deploy:           "Deploy",
  logs:             "Logs",
  settings:         "Settings",
}

function formatStartupName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function getCurrentSection(pathname: string, startupId: string): string | null {
  const prefix = `/startup/${startupId}/`
  if (!pathname.startsWith(prefix)) return null
  const segment = pathname.slice(prefix.length).split("/")[0] ?? ""
  return SECTION_LABELS[segment] ?? null
}

export function StartupHeader() {
  const pathname  = usePathname()
  const params    = useParams()
  const startupId = params.startupId as string
  const { user }  = useAuth()
  const initials  = user?.email?.[0]?.toUpperCase() ?? 'G'

  // Derives a readable name from the URL slug until the startup name is fetched from the API.
  // BACKEND: replace formatStartupName(startupId) with useStartup(startupId).name
  const startupName    = formatStartupName(startupId)
  const currentSection = getCurrentSection(pathname, startupId)

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-border bg-background shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {/* Back to Projects */}
        <Link
          href="/projects"
          className="flex items-center gap-1 text-muted hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft size={12} strokeWidth={2} />
          <span>Projects</span>
        </Link>

        <span className="text-border select-none shrink-0">/</span>

        {/* Startup identity */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center justify-center w-5 h-5 rounded-[5px] bg-primary/15 border border-primary/25 shrink-0">
            <span className="text-primary text-[10px] font-bold select-none">
              {startupName.charAt(0)}
            </span>
          </div>
          <Link
            href={`/startup/${startupId}`}
            className="text-muted hover:text-foreground transition-colors truncate max-w-[160px]"
          >
            {startupName}
          </Link>
        </div>

        {/* Current section */}
        {currentSection && (
          <>
            <span className="text-border select-none shrink-0">/</span>
            <span className="text-foreground font-medium truncate">{currentSection}</span>
          </>
        )}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notifications */}
        <button className="flex items-center justify-center w-8 h-8 rounded-[10px] text-muted hover:text-foreground hover:bg-card transition-colors">
          <Bell size={15} strokeWidth={1.75} />
        </button>

        {/* User menu */}
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-card border border-border text-xs font-semibold text-foreground hover:border-primary/50 transition-colors ml-1 shrink-0">
          {initials}
        </button>
      </div>
    </header>
  )
}
