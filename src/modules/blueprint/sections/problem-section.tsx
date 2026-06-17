import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { PAIN_POINTS, ALTERNATIVES } from '../constants'

export function ProblemSection() {
  return (
    <section id="problem">
      <SectionHeading number="02" title="Problem" />

      <p className="text-[26px] font-light text-white italic leading-snug mb-10">
        &ldquo;Startup operations teams lose 40% of productive time to manual coordination and tool
        fragmentation.&rdquo;
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <FieldLabel>Pain Points</FieldLabel>
          <div className="space-y-3">
            {PAIN_POINTS.map((point) => (
              <div key={point} className="pl-4 border-l border-emerald-500/30 py-0.5">
                <p className="text-sm text-zinc-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <FieldLabel>Current Alternatives</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {ALTERNATIVES.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400"
              >
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <FieldLabel>Why Existing Solutions Fail</FieldLabel>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Existing tools were designed for project management, not operational intelligence. They
              require heavy manual input and lack the AI layer needed to adapt to startup pace.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
