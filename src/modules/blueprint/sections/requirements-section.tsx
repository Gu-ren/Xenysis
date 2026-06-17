import { SectionHeading } from '../ui/section-heading'
import { AccordionItem } from '../ui/accordion-item'
import { REQUIREMENTS } from '../constants'

export function RequirementsSection() {
  return (
    <section id="requirements">
      <SectionHeading number="09" title="Requirements" />

      <div className="border border-white/[0.05] rounded-xl overflow-hidden divide-y divide-white/[0.05]">
        {REQUIREMENTS.map((req) => (
          <div key={req.id} className="px-5">
            <AccordionItem title={req.title} items={req.items} defaultOpen={req.isOpen} />
          </div>
        ))}
      </div>
    </section>
  )
}
