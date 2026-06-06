import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'
import { card } from './preview-helpers'

const INTEGRATION_CONFIG: Record<string, { emoji: string; fields: { label: string; value: string; masked?: boolean }[]; docs: string }> = {
  'stripe-integration': {
    emoji: '💳',
    docs: 'docs.stripe.com/keys',
    fields: [
      { label: 'SECRET KEY',     value: 'sk_live_••••••••••••••••', masked: true },
      { label: 'WEBHOOK SECRET', value: 'whsec_••••••••••••••••',   masked: true },
      { label: 'WEBHOOK URL',    value: '/api/webhooks/stripe' },
    ],
  },
  'resend-integration': {
    emoji: '✉',
    docs: 'resend.com/docs',
    fields: [
      { label: 'API KEY',        value: 're_••••••••••••••••',       masked: true },
      { label: 'FROM EMAIL',     value: 'team@domain' },
      { label: 'SENDING DOMAIN', value: 'domain (unverified)' },
    ],
  },
}

export function IntegrationPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const domain = ctx?.domain ?? 'yourapp.com'
  const raw    = INTEGRATION_CONFIG[asset.id] ?? {
    emoji: '⚙',
    docs: 'docs.example.com',
    fields: [{ label: 'API KEY', value: '••••••••••••', masked: true }],
  }
  const cfg = {
    ...raw,
    fields: raw.fields.map((f) =>
      f.label === 'FROM EMAIL' ? { ...f, value: `team@${domain}` }
      : f.label === 'SENDING DOMAIN' ? { ...f, value: `${domain} (unverified)` }
      : f
    ),
  }

  return (
    <div style={{ background: dp.background, height: '100%', overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ ...card(dp), padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: dp.radius,
            background: dp.primarySubtle,
            border: `1px solid ${dp.primaryBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15,
          }}>
            {cfg.emoji}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>{asset.title}</div>
            <div style={{ fontSize: 8.5, color: dp.textMuted, fontFamily: dp.fontFamily }}>{asset.description}</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 26,
          padding: '0 10px',
          borderRadius: dp.radius,
          background: `${dp.warning}12`,
          border: `1px solid ${dp.warning}28`,
          marginBottom: 10,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dp.warning }} />
          <span style={{ fontSize: 8.5, color: dp.warning, fontFamily: dp.fontFamilyMono }}>
            Needs configuration — add API keys to activate
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cfg.fields.map(({ label, value, masked }) => (
            <div key={label}>
              <div style={{ fontSize: 7.5, color: dp.textFaint, marginBottom: 3, fontFamily: dp.fontFamilyMono, letterSpacing: '0.06em' }}>
                {label}
              </div>
              <div style={{
                height: 26,
                background: dp.surfaceHover,
                border: `1px solid ${dp.border}`,
                borderRadius: dp.radius,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 8px',
              }}>
                <span style={{ fontSize: 8.5, fontFamily: dp.fontFamilyMono, color: masked ? dp.textFaint : dp.textMuted }}>
                  {value}
                </span>
                {masked && (
                  <span style={{ fontSize: 7.5, color: dp.primary, fontFamily: dp.fontFamilyMono }}>Add key →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 30,
        padding: '0 10px',
        borderRadius: dp.radius,
        background: dp.surfaceHover,
        border: `1px solid ${dp.border}`,
        fontSize: 8.5,
        color: dp.textMuted,
        fontFamily: dp.fontFamily,
      }}>
        <span>📖</span>
        <span style={{ color: dp.primary }}>{cfg.docs}</span>
      </div>
    </div>
  )
}
