import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { EditableField } from '../ui/editable-field'
import type { BlueprintRoadmap } from '../types/blueprint-api'

interface RoadmapSectionProps {
  roadmap: BlueprintRoadmap
  percentage?: number
  editable?: boolean
  onChange?: (roadmap: BlueprintRoadmap) => void
}

export function RoadmapSection({
  roadmap,
  percentage,
  editable = false,
  onChange,
}: RoadmapSectionProps) {
  const { milestones } = roadmap
  const activeIndex = 0

  return (
    <section id="roadmap">
      <SectionHeading number="10" title="Roadmap" percentage={percentage} />

      <div className="relative">
        <div className="absolute top-[22px] left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-white/[0.06]" />
        {activeIndex >= 0 && milestones.length > 1 && (
          <div
            className="absolute top-[22px] left-[calc(12.5%+8px)] h-px bg-emerald-500/30 transition-all duration-700"
            style={{ width: `${(activeIndex / (milestones.length - 1)) * 100}%` }}
          />
        )}

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${Math.max(milestones.length, 1)}, minmax(0, 1fr))` }}
        >
          {milestones.map((milestone, i) => {
            const isActive = i === activeIndex
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-5">
                  {isActive && (
                    <span className="absolute w-5 h-5 rounded-full bg-emerald-500/20 animate-ping" />
                  )}
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full z-10 transition-all duration-500',
                      isActive
                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-zinc-800 border border-zinc-700',
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'w-full rounded-xl p-4 border transition-colors',
                    isActive
                      ? 'border-emerald-500/20 bg-emerald-500/[0.04]'
                      : 'border-white/[0.05] bg-white/[0.02]',
                  )}
                >
                  <p
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5',
                      isActive ? 'text-emerald-500' : 'text-zinc-700',
                    )}
                  >
                    Phase {milestone.phase}
                  </p>
                  <EditableField
                    value={milestone.name}
                    editable={editable}
                    onChange={(name) => {
                      const next = [...milestones]
                      next[i] = { ...milestone, name }
                      onChange?.({ ...roadmap, milestones: next })
                    }}
                    valueClassName="text-[13px] font-bold text-white mb-1 leading-tight"
                  />
                  <EditableField
                    value={milestone.estimatedDuration}
                    editable={editable}
                    onChange={(estimatedDuration) => {
                      const next = [...milestones]
                      next[i] = { ...milestone, estimatedDuration }
                      onChange?.({ ...roadmap, milestones: next })
                    }}
                    valueClassName={cn(
                      'text-[10px] font-medium mb-3',
                      isActive ? 'text-emerald-600' : 'text-zinc-700',
                    )}
                  />
                  <EditableField
                    value={milestone.description}
                    editable={editable}
                    multiline
                    onChange={(description) => {
                      const next = [...milestones]
                      next[i] = { ...milestone, description }
                      onChange?.({ ...roadmap, milestones: next })
                    }}
                    valueClassName="text-[11px] text-zinc-600 leading-relaxed whitespace-pre-wrap"
                  />

                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/10">
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {(roadmap.totalEstimatedTimeline || editable) && (
        <div className="mt-6 text-center space-y-2">
          <EditableField
            value={
              editable
                ? roadmap.totalEstimatedTimeline
                : `Total timeline: ${roadmap.totalEstimatedTimeline}`
            }
            editable={editable}
            onChange={(totalEstimatedTimeline) =>
              onChange?.({ ...roadmap, totalEstimatedTimeline })
            }
            valueClassName="text-xs text-zinc-700"
          />
          {editable && (
            <EditableField
              label="Critical path"
              value={roadmap.criticalPath}
              editable
              multiline
              onChange={(criticalPath) => onChange?.({ ...roadmap, criticalPath })}
            />
          )}
        </div>
      )}
    </section>
  )
}
