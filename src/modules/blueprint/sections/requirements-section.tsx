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

function groupByCategory(
  reqs: BlueprintRequirement[],
): { category: string; items: { req: BlueprintRequirement; index: number }[] }[] {
  const map = new Map<string, { req: BlueprintRequirement; index: number }[]>()
  reqs.forEach((req, index) => {
    const existing = map.get(req.category) ?? []
    map.set(req.category, [...existing, { req, index }])
  })
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }))
}

export function RequirementsSection({
  requirements,
  percentage,
  editable = false,
  onChange,
}: RequirementsSectionProps) {
  const functionalGroups = groupByCategory(requirements.functional)

  if (editable) {
    return (
      <section id="requirements">
        <SectionHeading number="09" title="Requirements" percentage={percentage} />
        <div className="border border-white/[0.05] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
          {functionalGroups.map((group) => (
            <div key={group.category} className="px-5 py-4 space-y-3">
              <p className="text-[13px] font-medium text-white">{group.category}</p>
              {group.items.map(({ req, index }) => (
                <EditableField
                  key={req.id}
                  label={req.id}
                  value={req.description}
                  editable
                  multiline
                  onChange={(description) => {
                    const functional = [...requirements.functional]
                    functional[index] = { ...req, description }
                    onChange?.({ ...requirements, functional })
                  }}
                />
              ))}
            </div>
          ))}
          {requirements.nonFunctional.length > 0 && (
            <div className="px-5 py-4 space-y-3">
              <p className="text-[13px] font-medium text-white">Non-Functional</p>
              {requirements.nonFunctional.map((req, i) => (
                <EditableField
                  key={req.id}
                  label={req.id}
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
          )}
        </div>
      </section>
    )
  }

  const readGroups = functionalGroups.map((g) => ({
    category: g.category,
    items: g.items.map(({ req }) => req.description),
  }))
  const nonFunctionalItems = requirements.nonFunctional.map((r) => r.description)

  return (
    <section id="requirements">
      <SectionHeading number="09" title="Requirements" percentage={percentage} />

      <div className="border border-white/[0.05] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
        {readGroups.map((group, i) => (
          <div key={group.category} className="px-5">
            <AccordionItem title={group.category} items={group.items} defaultOpen={i === 0} />
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
