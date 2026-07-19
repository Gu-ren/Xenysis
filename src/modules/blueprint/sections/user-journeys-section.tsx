import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { EditableField } from '../ui/editable-field'
import type { BlueprintUserJourneys } from '../types/blueprint-api'

interface UserJourneysSectionProps {
  userJourneys: BlueprintUserJourneys
  percentage?: number
  editable?: boolean
  onChange?: (userJourneys: BlueprintUserJourneys) => void
}

function JourneyStep({
  label,
  isLast = false,
  variant = 'default',
  editable = false,
  onChange,
}: {
  label: string
  isLast?: boolean
  variant?: 'active' | 'default'
  editable?: boolean
  onChange?: (value: string) => void
}) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center w-5">
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10',
            variant === 'active'
              ? 'bg-emerald-500 border-emerald-500 text-black'
              : 'bg-[#0a0a0a] border-white/[0.1] group-hover:border-emerald-500/40 transition-colors',
          )}
        >
          {variant === 'active' && <CheckCircle2 className="w-3.5 h-3.5" />}
        </div>
        {!isLast && (
          <div className="w-px h-10 bg-white/[0.06] group-hover:bg-emerald-500/15 transition-colors" />
        )}
      </div>
      <div className="pt-0.5 pb-1 flex-1 min-w-0">
        <EditableField
          value={label}
          editable={editable}
          onChange={onChange}
          valueClassName={cn(
            'text-sm font-medium',
            variant === 'active' ? 'text-emerald-500' : 'text-zinc-500',
          )}
        />
      </div>
    </div>
  )
}

export function UserJourneysSection({
  userJourneys,
  percentage,
  editable = false,
  onChange,
}: UserJourneysSectionProps) {
  const { journeys } = userJourneys

  return (
    <section id="user-journeys">
      <SectionHeading number="07" title="User Journeys" percentage={percentage} />

      <div className="grid gap-10 md:grid-cols-2">
        {journeys.map((journey, ji) => (
          <div key={ji}>
            <EditableField
              value={journey.personaName}
              editable={editable}
              onChange={(personaName) => {
                const next = [...journeys]
                next[ji] = { ...journey, personaName }
                onChange?.({ journeys: next })
              }}
              valueClassName="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            />
            <EditableField
              value={journey.scenario}
              editable={editable}
              multiline
              onChange={(scenario) => {
                const next = [...journeys]
                next[ji] = { ...journey, scenario }
                onChange?.({ journeys: next })
              }}
              className="mb-5"
              valueClassName="text-xs text-zinc-600 italic whitespace-pre-wrap"
            />
            <div className="mt-2">
              {journey.stages.map((stage, i) => (
                <JourneyStep
                  key={`${stage.stage}-${i}`}
                  label={stage.action}
                  isLast={i === journey.stages.length - 1}
                  variant={i === 0 ? 'active' : 'default'}
                  editable={editable}
                  onChange={(action) => {
                    const stages = [...journey.stages]
                    stages[i] = { ...stage, action }
                    const next = [...journeys]
                    next[ji] = { ...journey, stages }
                    onChange?.({ journeys: next })
                  }}
                />
              ))}
            </div>
            {(journey.keyInsight || editable) && (
              <EditableField
                value={journey.keyInsight}
                editable={editable}
                multiline
                onChange={(keyInsight) => {
                  const next = [...journeys]
                  next[ji] = { ...journey, keyInsight }
                  onChange?.({ journeys: next })
                }}
                className="mt-4 pl-9"
                valueClassName="text-xs text-zinc-600 italic leading-relaxed whitespace-pre-wrap"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
