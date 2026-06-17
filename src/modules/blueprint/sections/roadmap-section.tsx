import { cn } from '@/lib/utils'
import { SectionHeading } from '../ui/section-heading'
import { ROADMAP_PHASES } from '../constants'

export function RoadmapSection() {
  const activeIndex = ROADMAP_PHASES.findIndex((p) => p.active)

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
            style={{ width: `${(activeIndex / (ROADMAP_PHASES.length - 1)) * 100}%` }}
          />
        )}

        {/* Phase cards */}
        <div className="grid grid-cols-4 gap-3">
          {ROADMAP_PHASES.map((p) => (
            <div key={p.phase} className="flex flex-col items-center">
              {/* Dot */}
              <div className="relative flex items-center justify-center mb-5">
                {p.active && (
                  <span className="absolute w-5 h-5 rounded-full bg-emerald-500/20 animate-ping" />
                )}
                <div
                  className={cn(
                    'w-3 h-3 rounded-full z-10 transition-all duration-500',
                    p.active
                      ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'bg-zinc-800 border border-zinc-700',
                  )}
                />
              </div>

              {/* Card */}
              <div
                className={cn(
                  'w-full rounded-xl p-4 border transition-colors',
                  p.active
                    ? 'border-emerald-500/20 bg-emerald-500/[0.04]'
                    : 'border-white/[0.05] bg-white/[0.02]',
                )}
              >
                <p
                  className={cn(
                    'text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5',
                    p.active ? 'text-emerald-500' : 'text-zinc-700',
                  )}
                >
                  Phase {p.phase}
                </p>
                <p className="text-[13px] font-bold text-white mb-1 leading-tight">{p.name}</p>
                <p
                  className={cn(
                    'text-[10px] font-medium mb-3',
                    p.active ? 'text-emerald-600' : 'text-zinc-700',
                  )}
                >
                  {p.time}
                </p>
                <p className="text-[11px] text-zinc-600 leading-relaxed">{p.tasks}</p>

                {p.active && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/10">
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      In Progress
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
