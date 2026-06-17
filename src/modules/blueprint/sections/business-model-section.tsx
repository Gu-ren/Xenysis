import { Target, TrendingUp, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '../ui/glass-card'
import { SectionHeading } from '../ui/section-heading'
import { FieldLabel } from '../ui/field-label'
import { PRICING_TIERS, ACQUISITION_CHANNELS, EXPANSION_ITEMS } from '../constants'
import { cn } from '@/lib/utils'

export function BusinessModelSection() {
  return (
    <section id="business-model">
      <SectionHeading number="05" title="Business Model" />

      <div className="grid md:grid-cols-[1fr_280px] gap-10">
        <div className="space-y-8">
          <div>
            <FieldLabel>Revenue Model</FieldLabel>
            <p className="text-lg text-white font-medium mt-1">
              Monthly recurring subscription with usage-based AI feature tiers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PRICING_TIERS.map((tier) => (
              <GlassCard
                key={tier.key}
                className={cn(
                  'relative overflow-hidden group',
                  tier.highlighted && 'border-emerald-500/20',
                )}
              >
                <div className="absolute top-3 right-3">
                  {tier.highlighted ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500/30" />
                  ) : (
                    <Target className="w-4 h-4 text-white/[0.08] group-hover:text-white/[0.14] transition-colors" />
                  )}
                </div>
                <p
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-[0.16em] mb-4',
                    tier.highlighted ? 'text-emerald-600' : 'text-zinc-600',
                  )}
                >
                  {tier.label}
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {tier.price}
                  <span className="text-sm font-normal text-zinc-600">/mo</span>
                </p>
                <ul className="text-xs text-zinc-500 space-y-1.5 mt-3">
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <FieldLabel>Acquisition Channels</FieldLabel>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ACQUISITION_CHANNELS.map((ch) => (
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
            <FieldLabel>Expansion</FieldLabel>
            <ul className="text-xs text-zinc-500 space-y-2.5 mt-3">
              {EXPANSION_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
