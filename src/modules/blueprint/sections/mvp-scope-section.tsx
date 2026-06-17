import { CheckCircle2, Plus } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import type { BlueprintMvpScope } from '../types/blueprint-api'

interface MvpScopeSectionProps {
  mvpScope: BlueprintMvpScope
}

export function MvpScopeSection({ mvpScope }: MvpScopeSectionProps) {
  const included = mvpScope.scope
    .filter((item) => item.priority === 'must_have' || item.priority === 'should_have')
    .map((item) => item.feature)

  return (
    <section id="mvp-scope">
      <SectionHeading number="08" title="MVP Scope" />

      {mvpScope.hypothesis && (
        <p className="text-sm text-zinc-600 italic mb-6 leading-relaxed">
          Hypothesis: {mvpScope.hypothesis}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="bg-[#0a0a0a] p-8">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500 mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Included in MVP
          </h4>
          <div className="flex flex-wrap gap-2">
            {included.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] text-[11px] text-emerald-400/90"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-8">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-5 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 rotate-45" />
            Not Included Yet
          </h4>
          <div className="flex flex-wrap gap-2">
            {mvpScope.outOfScope.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[11px] text-zinc-600"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {mvpScope.estimatedBuildTime && (
        <p className="text-xs text-zinc-700 mt-4 text-center">
          Estimated build time: {mvpScope.estimatedBuildTime}
        </p>
      )}
    </section>
  )
}
