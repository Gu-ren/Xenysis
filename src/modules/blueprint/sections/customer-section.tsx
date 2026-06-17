import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { CUSTOMER_CARDS } from '../constants'

export function CustomerSection() {
  return (
    <section id="customer">
      <SectionHeading number="03" title="Customer" />

      <div className="mb-7">
        <FieldLabel>Primary Customer</FieldLabel>
        <p className="text-xl font-semibold text-white leading-snug">
          Head of Operations at an early-stage startup (Seed to Series A)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CUSTOMER_CARDS.map((item) => (
          <GlassCard key={item.label}>
            <FieldLabel>{item.label}</FieldLabel>
            <p className="text-sm text-zinc-300 font-medium leading-relaxed">{item.value}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
