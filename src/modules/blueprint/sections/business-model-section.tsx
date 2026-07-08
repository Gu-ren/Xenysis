import { Target, TrendingUp, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { cn } from '@/lib/utils'
import type { BlueprintBusinessModel } from '../types/blueprint-api'

interface BusinessModelSectionProps {
  businessModel: BlueprintBusinessModel
  percentage?: number
}

function formatRevenueType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function BusinessModelSection({ businessModel, percentage }: BusinessModelSectionProps) {
  const { revenueStreams, keyChannels, unitEconomicsHypothesis, goToMarketSummary } = businessModel

  return (
    <section id="business-model">
      <SectionHeading number="05" title="Business Model" percentage={percentage} />

      <div className="grid md:grid-cols-[1fr_280px] gap-10">
        <div className="space-y-8">
          <div>
            <FieldLabel>Revenue Model</FieldLabel>
            <p className="text-lg text-white font-medium mt-1">{goToMarketSummary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {revenueStreams.map((stream) => (
              <GlassCard
                key={stream.type}
                className={cn(
                  'relative overflow-hidden group',
                  stream.isPrimary && 'border-emerald-500/20',
                )}
              >
                <div className="absolute top-3 right-3">
                  {stream.isPrimary ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500/30" />
                  ) : (
                    <Target className="w-4 h-4 text-white/[0.08] group-hover:text-white/[0.14] transition-colors" />
                  )}
                </div>
                <p
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-[0.16em] mb-4',
                    stream.isPrimary ? 'text-emerald-600' : 'text-zinc-600',
                  )}
                >
                  {formatRevenueType(stream.type)}
                </p>
                <p className="text-sm font-medium text-white mb-1 leading-relaxed">
                  {stream.pricingHypothesis}
                </p>
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{stream.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <FieldLabel>Acquisition Channels</FieldLabel>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {keyChannels.map((ch) => (
                <span
                  key={ch}
                  className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Unit Economics</FieldLabel>
            <ul className="text-xs text-zinc-500 space-y-2.5 mt-3">
              {unitEconomicsHypothesis.split(/[.;]/).filter(Boolean).map((item) => (
                <li key={item.trim()} className="flex items-start gap-2">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
