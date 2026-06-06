import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'
import { card, badge } from './preview-helpers'

const METHOD_COLOR: Record<string, string> = {
  GET:    '#22C55E',
  POST:   '#60A5FA',
  PUT:    '#F59E0B',
  PATCH:  '#C084FC',
  DELETE: '#EF4444',
}

export function ApiSurfacePreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const endpoints = ctx?.apiEndpoints ?? []
  const isDevTool = dp.visualStyle === 'developer-tool'

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
          {isDevTool ? 'REST API' : 'API Surface'}
        </span>
        <div style={badge(dp)}>{endpoints.length} endpoints</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            style={{
              ...card(dp),
              padding: '8px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '1px 5px',
                borderRadius: dp.radiusSm,
                background: `${METHOD_COLOR[ep.method] ?? dp.primary}18`,
                fontSize: 7.5,
                fontWeight: 700,
                color: METHOD_COLOR[ep.method] ?? dp.primary,
                fontFamily: dp.fontFamilyMono,
                flexShrink: 0,
              }}>
                {ep.method}
              </span>
              <span style={{
                fontSize: 9,
                fontFamily: dp.fontFamilyMono,
                color: dp.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {ep.path}
              </span>
            </div>
            <div style={{ fontSize: 8, color: dp.textMuted, lineHeight: 1.4, fontFamily: dp.fontFamily }}>
              {ep.summary}
            </div>
            {ep.responseExample && (
              <div style={{
                padding: '4px 6px',
                borderRadius: dp.radiusSm,
                background: dp.surfaceHover,
                border: `1px solid ${dp.border}`,
              }}>
                <span style={{
                  fontSize: 7,
                  fontFamily: dp.fontFamilyMono,
                  color: dp.textFaint,
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  ← {ep.responseExample.slice(0, 55)}…
                </span>
              </div>
            )}
          </div>
        ))}

        {endpoints.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: dp.textFaint, fontFamily: dp.fontFamily }}>{asset.description}</span>
          </div>
        )}
      </div>
    </div>
  )
}
