import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField } from '../ui/editable-field'
import type { BlueprintCustomer } from '../types/blueprint-api'

interface CustomerSectionProps {
  customer: BlueprintCustomer
  percentage?: number
  editable?: boolean
  onChange?: (customer: BlueprintCustomer) => void
}

function formatBuyerVsUser(value: string): string {
  if (value === 'same') return 'Buyer = User'
  if (value === 'different') return 'Buyer ≠ User (top-down sale)'
  return 'Both roles present'
}

export function CustomerSection({
  customer,
  percentage,
  editable = false,
  onChange,
}: CustomerSectionProps) {
  const { icp, segments } = customer

  const patchIcp = (partial: Partial<BlueprintCustomer['icp']>) => {
    onChange?.({ ...customer, icp: { ...icp, ...partial } })
  }

  const cards = [
    { label: 'Job to Be Done', value: icp.jobToBeDone },
    { label: 'Buyer Model', value: formatBuyerVsUser(icp.buyerVsUser) },
    ...segments.map((seg) => ({
      label: seg.name,
      value: `${seg.description} · ${seg.estimatedSize}`,
    })),
  ]

  return (
    <section id="customer">
      <SectionHeading number="03" title="Customer" percentage={percentage} />

      {editable ? (
        <div className="space-y-4 mb-7">
          <EditableField
            label="ICP title"
            value={icp.title}
            editable
            onChange={(title) => patchIcp({ title })}
          />
          <EditableField
            label="ICP description"
            value={icp.description}
            editable
            multiline
            onChange={(description) => patchIcp({ description })}
          />
          <EditableField
            label="Job to be done"
            value={icp.jobToBeDone}
            editable
            multiline
            onChange={(jobToBeDone) => patchIcp({ jobToBeDone })}
          />
          {segments.map((seg, i) => (
            <div key={i} className="space-y-2 pt-2 border-t border-white/[0.06]">
              <EditableField
                label="Segment name"
                value={seg.name}
                editable
                onChange={(name) => {
                  const next = [...segments]
                  next[i] = { ...seg, name }
                  onChange?.({ ...customer, segments: next })
                }}
              />
              <EditableField
                label="Segment description"
                value={seg.description}
                editable
                multiline
                onChange={(description) => {
                  const next = [...segments]
                  next[i] = { ...seg, description }
                  onChange?.({ ...customer, segments: next })
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}
