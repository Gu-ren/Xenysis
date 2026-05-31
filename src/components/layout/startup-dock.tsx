"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Code2, Gauge, Rocket, Settings, Pin, PinOff } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { segment: "workspace",      icon: Code2,    label: "Workspace"      },
  { segment: "command-center", icon: Gauge,    label: "Command Center" },
  { segment: "deploy",         icon: Rocket,   label: "Deploy"         },
  { segment: "settings",       icon: Settings, label: "Settings"       },
]

export function StartupDock() {
  const pathname  = usePathname()
  const params    = useParams()
  const startupId = params.startupId as string

  const [isHovered, setIsHovered] = useState(false)
  const [isPinned,  setIsPinned]  = useState(false)
  const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isExpanded = isHovered || isPinned

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => setIsHovered(true), 150)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (!isPinned) {
      closeTimer.current = setTimeout(() => setIsHovered(false), 200)
    }
  }, [isPinned])

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      if (prev) setIsHovered(false)
      return !prev
    })
  }, [])

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-0.5 p-1.5 rounded-xl",
        "border border-border bg-card",
        "overflow-hidden",
      )}
      style={{
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        width: isExpanded ? 196 : 48,
        transition: "width 200ms ease-out",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0px rgba(79,250,176,0)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nav items */}
      {navItems.map(({ segment, icon: Icon, label }) => {
        const href     = `/startup/${startupId}/${segment}`
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={segment}
            href={href}
            className={cn(
              "flex items-center gap-2.5 h-9 px-2.5 rounded-[10px] transition-colors shrink-0",
              isActive
                ? "bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(79,250,176,0.2)]"
                : "text-muted hover:text-foreground hover:bg-background"
            )}
          >
            <Icon size={15} strokeWidth={1.75} className="shrink-0" />
            <span
              className="text-sm whitespace-nowrap select-none"
              style={{
                opacity:          isExpanded ? 1 : 0,
                transition:       "opacity 120ms ease-out",
                transitionDelay:  isExpanded ? "80ms" : "0ms",
                pointerEvents:    isExpanded ? "auto" : "none",
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}

      {/* Pin footer */}
      <div
        style={{
          maxHeight:  isExpanded ? 32 : 0,
          opacity:    isExpanded ? 1 : 0,
          overflow:   "hidden",
          transition: "max-height 200ms ease-out, opacity 150ms ease-out",
        }}
      >
        <div className="flex items-center gap-1 pt-1 pb-0.5 px-0.5">
          <div className="h-px bg-border flex-1 ml-1" />
          <button
            onClick={togglePin}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-[6px] transition-colors shrink-0",
              isPinned
                ? "text-primary bg-primary/10"
                : "text-muted hover:text-foreground hover:bg-background"
            )}
            title={isPinned ? "Unpin dock" : "Pin dock"}
          >
            {isPinned
              ? <PinOff size={11} strokeWidth={2} />
              : <Pin    size={11} strokeWidth={2} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
