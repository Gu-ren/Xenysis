'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/transitions/page-transition'

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname} className="min-h-screen">
          {children}
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
