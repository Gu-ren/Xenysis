import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import type { BlueprintRoadmap } from '../types/blueprint-api'

interface RoadmapSectionProps {
  roadmap: BlueprintRoadmap
}

export function RoadmapSection({ roadmap }: RoadmapSectionProps) {
  const { milestones } = roadmap
  const activeIndex = 0

  return (
    <section id="roadmap">
      <SectionHeading number="10" title="Roadmap" />

      <div className="relative">
        {/* Connector track */}
        <div className="absolute top-[22px] left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-white/[0.06]" />
        {/* Active progress fill */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-[22px] left-[calc(12.5%+8px)] h-px bg-emerald-500/30 transition-all duration-700"
            style={{ width: `${(activeIndex / (milestones.length - 1)) * 100}%` }}
          />
        )}

        {/* Phase cards */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}
        >
          {milestones.map((milestone, i) => {
            const isActive = i === activeIndex
            return (
              <div key={milestone.phase} className="flex flex-col items-center">
                {/* Dot */}
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

                {/* Card */}
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
                  <p className="text-[13px] font-bold text-white mb-1 leading-tight">
                    {milestone.name}
                  </p>
                  <p
                    className={cn(
                      'text-[10px] font-medium mb-3',
                      isActive ? 'text-emerald-600' : 'text-zinc-700',
                    )}
                  >
                    {milestone.estimatedDuration}
                  </p>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    {milestone.deliverables.slice(0, 3).join(', ')}
                  </p>

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

      {roadmap.totalEstimatedTimeline && (
        <p className="text-xs text-zinc-700 mt-6 text-center">
          Total timeline: {roadmap.totalEstimatedTimeline}
        </p>
      )}
    </section>
  )
}
