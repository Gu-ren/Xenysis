'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '../constants'
import type { PresencePeer } from '../types/blueprint-api'

interface NavSidebarProps {
  activeSection: string
  peers?: PresencePeer[]
}

export function NavSidebar({ activeSection, peers = [] }: NavSidebarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const peersBySection = peers.reduce<Record<string, PresencePeer[]>>((acc, peer) => {
    if (!peer.sectionId) return acc
    acc[peer.sectionId] = [...(acc[peer.sectionId] ?? []), peer]
    return acc
  }, {})

  return (
    <aside className="relative">
      <div className="sticky top-[73px] h-fit">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-700 uppercase mb-3 block px-2">
          Sections
        </span>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const sectionPeers = peersBySection[item.id] ?? []
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-[13px] transition-colors relative rounded-md',
                  activeSection === item.id
                    ? 'text-white font-medium'
                    : 'text-zinc-500 hover:text-zinc-300',
                  sectionPeers.length > 0 && 'bg-amber-500/[0.06]',
                )}
                title={
                  sectionPeers.length
                    ? `Also editing: ${sectionPeers.map((p) => p.displayName).join(', ')}`
                    : undefined
                }
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-emerald-500"
                  />
                )}
                <span className="flex items-center justify-between gap-2">
                  {item.label}
                  {sectionPeers.length > 0 && (
                    <span className="text-[9px] text-amber-400/90 truncate max-w-[72px]">
                      {sectionPeers[0].displayName}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="mt-16 pt-6 border-t border-white/[0.05] px-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Xenysis" width={26} height={26} className="rounded-lg" />
            <span className="text-[13px] font-semibold tracking-tight text-foreground/60">
              Xenysis AI
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
