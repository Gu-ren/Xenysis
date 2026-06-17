import { Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { OVERVIEW_STATS } from '../constants'

export function OverviewSection() {
  return (
    <section id="overview">
      <SectionHeading number="01" title="Overview" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {OVERVIEW_STATS.map((stat) => (
          <GlassCard key={stat.label}>
            <FieldLabel>{stat.label}</FieldLabel>
            <p className="text-base font-semibold text-white">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="flex items-start gap-4 p-6 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.12]">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
        <p className="text-zinc-300 italic text-base leading-relaxed">
          &ldquo;FlowSync is a workflow automation platform that helps early-stage startup teams
          eliminate operational bottlenecks and ship faster through AI-assisted process
          management.&rdquo;
        </p>
      </div>
    </section>
  )
}
