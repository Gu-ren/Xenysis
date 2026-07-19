import { Sparkles } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField } from '../ui/editable-field'
import type {
  BlueprintOverview,
  BlueprintCustomer,
  BlueprintBusinessModel,
} from '../types/blueprint-api'

interface OverviewSectionProps {
  overview: BlueprintOverview
  customer: BlueprintCustomer
  businessModel: BlueprintBusinessModel
  percentage?: number
  editable?: boolean
  onChange?: (overview: BlueprintOverview) => void
}

function formatGtmMotion(motion: string): string {
  return motion.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatRevenueType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function OverviewSection({
  overview,
  customer,
  businessModel,
  percentage,
  editable = false,
  onChange,
}: OverviewSectionProps) {
  const primaryStream =
    businessModel.revenueStreams.find((r) => r.isPrimary) ?? businessModel.revenueStreams[0]

  const stats = [
    { label: 'Ideal Customer', value: customer.icp.title },
    { label: 'GTM Strategy', value: formatGtmMotion(businessModel.gtmMotion) },
    {
      label: 'Revenue Model',
      value: primaryStream ? formatRevenueType(primaryStream.type) : '—',
    },
    { label: 'Primary Channel', value: businessModel.keyChannels[0] ?? '—' },
    { label: 'Target Market', value: overview.targetMarketSummary },
  ]

  const patch = (partial: Partial<BlueprintOverview>) => {
    onChange?.({ ...overview, ...partial })
  }

  return (
    <section id="overview">
      <SectionHeading number="01" title="Overview" percentage={percentage} />

      {editable ? (
        <div className="space-y-4 mb-6">
          <EditableField
            label="Tagline"
            value={overview.tagline}
            editable
            onChange={(tagline) => patch({ tagline })}
          />
          <EditableField
            label="Core value proposition"
            value={overview.coreValueProposition}
            editable
            multiline
            onChange={(coreValueProposition) => patch({ coreValueProposition })}
          />
          <EditableField
            label="Target market summary"
            value={overview.targetMarketSummary}
            editable
            multiline
            onChange={(targetMarketSummary) => patch({ targetMarketSummary })}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => (
            <GlassCard key={stat.label}>
              <FieldLabel>{stat.label}</FieldLabel>
              <p className="text-base font-semibold text-white">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="flex items-start gap-4 p-6 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.12]">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
        {editable ? (
          <div className="flex-1">
            <EditableField
              label="Position statement"
              value={overview.positionStatement}
              editable
              multiline
              onChange={(positionStatement) => patch({ positionStatement })}
            />
          </div>
        ) : (
          <p className="text-zinc-300 italic text-base leading-relaxed">
            &ldquo;{overview.positionStatement}&rdquo;
          </p>
        )}
      </div>
    </section>
  )
}
