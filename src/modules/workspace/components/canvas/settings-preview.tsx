import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import { btn } from './preview-helpers'

export function SettingsPreview({ dp, ctx }: { dp: DesignProfile; ctx?: StartupPreviewContext | null }) {
  const domain   = ctx?.domain ?? 'yourapp.com'
  const sections = ['Profile', 'Billing', 'Security', 'Integrations', 'Team']

  return (
    <div className="flex h-full" style={{ background: dp.background }}>
      <div
        style={{
          width: 88,
          borderRight: `1px solid ${dp.border}`,
          background: dp.colorMode === 'light' ? dp.surface : dp.surfaceHover,
          flexShrink: 0,
          padding: '10px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {sections.map((s, i) => (
          <div
            key={s}
            style={{
              padding: '5px 8px',
              borderRadius: dp.radius,
              background: i === 0 ? dp.primarySubtle : 'transparent',
              fontSize: 9,
              fontWeight: i === 0 ? dp.fontWeightBold : 400,
              color: i === 0 ? dp.primary : dp.textMuted,
              fontFamily: dp.fontFamily,
            }}
          >
            {s}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden' }}>
        <div style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 12, fontFamily: dp.fontFamily }}>
          Profile
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'FULL NAME', value: 'Jane Founder' },
            { label: 'EMAIL',     value: `jane@${domain}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 7.5, color: dp.textFaint, marginBottom: 3, fontFamily: dp.fontFamilyMono, letterSpacing: '0.06em' }}>
                {label}
              </div>
              <div style={{
                height: 26,
                background: dp.surfaceHover,
                border: `1px solid ${dp.border}`,
                borderRadius: dp.radius,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                fontSize: 9,
                color: dp.text,
                fontFamily: dp.fontFamily,
              }}>
                {value}
              </div>
            </div>
          ))}

          <div>
            <div style={{ fontSize: 7.5, color: dp.textFaint, marginBottom: 3, fontFamily: dp.fontFamilyMono, letterSpacing: '0.06em' }}>
              AVATAR
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: dp.radiusFull,
                background: dp.primarySubtle,
                border: `1px solid ${dp.primaryBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: dp.primary, fontWeight: dp.fontWeightBold, fontFamily: dp.fontFamily,
              }}>
                J
              </div>
              <div style={{ ...btn(dp, { sm: true }), fontSize: 8 }}>Upload photo</div>
            </div>
          </div>

          <div style={{
            ...btn(dp, { primary: true }),
            height: 28, fontSize: 9,
            width: '100%',
          }}>
            Save changes
          </div>
        </div>
      </div>
    </div>
  )
}
