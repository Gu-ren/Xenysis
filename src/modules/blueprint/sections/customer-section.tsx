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

  return (
    <section id="customer">
      <SectionHeading number="03" title="Customer" percentage={percentage} />

      <div className="mb-7">
        <FieldLabel>Ideal Customer Profile</FieldLabel>
        <EditableField
          value={icp.title}
          editable={editable}
          onChange={(title) => patchIcp({ title })}
          valueClassName="text-xl font-semibold text-white leading-snug"
        />
        <EditableField
          value={icp.description}
          editable={editable}
          multiline
          onChange={(description) => patchIcp({ description })}
          className="mt-2"
          valueClassName="text-sm text-zinc-500 leading-relaxed whitespace-pre-wrap"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <GlassCard>
          <EditableField
            label="Job to Be Done"
            value={icp.jobToBeDone}
            editable={editable}
            multiline
            onChange={(jobToBeDone) => patchIcp({ jobToBeDone })}
            valueClassName="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap"
          />
        </GlassCard>
        <GlassCard>
          <FieldLabel>Buyer Model</FieldLabel>
          <p className="text-sm text-zinc-300 font-medium leading-relaxed">
            {formatBuyerVsUser(icp.buyerVsUser)}
          </p>
        </GlassCard>
        {segments.map((seg, i) => (
          <GlassCard key={i}>
            <EditableField
              label="Segment"
              value={seg.name}
              editable={editable}
              onChange={(name) => {
                const next = [...segments]
                next[i] = { ...seg, name }
                onChange?.({ ...customer, segments: next })
              }}
              valueClassName="text-[11px] uppercase tracking-wide text-zinc-500 mb-0 font-normal"
            />
            <EditableField
              value={seg.description}
              editable={editable}
              multiline
              onChange={(description) => {
                const next = [...segments]
                next[i] = { ...seg, description }
                onChange?.({ ...customer, segments: next })
              }}
              valueClassName="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap"
            />
            {!editable && (
              <p className="text-xs text-zinc-600 mt-1">{seg.estimatedSize}</p>
            )}
            {editable && (
              <EditableField
                value={seg.estimatedSize}
                editable
                onChange={(estimatedSize) => {
                  const next = [...segments]
                  next[i] = { ...seg, estimatedSize }
                  onChange?.({ ...customer, segments: next })
                }}
                className="mt-1"
                valueClassName="text-xs text-zinc-600"
              />
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
