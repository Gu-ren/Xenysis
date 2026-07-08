import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import type { BlueprintRisks, BlueprintRiskCategory } from '../types/blueprint-api'

interface RisksSectionProps {
  risks: BlueprintRisks
  percentage?: number
}

const RISK_CATEGORY_COLORS: Record<BlueprintRiskCategory, string> = {
  product:            'border-l-amber-500/70',
  technical:          'border-l-orange-500/70',
  market:             'border-l-blue-500/70',
  customer_adoption:  'border-l-red-500/70',
  competition:        'border-l-purple-500/70',
  regulatory:         'border-l-indigo-500/70',
  team:               'border-l-yellow-500/70',
  financial:          'border-l-red-500/70',
}

function formatCategory(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Risks'
}

export function RisksSection({ risks, percentage }: RisksSectionProps) {
  const grouped = risks.risks.reduce<Record<BlueprintRiskCategory, typeof risks.risks>>(
    (acc, risk) => {
      if (!acc[risk.category]) acc[risk.category] = []
      acc[risk.category].push(risk)
      return acc
    },
    {} as Record<BlueprintRiskCategory, typeof risks.risks>,
  )

  const categories = Object.entries(grouped) as [BlueprintRiskCategory, typeof risks.risks][]

  return (
    <section id="risks">
      <SectionHeading number="11" title="Risks" percentage={percentage} />

      <div className={cn('grid gap-4', categories.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
        {categories.map(([category, items]) => (
          <div key={category} className="space-y-3">
            <FieldLabel>{formatCategory(category)}</FieldLabel>
            {items.map((risk) => (
              <div
                key={risk.title}
                className={cn(
                  'p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] border-l-2 text-xs text-zinc-500 leading-relaxed',
                  RISK_CATEGORY_COLORS[category],
                )}
              >
                <p className="text-zinc-300 font-medium mb-1">{risk.title}</p>
                <p className="mb-2">{risk.description}</p>
                <p className="text-zinc-600 italic">Mitigation: {risk.mitigation}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
