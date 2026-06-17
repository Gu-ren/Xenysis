import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import type { BlueprintSolution } from '../types/blueprint-api'

interface SolutionSectionProps {
  solution: BlueprintSolution
}

export function SolutionSection({ solution }: SolutionSectionProps) {
  return (
    <section id="solution">
      <SectionHeading number="04" title="Solution" />

      <p className="text-2xl font-bold text-white mb-10 tracking-tight leading-tight">
        {solution.description}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <FieldLabel>Core Capabilities</FieldLabel>
          <div className="space-y-5">
            {solution.coreCapabilities.map((capability, i) => (
              <div key={capability} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500 font-semibold text-xs">
                  {i + 1}
                </span>
                <p className="text-sm text-zinc-300 pt-1 leading-relaxed">{capability}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <FieldLabel>Key Differentiators</FieldLabel>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {solution.differentiators.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {(solution.unfairAdvantage || solution.technologyApproach) && (
            <div>
              <FieldLabel>{solution.unfairAdvantage ? 'Unfair Advantage' : 'Technology Approach'}</FieldLabel>
              <p className="text-sm text-zinc-500 leading-relaxed italic mt-1">
                &ldquo;{solution.unfairAdvantage ?? solution.technologyApproach}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
