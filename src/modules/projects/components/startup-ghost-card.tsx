"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export function StartupGhostCard() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/founder-session")}
      className="group flex flex-col items-center justify-center gap-2.5 w-full min-h-[208px] rounded-xl border border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-200">
        <Plus
          size={15}
          strokeWidth={2}
          className="text-muted group-hover:text-primary transition-colors duration-200"
        />
      </div>
      <span className="text-sm font-medium text-muted group-hover:text-foreground transition-colors duration-200">
        New Startup
      </span>
    </button>
  )
}
