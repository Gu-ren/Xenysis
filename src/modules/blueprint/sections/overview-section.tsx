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

  const patch = (partial: Partial<BlueprintOverview>) => {
    onChange?.({ ...overview, ...partial })
  }

  return (
    <section id="overview">
      <SectionHeading number="01" title="Overview" percentage={percentage} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <GlassCard>
          <FieldLabel>Ideal Customer</FieldLabel>
          <p className="text-base font-semibold text-white">{customer.icp.title}</p>
        </GlassCard>
        <GlassCard>
          <FieldLabel>GTM Strategy</FieldLabel>
          <p className="text-base font-semibold text-white">
            {formatGtmMotion(businessModel.gtmMotion)}
          </p>
        </GlassCard>
        <GlassCard>
          <FieldLabel>Revenue Model</FieldLabel>
          <p className="text-base font-semibold text-white">
            {primaryStream ? formatRevenueType(primaryStream.type) : '—'}
          </p>
        </GlassCard>
        <GlassCard>
          <FieldLabel>Primary Channel</FieldLabel>
          <p className="text-base font-semibold text-white">
            {businessModel.keyChannels[0] ?? '—'}
          </p>
        </GlassCard>
        <GlassCard className="col-span-2">
          <EditableField
            label="Target Market"
            value={overview.targetMarketSummary}
            editable={editable}
            onChange={(targetMarketSummary) => patch({ targetMarketSummary })}
            valueClassName="text-base font-semibold text-white"
          />
        </GlassCard>
        <GlassCard className="col-span-2 lg:col-span-3">
          <EditableField
            label="Tagline"
            value={overview.tagline}
            editable={editable}
            onChange={(tagline) => patch({ tagline })}
            valueClassName="text-base font-semibold text-white"
          />
        </GlassCard>
        <GlassCard className="col-span-2 lg:col-span-3">
          <EditableField
            label="Core value proposition"
            value={overview.coreValueProposition}
            editable={editable}
            multiline
            onChange={(coreValueProposition) => patch({ coreValueProposition })}
            valueClassName="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap"
          />
        </GlassCard>
      </div>

      <div className="flex items-start gap-4 p-6 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.12]">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <EditableField
            value={overview.positionStatement}
            editable={editable}
            multiline
            onChange={(positionStatement) => patch({ positionStatement })}
            valueClassName="text-zinc-300 italic text-base leading-relaxed whitespace-pre-wrap"
          />
        </div>
      </div>
    </section>
  )
}
