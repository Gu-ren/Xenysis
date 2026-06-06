import type { DesignProfile } from '@/modules/preview/types'

export const FALLBACK_DP: DesignProfile = {
  visualStyle:   'modern-saas',
  colorMode:     'dark',
  primary:       '#4FFAB0',
  primaryFg:     '#000000',
  primarySubtle: 'rgba(79,250,176,0.1)',
  primaryBorder: 'rgba(79,250,176,0.2)',
  background:    '#0a0a0a',
  surface:       '#111111',
  surfaceHover:  '#171717',
  border:        'rgba(255,255,255,0.07)',
  borderStrong:  'rgba(255,255,255,0.14)',
  text:          '#FAFAFA',
  textMuted:     '#A1A1AA',
  textFaint:     '#52525B',
  fontFamily:    'var(--font-geist-sans, sans-serif)',
  fontFamilyMono:'var(--font-geist-mono, monospace)',
  fontWeightBold: 700,
  radius:        8,
  radiusSm:      4,
  radiusLg:      12,
  radiusFull:    999,
  density:       'normal',
  shadow:        'none',
  glowPrimary:   '0 0 0 2px rgba(79,250,176,0.2)',
  navPattern:    'sidebar-icon',
  success:       '#4FFAB0',
  warning:       '#F59E0B',
  danger:        '#EF4444',
}

export function btn(dp: DesignProfile, opts: { primary?: boolean; sm?: boolean } = {}) {
  const p = dp.density === 'compact' ? '5px 10px' : opts.sm ? '5px 10px' : '7px 14px'
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: p,
    borderRadius: dp.radius,
    fontSize: opts.sm ? 9 : 10,
    fontWeight: dp.fontWeightBold,
    cursor: 'default',
    userSelect: 'none' as const,
    ...(opts.primary
      ? {
          background: dp.primaryGradient ?? dp.primary,
          color: dp.primaryFg,
          border: 'none',
          boxShadow: dp.glowPrimary,
        }
      : {
          background: 'transparent',
          color: dp.text,
          border: `1px solid ${dp.border}`,
        }),
  }
}

export function card(dp: DesignProfile, opts: { accent?: boolean; hover?: boolean } = {}) {
  return {
    background: opts.hover ? dp.surfaceHover : dp.surface,
    border: opts.accent ? `1px solid ${dp.primaryBorder}` : `1px solid ${dp.border}`,
    borderRadius: dp.radiusLg,
    boxShadow: dp.shadow,
  }
}

export function badge(dp: DesignProfile) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: dp.radiusFull,
    background: dp.primarySubtle,
    border: `1px solid ${dp.primaryBorder}`,
    fontSize: 8,
    fontWeight: 600,
    color: dp.primary,
    fontFamily: dp.fontFamilyMono,
  }
}
