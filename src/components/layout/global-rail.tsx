"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  FolderOpen,
  CreditCard,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function GlobalRail() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col items-center w-14 h-screen border-r border-border bg-background shrink-0 py-3 gap-1">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center justify-center w-9 h-9 mb-3 shrink-0">
        <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
      </Link>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-0.5 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Startups are children of the projects context — keep Projects lit on all startup routes
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
              title={label}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-[10px] transition-colors",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(79,250,176,0.2)]"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              <Icon size={17} strokeWidth={1.75} />
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
