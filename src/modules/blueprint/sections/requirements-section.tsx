import { SectionHeading } from '../ui/section-heading'
import { AccordionItem } from '../ui/accordion-item'
import { EditableField } from '../ui/editable-field'
import type { BlueprintRequirements, BlueprintRequirement } from '../types/blueprint-api'

interface RequirementsSectionProps {
  requirements: BlueprintRequirements
  percentage?: number
  editable?: boolean
  onChange?: (requirements: BlueprintRequirements) => void
}

function groupByCategory(reqs: BlueprintRequirement[]): { category: string; items: string[] }[] {
  const map = new Map<string, string[]>()
  for (const req of reqs) {
    const existing = map.get(req.category) ?? []
    map.set(req.category, [...existing, req.description])
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }))
}

export function RequirementsSection({
  requirements,
  percentage,
  editable = false,
  onChange,
}: RequirementsSectionProps) {
  const functionalGroups = groupByCategory(requirements.functional)
  const nonFunctionalItems = requirements.nonFunctional.map((r) => r.description)

  if (editable) {
    return (
      <section id="requirements">
        <SectionHeading number="09" title="Requirements" percentage={percentage} />
        <div className="space-y-3">
          {requirements.functional.map((req, i) => (
            <EditableField
              key={req.id}
              label={`${req.id} · ${req.category}`}
              value={req.description}
              editable
              multiline
              onChange={(description) => {
                const functional = [...requirements.functional]
                functional[i] = { ...req, description }
                onChange?.({ ...requirements, functional })
              }}
            />
          ))}
          {requirements.nonFunctional.map((req, i) => (
            <EditableField
              key={req.id}
              label={`${req.id} · NF`}
              value={req.description}
              editable
              multiline
              onChange={(description) => {
                const nonFunctional = [...requirements.nonFunctional]
                nonFunctional[i] = { ...req, description }
                onChange?.({ ...requirements, nonFunctional })
              }}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="requirements">
      <SectionHeading number="09" title="Requirements" percentage={percentage} />

      <div className="border border-white/[0.05] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
        {functionalGroups.map((group, i) => (
          <div key={group.category} className="px-5">
            <AccordionItem
              title={group.category}
              items={group.items}
              defaultOpen={i === 0}
            />
          </div>
        ))}
        {nonFunctionalItems.length > 0 && (
          <div className="px-5">
            <AccordionItem
              title="Non-Functional"
              items={nonFunctionalItems}
              defaultOpen={false}
            />
          </div>
        )}
      </div>
    </section>
  )
}
