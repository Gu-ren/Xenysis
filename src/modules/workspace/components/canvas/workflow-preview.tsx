import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'
import { card } from './preview-helpers'

const WORKFLOW_STEPS: Record<string, { trigger: string; steps: { icon: string; label: string; sub: string }[] }> = {
  'onboarding-workflow': {
    trigger: 'user.created',
    steps: [
      { icon: '✉', label: 'Send Welcome Email',       sub: 'via transactional email' },
      { icon: '⊞', label: 'Create Default Workspace',  sub: 'seed initial data' },
      { icon: '📅', label: 'Schedule Day-3 Nudge',    sub: 'queue follow-up' },
    ],
  },
  'payment-workflow': {
    trigger: 'stripe.webhook',
    steps: [
      { icon: '⟳', label: 'Sync Subscription', sub: 'update plan state' },
      { icon: '✉', label: 'Send Receipt',       sub: 'on payment success' },
      { icon: '⚠', label: 'Handle Failure',     sub: 'retry + notify' },
    ],
  },
  'nudge-workflow': {
    trigger: 'cron: 0 9 * * *',
    steps: [
      { icon: '🔍', label: 'Find Inactive Users', sub: 'day-7 + day-14' },
      { icon: '✉', label: 'Send Nudge Email',     sub: 'personalised copy' },
      { icon: '📊', label: 'Track Open Rate',     sub: 'log engagement' },
    ],
  },
}

export function WorkflowPreview({ dp, ctx: _ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const wf = WORKFLOW_STEPS[asset.id] ?? {
    trigger: 'event.triggered',
    steps: [{ icon: '▶', label: asset.title, sub: asset.description }],
  }

  return (
    <div style={{ background: dp.background, height: '100%', overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 7.5, color: dp.textFaint, marginBottom: 5, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Trigger
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 34,
          padding: '0 12px',
          borderRadius: dp.radius,
          background: dp.primarySubtle,
          border: `1px solid ${dp.primaryBorder}`,
        }}>
          <span style={{ fontSize: 12 }}>⚡</span>
          <span style={{ fontSize: 10, fontWeight: dp.fontWeightBold, color: dp.primary, fontFamily: dp.fontFamilyMono }}>
            {wf.trigger}
          </span>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 7.5, color: dp.textFaint, marginBottom: 5, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Steps
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {wf.steps.map(({ icon, label, sub }, i) => (
            <div key={label} style={{ position: 'relative' }}>
              {i < wf.steps.length - 1 && (
                <div style={{ position: 'absolute', left: 15, top: 34, width: 1, height: 8, background: dp.primaryBorder }} />
              )}
              <div style={{
                ...card(dp),
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                marginBottom: 8,
              }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: dp.radius,
                  background: dp.primarySubtle,
                  border: `1px solid ${dp.primaryBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: dp.text, fontFamily: dp.fontFamily }}>{label}</div>
                  <div style={{ fontSize: 8, color: dp.textMuted, fontFamily: dp.fontFamily }}>{sub}</div>
                </div>
                <div style={{
                  padding: '2px 6px',
                  borderRadius: dp.radiusSm,
                  background: `${dp.success}12`,
                  fontSize: 7,
                  fontWeight: 600,
                  color: dp.success,
                  fontFamily: dp.fontFamilyMono,
                }}>
                  ready
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
