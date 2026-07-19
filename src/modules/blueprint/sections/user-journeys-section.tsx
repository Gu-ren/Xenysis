import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
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
  isFirst = false,
  isLast = false,
  variant = 'default',
}: {
  label: string
  isFirst?: boolean
  isLast?: boolean
  variant?: 'active' | 'default'
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
      <div className="pt-0.5 pb-1">
        <p
          className={cn(
            'text-sm font-medium',
            variant === 'active' ? 'text-emerald-500' : 'text-zinc-500',
          )}
        >
          {label}
        </p>
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

  if (editable) {
    return (
      <section id="user-journeys">
        <SectionHeading number="07" title="User Journeys" percentage={percentage} />
        <div className="space-y-6">
          {journeys.map((journey, ji) => (
            <div key={ji} className="space-y-3 p-4 rounded-xl border border-white/[0.06]">
              <EditableField
                label="Persona"
                value={journey.personaName}
                editable
                onChange={(personaName) => {
                  const next = [...journeys]
                  next[ji] = { ...journey, personaName }
                  onChange?.({ journeys: next })
                }}
              />
              <EditableField
                label="Scenario"
                value={journey.scenario}
                editable
                multiline
                onChange={(scenario) => {
                  const next = [...journeys]
                  next[ji] = { ...journey, scenario }
                  onChange?.({ journeys: next })
                }}
              />
              <EditableField
                label="Key insight"
                value={journey.keyInsight}
                editable
                multiline
                onChange={(keyInsight) => {
                  const next = [...journeys]
                  next[ji] = { ...journey, keyInsight }
                  onChange?.({ journeys: next })
                }}
              />
              {journey.stages.map((stage, si) => (
                <EditableField
                  key={si}
                  label={`Stage: ${stage.stage}`}
                  value={stage.action}
                  editable
                  onChange={(action) => {
                    const stages = [...journey.stages]
                    stages[si] = { ...stage, action }
                    const next = [...journeys]
                    next[ji] = { ...journey, stages }
                    onChange?.({ journeys: next })
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="user-journeys">
      <SectionHeading number="07" title="User Journeys" percentage={percentage} />

      <div className={cn('grid gap-10', journeys.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-2')}>
        {journeys.map((journey) => (
          <div key={journey.personaName}>
            <FieldLabel>{journey.personaName}</FieldLabel>
            <p className="text-xs text-zinc-600 mb-5 italic">{journey.scenario}</p>
            <div className="mt-2">
              {journey.stages.map((stage, i) => (
                <JourneyStep
                  key={stage.stage}
                  label={stage.action}
                  isFirst={i === 0}
                  isLast={i === journey.stages.length - 1}
                  variant={i === 0 ? 'active' : 'default'}
                />
              ))}
            </div>
            {journey.keyInsight && (
              <p className="text-xs text-zinc-600 italic mt-4 pl-9 leading-relaxed">
                Key insight: {journey.keyInsight}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
