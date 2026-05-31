import type { ZoneRect } from '../utils/layout'

interface ZoneLayerProps {
  zones: ZoneRect[]
}

export function ZoneLayer({ zones }: ZoneLayerProps) {
  return (
    <>
      {zones.map((zone) => (
        <div
          key={zone.id}
          style={{
            position: 'absolute',
            left: zone.x,
            top: zone.y,
            width: zone.w,
            height: zone.h,
            background: zone.color,
            border: `1px solid ${zone.borderColor}`,
            borderRadius: 12,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 14,
              fontSize: 8.5,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: 'rgba(255,255,255,0.20)',
              fontFamily: 'var(--font-mono)',
              userSelect: 'none',
              textTransform: 'uppercase',
            }}
          >
            {zone.label}
          </span>
        </div>
      ))}
    </>
  )
}
