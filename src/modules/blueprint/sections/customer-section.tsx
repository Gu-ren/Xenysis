import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import type { BlueprintCustomer } from '../types/blueprint-api'

interface CustomerSectionProps {
  customer: BlueprintCustomer
  percentage?: number
}

function formatBuyerVsUser(value: string): string {
  if (value === 'same') return 'Buyer = User'
  if (value === 'different') return 'Buyer ≠ User (top-down sale)'
  return 'Both roles present'
}

export function CustomerSection({ customer, percentage }: CustomerSectionProps) {
  const { icp, segments } = customer

  const cards = [
    { label: 'Job to Be Done', value: icp.jobToBeDone },
    { label: 'Buyer Model',    value: formatBuyerVsUser(icp.buyerVsUser) },
    ...segments.map((seg) => ({
      label: seg.name,
      value: `${seg.description} · ${seg.estimatedSize}`,
    })),
  ]

  return (
    <section id="customer">
      <SectionHeading number="03" title="Customer" percentage={percentage} />

      <div className="mb-7">
        <FieldLabel>Ideal Customer Profile</FieldLabel>
        <p className="text-xl font-semibold text-white leading-snug">{icp.title}</p>
        {icp.description && (
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{icp.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((item) => (
          <GlassCard key={item.label}>
            <FieldLabel>{item.label}</FieldLabel>
            <p className="text-sm text-zinc-300 font-medium leading-relaxed">{item.value}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
