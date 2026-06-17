import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { RISK_GROUPS } from '../constants'

export function RisksSection() {
  return (
    <section id="risks">
      <SectionHeading number="11" title="Risks" />

      <div className="grid md:grid-cols-3 gap-4">
        {RISK_GROUPS.map((group) => (
          <div key={group.type} className="space-y-3">
            <FieldLabel>{group.type}</FieldLabel>
            {group.items.map((risk) => (
              <div
                key={risk}
                className={cn(
                  'p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] border-l-2 text-xs text-zinc-500 leading-relaxed',
                  group.color,
                )}
              >
                {risk}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
