import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import { btn, card, badge } from './preview-helpers'

export function LandingPreview({
  dp, ctx, onNavigatePrimary, onNavigateSecondary,
}: {
  dp: DesignProfile
  ctx?: StartupPreviewContext | null
  onNavigatePrimary?: () => void
  onNavigateSecondary?: () => void
}) {
  const name     = ctx?.name ?? 'YourApp'
  const navItems = ctx?.marketingNav ?? ['Features', 'Pricing', 'Docs']
  const hero     = ctx?.hero
  const features = ctx?.features ?? [
    { label: 'Core Module', sub: 'Generated blueprint' },
    { label: 'Data Layer', sub: 'Schema + migrations' },
    { label: 'Deployments', sub: 'One-click deploy' },
  ]

  const isCreator = dp.visualStyle === 'creator'
  const isDevTool = dp.visualStyle === 'developer-tool'
  const isMono    = isDevTool

  const logos = ['Acme Corp', 'BuildFast', 'NexusCo', 'Orbit Inc']
  const testimonials = [
    { quote: 'Transformed how our team manages the entire pipeline.', author: 'Sarah K.', role: 'Operations Lead' },
    { quote: 'Cut our time-to-close by 40% in the first quarter.', author: 'Marcus T.', role: 'Sales Director' },
  ]

  return (
    <div style={{ background: dp.background, height: '100%', overflowY: 'auto' }}>

      {/* Sticky navbar */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 36,
          background: dp.surface,
          borderBottom: `1px solid ${dp.border}`,
          boxShadow: dp.colorMode === 'light' ? dp.shadow : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: dp.radiusSm, background: isCreator ? (dp.primaryGradient ?? dp.primary) : dp.primary }} />
          <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {navItems.map((l) => (
            <span key={l} style={{ fontSize: 9, color: dp.textMuted, fontFamily: dp.fontFamily }}>{l}</span>
          ))}
          <div
            style={{ ...btn(dp, { primary: true, sm: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
            onClick={onNavigatePrimary}
          >
            {isDevTool ? 'Install' : isCreator ? 'Join now' : 'Sign up'}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: '36px 24px 28px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${dp.border}`,
        }}
      >
        <div style={badge(dp)}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dp.primary }} />
          {hero?.badge ?? 'Phase 1 complete'}
        </div>
        <div style={{
          fontSize: isCreator ? 24 : 20,
          fontWeight: dp.fontWeightBold,
          color: dp.text,
          lineHeight: 1.15,
          whiteSpace: 'pre-line',
          fontFamily: isMono ? dp.fontFamilyMono : dp.fontFamily,
          letterSpacing: isCreator ? '-0.03em' : isDevTool ? '0.01em' : '-0.01em',
          maxWidth: 300,
        }}>
          {hero?.headline ?? `${name}.`}
        </div>
        <div style={{ fontSize: 10, color: dp.textMuted, lineHeight: 1.6, maxWidth: 230, fontFamily: dp.fontFamily }}>
          {hero?.subheadline ?? 'Your generated product is ready.'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{ ...btn(dp, { primary: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
            onClick={onNavigatePrimary}
          >
            {hero?.cta ?? 'Get started →'}
          </div>
          {onNavigateSecondary ? (
            <div style={{ ...btn(dp), cursor: 'pointer' }} onClick={onNavigateSecondary}>Sign in</div>
          ) : (
            <div style={btn(dp)}>{hero?.ctaSecondary ?? 'Learn more'}</div>
          )}
        </div>

        {/* Abstract app mockup */}
        <div style={{
          width: '90%', maxWidth: 300,
          borderRadius: dp.radius,
          border: `1px solid ${dp.border}`,
          background: dp.surface,
          overflow: 'hidden',
          marginTop: 8,
        }}>
          <div style={{ height: 14, background: dp.surfaceHover, borderBottom: `1px solid ${dp.border}`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: dp.border }} />
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: dp.border, margin: '0 8px' }} />
          </div>
          <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '65%', borderRadius: 2, background: dp.border }} />
            <div style={{ height: 3, width: '45%', borderRadius: 2, background: dp.border, opacity: 0.5 }} />
            <div style={{ height: 3, width: '55%', borderRadius: 2, background: dp.border, opacity: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Social proof strip */}
      <div
        style={{
          padding: '10px 16px',
          background: dp.surface,
          borderBottom: `1px solid ${dp.border}`,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 7, color: dp.textFaint, fontFamily: dp.fontFamilyMono, letterSpacing: '0.1em' }}>TRUSTED BY</span>
        {logos.map((l) => (
          <span key={l} style={{ fontSize: 8.5, color: dp.textFaint, fontWeight: 600, fontFamily: dp.fontFamily }}>{l}</span>
        ))}
      </div>

      {/* Features section */}
      <div style={{ padding: '20px 14px', borderBottom: `1px solid ${dp.border}` }}>
        <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Everything you need
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {features.map(({ label, sub }) => (
            <div key={label} style={{ ...card(dp), padding: '10px' }}>
              <div style={{
                width: 14, height: 14, borderRadius: dp.radiusSm,
                background: dp.primaryGradient ?? dp.primarySubtle,
                border: `1px solid ${dp.primaryBorder}`,
                marginBottom: 6,
              }} />
              <div style={{ fontSize: 9, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 2, fontFamily: dp.fontFamily }}>{label}</div>
              <div style={{ fontSize: 8, color: dp.textMuted, fontFamily: dp.fontFamily }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '16px 14px', background: dp.surface, borderBottom: `1px solid ${dp.border}` }}>
        <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          What teams are saying
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {testimonials.map(({ quote, author, role }) => (
            <div key={author} style={{ ...card(dp), padding: '10px' }}>
              <div style={{ fontSize: 8.5, color: dp.textMuted, lineHeight: 1.5, marginBottom: 8, fontFamily: dp.fontFamily, fontStyle: 'italic' }}>
                &ldquo;{quote}&rdquo;
              </div>
              <div style={{ fontSize: 8, fontWeight: 600, color: dp.text, fontFamily: dp.fontFamily }}>{author}</div>
              <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamily }}>{role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          borderBottom: `1px solid ${dp.border}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
          Ready to get started?
        </div>
        <div style={{ fontSize: 9, color: dp.textMuted, fontFamily: dp.fontFamily }}>
          Join hundreds of teams already using {name}.
        </div>
        <div
          style={{ ...btn(dp, { primary: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
          onClick={onNavigatePrimary}
        >
          {hero?.cta ?? 'Start free →'}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          background: dp.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>© 2026 {name}</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <span key={l} style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>{l}</span>
          ))}
        </div>
      </div>

    </div>
  )
}
