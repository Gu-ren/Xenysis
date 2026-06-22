import { Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import type { BlueprintOverview, BlueprintCustomer, BlueprintBusinessModel } from '../types/blueprint-api'

interface OverviewSectionProps {
  overview: BlueprintOverview
  customer: BlueprintCustomer
  businessModel: BlueprintBusinessModel
}

function formatGtmMotion(motion: string): string {
  return motion.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatRevenueType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function OverviewSection({ overview, customer, businessModel }: OverviewSectionProps) {
  const primaryStream = businessModel.revenueStreams.find((r) => r.isPrimary) ?? businessModel.revenueStreams[0]

  const stats = [
    { label: 'Ideal Customer',  value: customer.icp.title },
    { label: 'GTM Strategy',    value: formatGtmMotion(businessModel.gtmMotion) },
    { label: 'Revenue Model',   value: primaryStream ? formatRevenueType(primaryStream.type) : '—' },
    { label: 'Primary Channel', value: businessModel.keyChannels[0] ?? '—' },
    { label: 'Target Market',   value: overview.targetMarketSummary },
  ]

  return (
    <section id="overview">
      <SectionHeading number="01" title="Overview" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => (
          <GlassCard key={stat.label}>
            <FieldLabel>{stat.label}</FieldLabel>
            <p className="text-base font-semibold text-white">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="flex items-start gap-4 p-6 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.12]">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
        <p className="text-zinc-300 italic text-base leading-relaxed">
          &ldquo;{overview.positionStatement}&rdquo;
        </p>
      </div>
    </section>
  )
}
