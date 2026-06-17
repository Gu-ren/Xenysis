import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { PERSONAS } from '../constants'

export function PersonasSection() {
  return (
    <section id="personas">
      <SectionHeading number="06" title="Personas" />

      <div className="grid lg:grid-cols-3 gap-4">
        {PERSONAS.map((persona) => (
          <GlassCard
            key={persona.name}
            className="flex flex-col h-full border-t border-t-emerald-500/25"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 text-sm shrink-0">
                {persona.initials}
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
                <p className="text-sm text-zinc-400 leading-relaxed">{persona.goals}</p>
              </div>
              <div>
                <FieldLabel>Frustrations</FieldLabel>
                <p className="text-sm text-zinc-400 leading-relaxed">{persona.frustrations}</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.05]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600/80 mb-1.5">
                Success Metric
              </p>
              <p className="text-xs text-zinc-500 italic leading-relaxed">
                {persona.successMetric}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
