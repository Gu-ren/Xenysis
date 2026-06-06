"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  FolderOpen,
  CreditCard,
  Settings,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/services/auth"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function GlobalRail() {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  async function handleLogout() {
    await signOut()
    router.replace("/signup")
  }

  return (
    <aside
      className={cn(
        "flex flex-col items-center h-screen border-r border-border bg-background shrink-0 py-3 gap-1 transition-[width] duration-200 ease-in-out overflow-hidden",
        expanded ? "w-48 items-stretch" : "w-14 items-center"
      )}
    >
      {/* Logo + toggle */}
      <div className={cn("flex items-center mb-3 shrink-0 px-2.5", expanded ? "justify-between w-full" : "justify-center")}>
        <Link href="/dashboard" className="flex items-center justify-center w-9 h-9">
          <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
        </Link>
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            title="Collapse sidebar"
            className="flex items-center justify-center w-7 h-7 rounded-[8px] text-muted hover:text-foreground hover:bg-card transition-colors"
          >
            <PanelLeftClose size={15} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Collapse toggle when closed */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          title="Expand sidebar"
          className="flex items-center justify-center w-9 h-9 rounded-[10px] text-muted hover:text-foreground hover:bg-card transition-colors mb-1"
        >
          <PanelLeftOpen size={17} strokeWidth={1.75} />
        </button>
      )}

      {/* Nav */}
      <nav className={cn("flex flex-col gap-0.5 flex-1", expanded ? "w-full px-2" : "items-center")}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/projects"
              ? pathname === href ||
                pathname.startsWith(href + "/") ||
                pathname.startsWith("/startup/")
              : pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              title={expanded ? undefined : label}
              className={cn(
                "flex items-center gap-2.5 rounded-[10px] transition-colors",
                expanded ? "px-2.5 py-2 w-full" : "justify-center w-9 h-9",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(79,250,176,0.2)]"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              <Icon size={17} strokeWidth={1.75} className="shrink-0" />
              {expanded && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className={cn(expanded ? "w-full px-2" : "")}>
        <button
          onClick={handleLogout}
          title="Log out"
          className={cn(
            "flex items-center gap-2.5 rounded-[10px] transition-colors text-muted hover:text-danger hover:bg-card",
            expanded ? "px-2.5 py-2 w-full" : "justify-center w-9 h-9"
          )}
        >
          <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
          {expanded && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  )
}
