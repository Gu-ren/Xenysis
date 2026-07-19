import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField, EditableList } from '../ui/editable-field'
import type { BlueprintPersonas } from '../types/blueprint-api'

interface PersonasSectionProps {
  personas: BlueprintPersonas
  percentage?: number
  editable?: boolean
  onChange?: (personas: BlueprintPersonas) => void
}

function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function PersonasSection({
  personas,
  percentage,
  editable = false,
  onChange,
}: PersonasSectionProps) {
  if (editable) {
    return (
      <section id="personas">
        <SectionHeading number="06" title="Personas" percentage={percentage} />
        <div className="space-y-6">
          {personas.personas.map((persona, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-white/[0.06]">
              <EditableField
                label="Name"
                value={persona.name}
                editable
                onChange={(name) => {
                  const next = [...personas.personas]
                  next[i] = { ...persona, name }
                  onChange?.({ personas: next })
                }}
              />
              <EditableField
                label="Role"
                value={persona.role}
                editable
                onChange={(role) => {
                  const next = [...personas.personas]
                  next[i] = { ...persona, role }
                  onChange?.({ personas: next })
                }}
              />
              <EditableList
                label="Goals"
                items={persona.goals}
                editable
                onChange={(goals) => {
                  const next = [...personas.personas]
                  next[i] = { ...persona, goals }
                  onChange?.({ personas: next })
                }}
              />
              <EditableList
                label="Frustrations"
                items={persona.frustrations}
                editable
                onChange={(frustrations) => {
                  const next = [...personas.personas]
                  next[i] = { ...persona, frustrations }
                  onChange?.({ personas: next })
                }}
              />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="personas">
      <SectionHeading number="06" title="Personas" percentage={percentage} />

      <div className="grid lg:grid-cols-3 gap-4">
        {personas.personas.map((persona) => (
          <GlassCard
            key={persona.name}
            className="flex flex-col h-full border-t border-t-emerald-500/25"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 text-sm shrink-0">
                {deriveInitials(persona.name)}
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">{persona.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600 mt-0.5">
                  {persona.role}
                </p>
              </div>
            </div>

            <div className="space-y-5 flex-grow">
              <div>
                <FieldLabel>Goals</FieldLabel>
                <ul className="space-y-1.5">
                  {persona.goals.map((goal) => (
                    <li key={goal} className="text-sm text-zinc-400 leading-relaxed">{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <FieldLabel>Frustrations</FieldLabel>
                <ul className="space-y-1.5">
                  {persona.frustrations.map((frustration) => (
                    <li key={frustration} className="text-sm text-zinc-400 leading-relaxed">{frustration}</li>
                  ))}
                </ul>
              </div>
            </div>

            {persona.behaviors.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/[0.05]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600/80 mb-1.5">
                  Key Behavior
                </p>
                <p className="text-xs text-zinc-500 italic leading-relaxed">
                  {persona.behaviors[0]}
                </p>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
