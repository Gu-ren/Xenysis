import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { SOLUTION_STEPS, DIFFERENTIATORS } from '../constants'

export function SolutionSection() {
  return (
    <section id="solution">
      <SectionHeading number="04" title="Solution" />

      <p className="text-2xl font-bold text-white mb-10 tracking-tight leading-tight">
        One AI-powered operational layer for everything your startup needs to move fast.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <FieldLabel>How It Works</FieldLabel>
          <div className="space-y-5">
            {SOLUTION_STEPS.map((step) => (
              <div key={step.n} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500 font-semibold text-xs">
                  {step.n}
                </span>
                <p className="text-sm text-zinc-300 pt-1 leading-relaxed">{step.t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <FieldLabel>Key Differentiators</FieldLabel>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {DIFFERENTIATORS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Expected Outcome</FieldLabel>
            <p className="text-sm text-zinc-500 leading-relaxed italic mt-1">
              &ldquo;Teams using FlowSync report 35% faster sprint cycles and 60% reduction in
              status meetings within the first 30 days.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
