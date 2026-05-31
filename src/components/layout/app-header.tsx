"use client"

import { useRouter } from "next/navigation"
import { Bell, Plus, Search, ArrowRight } from "lucide-react"

export function AppHeader() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 border-b border-border bg-background/95 backdrop-blur-md shrink-0">
      {/* Search */}
      <div className="flex-1 flex justify-center px-6 max-w-sm mx-auto">
        <div className="relative w-full">
          <Search
            size={12}
            strokeWidth={1.75}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search startups…"
            className="w-full bg-card border border-border rounded-[8px] pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Bell */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-[10px] text-muted hover:text-foreground hover:bg-card transition-colors"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold font-mono text-primary hover:border-primary/40 transition-colors ml-0.5"
          aria-label="User menu"
        >
          {/* TODO: derive from authenticated user */}
          G
        </button>

        {/* New Startup CTA */}
        <button
          onClick={() => router.push("/founder-session")}
          className="flex items-center gap-1.5 px-3 py-1.5 ml-1.5 rounded-[8px] bg-primary text-background text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
          <span>New Startup</span>
          <ArrowRight size={12} strokeWidth={2} className="opacity-70" />
        </button>
      </div>
    </header>
  )
}
