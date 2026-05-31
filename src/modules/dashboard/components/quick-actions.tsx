"use client"

import { useRouter } from "next/navigation"
import { Rocket, FolderOpen, Zap } from "lucide-react"

const ACTIONS = [
  {
    icon: Rocket,
    label: "New Startup",
    description: "Start a new Founder Session",
    href: "/founder-session",
    primary: true,
  },
  {
    icon: FolderOpen,
    label: "My Startups",
    description: "View all generated startups",
    href: "/projects",
    primary: false,
  },
  {
    icon: Zap,
    label: "Quick Deploy",
    description: "Deploy your latest startup",
    href: "/projects",
    primary: false,
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-colors ${
              action.primary
                ? "bg-primary/10 border border-primary/20 hover:bg-primary/15"
                : "hover:bg-background border border-transparent"
            }`}
          >
            <action.icon
              size={15}
              strokeWidth={1.75}
              className={action.primary ? "text-primary" : "text-muted"}
            />
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  action.primary ? "text-primary" : "text-foreground"
                }`}
              >
                {action.label}
              </p>
              <p className="text-xs text-muted truncate">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
