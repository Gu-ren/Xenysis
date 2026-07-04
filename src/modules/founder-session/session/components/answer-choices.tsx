'use client'

import { motion } from 'framer-motion'
import type { AnswerChoice } from '@/modules/founder-session/utils/answer-choices'

interface AnswerChoicesProps {
  choices: AnswerChoice[]
  selectedChoice: string | null
  disabled: boolean
  onSelect: (choice: AnswerChoice) => void
}

export function AnswerChoices({
  choices,
  selectedChoice,
  disabled,
  onSelect,
}: AnswerChoicesProps) {
  if (choices.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-2">
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: '0.08em', color: 'rgba(85,85,85,1)' }}
      >
        Suggested answers — pick one to refine
      </span>
      <div className="flex flex-col gap-2">
        {choices.map((choice, idx) => {
          const isSelected = selectedChoice === choice.text
          return (
            <motion.button
              key={`${idx}-${choice.label}`}
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelect(choice)}
              disabled={disabled}
              className="text-left rounded-lg px-3.5 py-2.5 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{
                border: isSelected
                  ? '1px solid rgba(79,250,176,0.45)'
                  : '1px solid var(--border)',
                background: isSelected
                  ? 'rgba(79,250,176,0.08)'
                  : 'rgba(255,255,255,0.02)',
                outlineColor: 'var(--primary)',
              }}
            >
              <span
                className="block font-semibold tracking-[-0.01em] mb-1"
                style={{
                  fontSize: 13,
                  lineHeight: 1.4,
                  color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                }}
              >
                {choice.label}
              </span>
              <span
                className="block text-muted leading-relaxed"
                style={{ fontSize: 12, lineHeight: 1.55 }}
              >
                {choice.text}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
