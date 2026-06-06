import type { DesignProfile } from '@/modules/preview/types'
import type { WorkspaceAsset } from '../../types'

export function GenericPreview({ dp, asset }: { dp: DesignProfile; asset: WorkspaceAsset }) {
  return (
    <div style={{
      background: dp.background,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 20,
      textAlign: 'center',
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: dp.radiusLg,
        background: dp.primarySubtle,
        border: `1px solid ${dp.primaryBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        ◈
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 4, fontFamily: dp.fontFamily }}>
          {asset.title}
        </div>
        <div style={{ fontSize: 9.5, color: dp.textMuted, lineHeight: 1.5, fontFamily: dp.fontFamily }}>
          {asset.purpose}
        </div>
      </div>
    </div>
  )
}
