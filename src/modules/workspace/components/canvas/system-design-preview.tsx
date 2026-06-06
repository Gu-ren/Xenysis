import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'
import { badge } from './preview-helpers'

function Layer({ dp, label, items, color }: { dp: DesignProfile; label: string; items: string[]; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px',
              borderRadius: dp.radius,
              background: `${color}10`,
              border: `1px solid ${color}28`,
              fontSize: 9,
              color: dp.text,
              fontFamily: dp.fontFamily,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function Divider({ dp, label }: { dp: DesignProfile; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 12, height: 1, background: dp.border }} />
      <span style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: dp.border }} />
      <span style={{ fontSize: 9, color: dp.textFaint }}>↓</span>
    </div>
  )
}

export function SystemDesignPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const name         = ctx?.name ?? asset.title
  const frontend     = ctx?.frontendModules      ?? ['Dashboard', 'Auth', 'Settings']
  const backend      = ctx?.backendServices      ?? ['Auth Service', 'API Service']
  const integrations = ctx?.externalIntegrations ?? ['Stripe', 'Resend']
  const isDevTool    = dp.visualStyle === 'developer-tool'

  const FRONTEND_COLOR    = '#60A5FA'
  const INTEGRATION_COLOR = '#C084FC'

  return (
    <div style={{ background: dp.background, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: `1px solid ${dp.border}`,
        background: dp.surface,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
          {isDevTool ? 'Service Map' : 'System Architecture'}
        </span>
        <div style={badge(dp)}>{name}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <Layer dp={dp} label="Frontend modules" items={frontend} color={FRONTEND_COLOR} />
        <Divider dp={dp} label={isDevTool ? 'HTTP/gRPC' : 'REST / GraphQL'} />
        <Layer dp={dp} label="Backend services" items={backend} color={dp.primary} />
        <Divider dp={dp} label="SDK / Webhook" />
        <Layer dp={dp} label="External integrations" items={integrations} color={INTEGRATION_COLOR} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 4,
          padding: '8px 10px',
          borderRadius: dp.radius,
          background: `${dp.success}10`,
          border: `1px solid ${dp.success}28`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: dp.success }} />
          <span style={{ fontSize: 8.5, color: dp.success, fontFamily: dp.fontFamilyMono }}>
            {frontend.length + backend.length + integrations.length} components · architecture generated
          </span>
        </div>
      </div>
    </div>
  )
}
