import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField, EditableList } from '../ui/editable-field'
import type { BlueprintSolution } from '../types/blueprint-api'

interface SolutionSectionProps {
  solution: BlueprintSolution
  percentage?: number
  editable?: boolean
  onChange?: (solution: BlueprintSolution) => void
}

export function SolutionSection({
  solution,
  percentage,
  editable = false,
  onChange,
}: SolutionSectionProps) {
  const patch = (partial: Partial<BlueprintSolution>) => onChange?.({ ...solution, ...partial })

  return (
    <section id="solution">
      <SectionHeading number="04" title="Solution" percentage={percentage} />

      <EditableField
        value={solution.description}
        editable={editable}
        multiline
        onChange={(description) => patch({ description })}
        className="mb-10"
        valueClassName="text-2xl font-bold text-white tracking-tight leading-tight whitespace-pre-wrap"
      />

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {editable ? (
            <EditableList
              label="Core Capabilities"
              items={solution.coreCapabilities}
              editable
              onChange={(coreCapabilities) => patch({ coreCapabilities })}
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="space-y-7">
          {editable ? (
            <>
              <EditableList
                label="Key Differentiators"
                items={solution.differentiators}
                editable
                onChange={(differentiators) => patch({ differentiators })}
              />
              <EditableField
                label="Unfair Advantage"
                value={solution.unfairAdvantage ?? ''}
                editable
                multiline
                onChange={(unfairAdvantage) => patch({ unfairAdvantage: unfairAdvantage || null })}
              />
              <EditableField
                label="Technology Approach"
                value={solution.technologyApproach ?? ''}
                editable
                multiline
                onChange={(technologyApproach) =>
                  patch({ technologyApproach: technologyApproach || null })
                }
              />
            </>
          ) : (
            <>
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
                  <FieldLabel>
                    {solution.unfairAdvantage ? 'Unfair Advantage' : 'Technology Approach'}
                  </FieldLabel>
                  <p className="text-sm text-zinc-500 leading-relaxed italic mt-1">
                    &ldquo;{solution.unfairAdvantage ?? solution.technologyApproach}&rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
