import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import { btn, card, badge } from './preview-helpers'

export function PricingPreview({ dp, ctx }: { dp: DesignProfile; ctx?: StartupPreviewContext | null }) {
  const names    = ctx?.planNames    ?? ['Starter', 'Pro', 'Enterprise']
  const prices   = ctx?.planPrices   ?? ['Free', '$49', 'Custom']
  const feats    = ctx?.planFeatures ?? { starter: ['1 workspace'], pro: ['Unlimited', 'Priority support'], enterprise: ['Custom SLA'] }

  const plans = [
    { name: names[0], price: prices[0], period: prices[0] === 'Free' || prices[0] === '$0' ? 'free forever' : '/mo', features: feats.starter, pop: false },
    { name: names[1], price: prices[1], period: '/mo', features: feats.pro, pop: true },
    { name: names[2], price: prices[2], period: prices[2] === 'Custom' ? '— contact us' : '/mo', features: feats.enterprise, pop: false },
  ]

  return (
    <div
      className="flex flex-col items-center justify-center h-full px-4"
      style={{ background: dp.background, gap: 10 }}
    >
      <div style={{ fontSize: 14, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
        Simple, transparent pricing
      </div>
      <div style={{ fontSize: 9, color: dp.textMuted, marginBottom: 4, fontFamily: dp.fontFamily }}>
        Start free. Scale when you&apos;re ready.
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {plans.map(({ name, price, period, features, pop }) => (
          <div
            key={name}
            style={{
              ...card(dp, { accent: pop }),
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              background: pop ? dp.primarySubtle : dp.surface,
            }}
          >
            {pop && (
              <div style={{ ...badge(dp), marginBottom: 6, alignSelf: 'flex-start' }}>POPULAR</div>
            )}
            <div style={{ fontSize: 9, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 2, fontFamily: dp.fontFamily }}>{name}</div>
            <div style={{ fontSize: 16, fontWeight: dp.fontWeightBold, color: pop ? dp.primary : dp.text, fontFamily: dp.fontFamily }}>{price}</div>
            <div style={{ fontSize: 7, color: dp.textFaint, marginBottom: 8, fontFamily: dp.fontFamily }}>{period}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                  <span style={{ fontSize: 7, color: pop ? dp.primary : dp.textMuted, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 7.5, color: dp.textMuted, lineHeight: 1.3, fontFamily: dp.fontFamily }}>{f}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                ...btn(dp, { primary: pop }),
                marginTop: 10,
                width: '100%',
                height: 24,
                fontSize: 8,
              }}
            >
              {pop ? 'Get started' : price === 'Custom' ? 'Contact sales' : 'Choose plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
