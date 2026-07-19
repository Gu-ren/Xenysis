import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField, EditableList } from '../ui/editable-field'
import type { BlueprintProblem } from '../types/blueprint-api'

interface ProblemSectionProps {
  problem: BlueprintProblem
  percentage?: number
  editable?: boolean
  onChange?: (problem: BlueprintProblem) => void
}

export function ProblemSection({
  problem,
  percentage,
  editable = false,
  onChange,
}: ProblemSectionProps) {
  const patch = (partial: Partial<BlueprintProblem>) => onChange?.({ ...problem, ...partial })

  return (
    <section id="problem">
      <SectionHeading number="02" title="Problem" percentage={percentage} />

      <EditableField
        value={problem.statement}
        editable={editable}
        multiline
        onChange={(statement) => patch({ statement })}
        className="mb-10"
        valueClassName="text-[26px] font-light text-white italic leading-snug whitespace-pre-wrap"
      />

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          {editable ? (
            <EditableList
              label="Pain Points"
              items={problem.painPoints}
              editable
              onChange={(painPoints) => patch({ painPoints })}
            />
          ) : (
            <>
              <FieldLabel>Pain Points</FieldLabel>
              <div className="space-y-3">
                {problem.painPoints.map((point) => (
                  <div key={point} className="pl-4 border-l border-emerald-500/30 py-0.5">
                    <p className="text-sm text-zinc-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-5">
          {editable ? (
            <>
              <EditableList
                label="Current Alternatives"
                items={problem.currentAlternatives}
                editable
                onChange={(currentAlternatives) => patch({ currentAlternatives })}
              />
              <EditableField
                label="Why Now"
                value={problem.whyNow}
                editable
                multiline
                onChange={(whyNow) => patch({ whyNow })}
              />
            </>
          ) : (
            <>
              <FieldLabel>Current Alternatives</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {problem.currentAlternatives.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <FieldLabel>Why Now</FieldLabel>
                <p className="text-sm text-zinc-500 leading-relaxed">{problem.whyNow}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
