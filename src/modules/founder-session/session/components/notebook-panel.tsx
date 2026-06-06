'use client'

import { motion } from 'framer-motion'

const WORKFLOW_STEPS = ['Lead', 'Assignment', 'Follow-Up', 'Property Viewing', 'Deal Closing']

interface NoteCard {
  id: string
  type: string
  bullets: string[]
  source: string
  timestamp: string
  variant: 'bullets' | 'flow'
}

const NOTEBOOK_CARDS: NoteCard[] = [
  {
    id: 'nb1',
    type: 'CUSTOMER INSIGHT',
    bullets: [
      'Independent brokerages',
      '5–30 agents',
      'Spreadsheet-heavy operations',
      'Broker-owner makes purchase decision',
    ],
    source: 'Captured from Customer Discovery',
    timestamp: '2 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb2',
    type: 'REVENUE SIGNAL',
    bullets: [
      'Prefers recurring revenue',
      'Team-based pricing model',
      'Subscription over transaction fees',
    ],
    source: 'Captured from Pricing Discussion',
    timestamp: '4 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb3',
    type: 'WORKFLOW DISCOVERY',
    bullets: [],
    source: 'Captured from Workflow Mapping',
    timestamp: '7 min ago',
    variant: 'flow',
  },
  {
    id: 'nb4',
    type: 'PROBLEM DISCOVERY',
    bullets: [
      'Leads fall through during follow-up',
      'Visibility drops after agent assignment',
      'Existing CRMs not purpose-built for RE',
    ],
    source: 'Captured from Pain Point Discussion',
    timestamp: '9 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb5',
    type: 'AUTOMATION OPPORTUNITY',
    bullets: [
      'Lead qualification before assignment',
      'Could reduce manual triage',
      'High-impact if validated',
    ],
    source: 'Captured from Workflow Discussion',
    timestamp: '11 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb6',
    type: 'MARKET OBSERVATION',
    bullets: [
      'PropTech — SMB segment',
      "Generic CRMs dominate but don't fit",
      'Underserved niche',
    ],
    source: 'Captured from Market Discussion',
    timestamp: '14 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb7',
    type: 'TEAM STRUCTURE',
    bullets: [
      'Multiple agents per workflow',
      'Shared visibility likely critical',
      'Collaboration across deal stages',
    ],
    source: 'Captured from Team Discussion',
    timestamp: '16 min ago',
    variant: 'bullets',
  },
  {
    id: 'nb8',
    type: 'FOUNDER ASSUMPTION',
    bullets: [
      'Team-level billing may unlock higher ACV',
      'Seat-based pricing may not fit this market',
    ],
    source: 'Captured from Pricing Discussion',
    timestamp: '18 min ago',
    variant: 'bullets',
  },
]

function NoteCard({ card, delay }: { card: NoteCard; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-xl py-[13px] px-[14px]"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Type label */}
      <span
        className="block font-mono uppercase mb-[9px]"
        style={{ fontSize: 9, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.30)' }}
      >
        {card.type}
      </span>

      {/* Content */}
      {card.variant === 'flow' ? (
        <div className="mb-[10px]">
          {WORKFLOW_STEPS.map((step, si) => (
            <div key={step} className="flex flex-col items-start">
              <span
                className="font-mono leading-[1.5]"
                style={{ fontSize: 12, letterSpacing: '-0.005em', color: 'rgba(255,255,255,0.78)' }}
              >
                {step}
              </span>
              {si < WORKFLOW_STEPS.length - 1 && (
                <span
                  className="font-mono leading-[1.3] ml-0.5"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}
                >
                  ↓
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ul className="m-0 p-0 list-none mb-[10px]">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-1.5 mb-1 last:mb-0">
              <span
                className="font-mono shrink-0 leading-[1.6]"
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}
              >
                •
              </span>
              <span
                className="leading-[1.6]"
                style={{
                  fontSize: 12,
                  letterSpacing: '-0.005em',
                  color: 'rgba(255,255,255,0.78)',
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Source + timestamp */}
      <div
        className="flex items-center justify-between mt-auto pt-1.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span
          className="italic"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.005em' }}
        >
          {card.source}
        </span>
        <span
          className="font-mono shrink-0 ml-2"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.01em' }}
        >
          {card.timestamp}
        </span>
      </div>
    </motion.div>
  )
}

export function NotebookPanel() {
  const leftCards = NOTEBOOK_CARDS.filter((_, i) => i % 2 === 0)
  const rightCards = NOTEBOOK_CARDS.filter((_, i) => i % 2 === 1)

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F0F0F' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          height: 44,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: '#111111',
        }}
      >
        <span className="text-foreground text-[13px] font-semibold tracking-[-0.015em]">
          What Xenysis Learned
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
          Notes captured live from our conversation.
        </span>
      </div>

      {/* Two-column masonry */}
      <div className="flex-1 overflow-y-auto px-[14px] pt-[14px] pb-6">
        <div className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-2">
            {leftCards.map((card, idx) => (
              <NoteCard key={card.id} card={card} delay={0.06 + idx * 0.07} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            {rightCards.map((card, idx) => (
              <NoteCard key={card.id} card={card} delay={0.10 + idx * 0.07} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
