import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'
import { card, badge } from './preview-helpers'

export function DataModelPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const entities = ctx?.entities
  const isDevTool = dp.visualStyle === 'developer-tool'

  if (!entities?.length) {
    return (
      <div style={{ background: dp.background, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${dp.border}`, background: dp.surface, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>Data Model</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, color: dp.textFaint, fontFamily: dp.fontFamily }}>{asset.description}</span>
        </div>
      </div>
    )
  }

  const visible = entities.slice(0, 3)

  return (
    <div style={{ background: dp.background, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: `1px solid ${dp.border}`,
        background: dp.surface,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
            Data Model
          </span>
          <span style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>· {entities.length} entities</span>
        </div>
        <div style={{ ...badge(dp) }}>
          {isDevTool ? 'schema.prisma' : 'prisma schema'}
        </div>
      </div>

      <div style={{ padding: '8px 14px 4px', flexShrink: 0 }}>
        <span style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Core entities
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', flex: 1, overflow: 'hidden' }}>
        {visible.map((entity) => (
          <div
            key={entity.name}
            style={{
              ...card(dp),
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 10px',
              borderBottom: `1px solid ${dp.border}`,
              background: dp.primarySubtle,
              flexShrink: 0,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: dp.radiusSm, background: dp.primary }} />
              <span style={{ fontSize: 9, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
                {entity.name}
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {entity.fields.map(({ field, type, note }, i) => {
                const isKey = note?.includes('@id')
                const isRel = type.endsWith('[]') || type.includes('@relation')
                return (
                  <div
                    key={field}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 8px',
                      background: i % 2 === 0 ? dp.surfaceHover : 'transparent',
                      borderBottom: `1px solid ${dp.border}`,
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
                      {isKey && <span style={{ fontSize: 7 }}>🔑</span>}
                      <span style={{
                        fontSize: 8.5,
                        fontFamily: dp.fontFamilyMono,
                        color: isRel ? '#A78BFA' : dp.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {field}
                      </span>
                    </div>
                    <span style={{ fontSize: 7.5, fontFamily: dp.fontFamilyMono, color: isRel ? '#A78BFA' : dp.primary, flexShrink: 0 }}>
                      {type.length > 9 ? type.slice(0, 9) + '…' : type}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {entities.length > 3 && (
        <div style={{ display: 'flex', gap: 4, padding: '0 14px 10px', flexShrink: 0 }}>
          {entities.slice(3).map((e) => (
            <div
              key={e.name}
              style={{
                padding: '2px 8px',
                borderRadius: dp.radiusFull,
                background: dp.surfaceHover,
                border: `1px solid ${dp.border}`,
                fontSize: 8,
                color: dp.textMuted,
                fontFamily: dp.fontFamily,
              }}
            >
              {e.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
