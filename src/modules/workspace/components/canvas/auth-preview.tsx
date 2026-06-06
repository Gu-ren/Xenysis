import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import { btn, card } from './preview-helpers'

export function AuthPreview({
  dp, ctx, isSignup, onNavigatePrimary,
}: {
  dp: DesignProfile
  ctx?: StartupPreviewContext | null
  isSignup: boolean
  onNavigatePrimary?: () => void
}) {
  const name    = ctx?.name ?? 'YourApp'
  const tagline = ctx?.tagline ?? 'Build better products.'
  const isDevTool = dp.visualStyle === 'developer-tool'

  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ background: dp.background }}
    >
      <div
        style={{
          width: 220,
          padding: 20,
          ...card(dp),
          borderRadius: dp.radiusLg,
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-1.5" style={{ marginBottom: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: dp.radiusSm, background: dp.primaryGradient ?? dp.primary }} />
          <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>{name}</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 15, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 3, fontFamily: dp.fontFamily }}>
          {isSignup ? 'Get started.' : 'Welcome back.'}
        </div>
        <div style={{ fontSize: 9, color: dp.textMuted, marginBottom: 14, fontFamily: dp.fontFamily }}>
          {isSignup ? tagline : `Sign in to ${name}.`}
        </div>

        {/* Fields */}
        <div className="flex flex-col" style={{ gap: 8, marginBottom: 10 }}>
          {['EMAIL', 'PASSWORD'].map((label) => (
            <div key={label}>
              <div style={{ fontSize: 8, color: dp.textFaint, marginBottom: 3, fontFamily: dp.fontFamilyMono, letterSpacing: '0.06em' }}>
                {label}
              </div>
              <div style={{
                height: 28,
                background: dp.surfaceHover,
                border: `1px solid ${dp.border}`,
                borderRadius: dp.radius,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
              }}>
                <span style={{ fontSize: 9, color: dp.textFaint, fontFamily: dp.fontFamily, letterSpacing: label === 'PASSWORD' ? 3 : 0 }}>
                  {label === 'PASSWORD' ? '••••••••' : 'you@company.com'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div
          style={{
            ...btn(dp, { primary: true }),
            width: '100%',
            height: 32,
            cursor: onNavigatePrimary ? 'pointer' : 'default',
          }}
          onClick={onNavigatePrimary}
        >
          {isSignup ? 'Create account →' : 'Sign in →'}
        </div>

        {!isDevTool && (
          <>
            <div className="flex items-center gap-2" style={{ margin: '10px 0' }}>
              <div style={{ flex: 1, height: 1, background: dp.border }} />
              <span style={{ fontSize: 8, color: dp.textFaint }}>or</span>
              <div style={{ flex: 1, height: 1, background: dp.border }} />
            </div>

            <div style={{
              height: 28,
              background: dp.surfaceHover,
              border: `1px solid ${dp.border}`,
              borderRadius: dp.radius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 9,
              fontWeight: 600,
              color: dp.textMuted,
              fontFamily: dp.fontFamily,
            }}>
              <svg viewBox="0 0 16 16" width={10} height={10} fill="none">
                <path d="M15.5 8.2c0-.6-.1-1.2-.2-1.7H8v3.3h4.2c-.2 1-.8 1.9-1.6 2.4v2h2.6c1.5-1.4 2.3-3.5 2.3-6z" fill="rgba(99,179,237,0.9)" />
                <path d="M8 16c2.2 0 4-.7 5.3-2L10.7 12c-.7.5-1.7.8-2.7.8-2.1 0-3.8-1.4-4.5-3.3H1v2.1C2.3 14.2 5 16 8 16z" fill="rgba(79,250,176,0.9)" />
                <path d="M3.5 9.5c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5V4.4H1A8 8 0 000 8c0 1.3.3 2.5.9 3.6l2.6-2.1z" fill="rgba(245,158,11,0.9)" />
                <path d="M8 3.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 .8 10.2 0 8 0 5 0 2.3 1.8 1 4.4l2.5 2.1C4.2 4.6 5.9 3.2 8 3.2z" fill="rgba(239,68,68,0.9)" />
              </svg>
              Continue with Google
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span style={{ color: dp.primary }}>{isSignup ? 'Sign in' : 'Sign up'}</span>
        </div>
      </div>
    </div>
  )
}
