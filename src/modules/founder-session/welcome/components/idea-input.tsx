'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface IdeaInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  submitted: boolean
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

export function IdeaInput({
  value,
  onChange,
  onSubmit,
  submitted,
  textareaRef,
}: IdeaInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Textarea with animated focus border */}
      <div
        className="relative rounded-[10px] p-px transition-colors duration-[250ms]"
        style={{
          background: isFocused ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
        }}
      >
        <textarea
          ref={textareaRef}
          rows={2}
          placeholder="e.g. An AI tool that helps founders build faster than a traditional dev team"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="block w-full bg-card rounded-[9px] px-[22px] py-5 text-[15px] text-foreground leading-[1.65] resize-none outline-none placeholder:text-muted/50 tracking-[-0.01em]"
          style={{ caretColor: 'var(--primary)' }}
        />
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.985 }}
        onClick={onSubmit}
        disabled={submitted}
        className="w-full flex items-center justify-center gap-[9px] px-6 py-[15px] bg-primary text-background font-semibold text-[15px] tracking-[-0.015em] rounded-[9px] border-none cursor-pointer transition-opacity duration-200 disabled:opacity-65 disabled:cursor-default"
      >
        <span>{submitted ? 'Thinking…' : 'Let Xenysis think'}</span>
        {!submitted && <ArrowRight className="w-4 h-4 shrink-0" />}
      </motion.button>
    </div>
  )
}
