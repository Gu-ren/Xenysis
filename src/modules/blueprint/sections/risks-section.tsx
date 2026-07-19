import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { EditableField } from '../ui/editable-field'
import type { BlueprintRisks, BlueprintRiskCategory } from '../types/blueprint-api'

interface RisksSectionProps {
  risks: BlueprintRisks
  percentage?: number
  editable?: boolean
  onChange?: (risks: BlueprintRisks) => void
}

const RISK_CATEGORY_COLORS: Record<BlueprintRiskCategory, string> = {
  product: 'border-l-amber-500/70',
  technical: 'border-l-orange-500/70',
  market: 'border-l-blue-500/70',
  customer_adoption: 'border-l-red-500/70',
  competition: 'border-l-purple-500/70',
  regulatory: 'border-l-indigo-500/70',
  team: 'border-l-yellow-500/70',
  financial: 'border-l-red-500/70',
}

function formatCategory(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Risks'
}

export function RisksSection({
  risks,
  percentage,
  editable = false,
  onChange,
}: RisksSectionProps) {
  const updateRisk = (index: number, partial: Partial<(typeof risks.risks)[number]>) => {
    const next = [...risks.risks]
    next[index] = { ...next[index], ...partial }
    onChange?.({ risks: next })
  }

  const grouped = risks.risks.reduce<
    Record<string, { risk: (typeof risks.risks)[number]; index: number }[]>
  >((acc, risk, index) => {
    if (!acc[risk.category]) acc[risk.category] = []
    acc[risk.category].push({ risk, index })
    return acc
  }, {})

  const categories = Object.entries(grouped)

  return (
    <section id="risks">
      <SectionHeading number="11" title="Risks" percentage={percentage} />

      <div className={cn('grid gap-4', categories.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
        {categories.map(([category, items]) => (
          <div key={category} className="space-y-3">
            <FieldLabel>{formatCategory(category)}</FieldLabel>
            {items.map(({ risk, index }) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] border-l-2 text-xs text-zinc-500 leading-relaxed',
                  RISK_CATEGORY_COLORS[category as BlueprintRiskCategory],
                )}
              >
                <EditableField
                  value={risk.title}
                  editable={editable}
                  onChange={(title) => updateRisk(index, { title })}
                  valueClassName="text-zinc-300 font-medium mb-1 text-xs"
                />
                <EditableField
                  value={risk.description}
                  editable={editable}
                  multiline
                  onChange={(description) => updateRisk(index, { description })}
                  className="mb-2"
                  valueClassName="text-xs text-zinc-500 leading-relaxed whitespace-pre-wrap"
                />
                <EditableField
                  value={risk.mitigation}
                  editable={editable}
                  multiline
                  onChange={(mitigation) => updateRisk(index, { mitigation })}
                  valueClassName="text-zinc-600 italic text-xs whitespace-pre-wrap"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
