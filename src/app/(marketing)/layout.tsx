'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { MarketingNav } from '@/components/layout/marketing-nav'
import { PageTransition } from '@/components/transitions/page-transition'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
