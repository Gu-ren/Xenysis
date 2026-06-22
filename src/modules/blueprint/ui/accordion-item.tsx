'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  title: string
  items: string[]
  defaultOpen?: boolean
}

export function AccordionItem({ title, items, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/[0.05] last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 flex items-center justify-between text-left transition-colors px-1 group"
      >
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200',
          )}
        >
          {title}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1 space-y-2 pl-1">
              {items.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-zinc-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600/60 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
