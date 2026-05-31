'use client'

import type { WorkspaceAsset } from '../types'
import type { NavigationTarget, StartupPreviewContext, DesignProfile } from '@/modules/preview/types'

interface AssetPreviewCanvasProps {
  asset: WorkspaceAsset
  navigatesTo?: NavigationTarget[]
  onNavigate?: (id: string) => void
  ctx?: StartupPreviewContext | null
}

// ── Fallback profile (Xenysis dark) used only when no ctx is present ──────────

const FALLBACK_DP: DesignProfile = {
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

// ── Shell ──────────────────────────────────────────────────────────────────────

export function AssetPreviewCanvas({ asset, navigatesTo = [], onNavigate, ctx }: AssetPreviewCanvasProps) {
  const dp     = ctx?.designProfile ?? FALLBACK_DP
  const domain = ctx?.domain ?? 'app.yourapp.com'
  const hasRoute = Boolean(asset.route)

  return (
    <div className="flex flex-col h-full" style={{ background: '#080808', fontFamily: dp.fontFamily }}>
      {/* Browser chrome — always Xenysis-dark, represents the browser not the startup */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ height: 32, borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0d0d0d' }}
      >
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(239,68,68,0.5)' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.4)' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(79,250,176,0.4)' }} />
        </div>
        {hasRoute && (
          <div
            className="flex-1 flex items-center px-2 rounded"
            style={{ height: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span style={{ fontSize: 9, fontFamily: 'var(--font-geist-mono, monospace)', color: 'rgba(161,161,170,0.5)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {domain}{asset.route}
            </span>
          </div>
        )}
      </div>

      {/* Generated startup UI — everything below is governed by DesignProfile */}
      <div className="flex-1 overflow-hidden relative" style={{ background: dp.background, fontFamily: dp.fontFamily }}>
        <PreviewContent asset={asset} dp={dp} ctx={ctx} navigatesTo={navigatesTo} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

// ── Dispatcher ─────────────────────────────────────────────────────────────────

interface ContentProps {
  asset: WorkspaceAsset
  dp: DesignProfile
  ctx?: StartupPreviewContext | null
  navigatesTo: NavigationTarget[]
  onNavigate?: (id: string) => void
}

function PreviewContent({ asset, dp, ctx, navigatesTo, onNavigate }: ContentProps) {
  const { assetType, nodeType } = asset
  const primary   = navigatesTo[0]
  const secondary = navigatesTo[1]
  const byType    = (t: string) => navigatesTo.find((n) => n.assetType === t)
  const nav       = (target: NavigationTarget | undefined) =>
    target && onNavigate ? () => onNavigate(target.id) : undefined

  if (nodeType === 'page') {
    if (assetType === 'marketing') {
      return <LandingPreview dp={dp} ctx={ctx} onNavigatePrimary={nav(primary)} onNavigateSecondary={nav(secondary)} />
    }
    if (assetType === 'auth') {
      return <AuthPreview dp={dp} ctx={ctx} isSignup={asset.id === 'signup'} onNavigatePrimary={nav(primary)} />
    }
    if (assetType === 'core') {
      return <DashboardPreview dp={dp} ctx={ctx} onNavigatePricing={nav(byType('billing'))} onNavigateSettings={nav(byType('settings'))} />
    }
    if (assetType === 'billing')  return <PricingPreview dp={dp} ctx={ctx} />
    if (assetType === 'settings') return <SettingsPreview dp={dp} ctx={ctx} />
  }

  if (nodeType === 'database')    return <DataModelPreview dp={dp} ctx={ctx} asset={asset} />
  if (nodeType === 'system')      return <SystemDesignPreview dp={dp} ctx={ctx} asset={asset} />
  if (nodeType === 'api')         return <ApiSurfacePreview dp={dp} ctx={ctx} asset={asset} />
  if (nodeType === 'workflow')    return <WorkflowPreview dp={dp} ctx={ctx} asset={asset} />
  if (nodeType === 'integration') return <IntegrationPreview dp={dp} ctx={ctx} asset={asset} />

  return <GenericPreview dp={dp} asset={asset} />
}

// ── Style helpers (no Xenysis tokens) ─────────────────────────────────────────

function btn(dp: DesignProfile, opts: { primary?: boolean; sm?: boolean } = {}) {
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

function card(dp: DesignProfile, opts: { accent?: boolean; hover?: boolean } = {}) {
  return {
    background: opts.hover ? dp.surfaceHover : dp.surface,
    border: opts.accent ? `1px solid ${dp.primaryBorder}` : `1px solid ${dp.border}`,
    borderRadius: dp.radiusLg,
    boxShadow: dp.shadow,
  }
}

function badge(dp: DesignProfile) {
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

// ── Landing page ───────────────────────────────────────────────────────────────

function LandingPreview({
  dp, ctx, onNavigatePrimary, onNavigateSecondary,
}: {
  dp: DesignProfile
  ctx?: StartupPreviewContext | null
  onNavigatePrimary?: () => void
  onNavigateSecondary?: () => void
}) {
  const name     = ctx?.name ?? 'YourApp'
  const navItems = ctx?.marketingNav ?? ['Features', 'Pricing', 'Docs']
  const hero     = ctx?.hero
  const features = ctx?.features ?? [
    { label: 'Core Module', sub: 'Generated blueprint' },
    { label: 'Data Layer', sub: 'Schema + migrations' },
    { label: 'Deployments', sub: 'One-click deploy' },
  ]

  const isCreator = dp.visualStyle === 'creator'
  const isDevTool = dp.visualStyle === 'developer-tool'
  const isMono    = isDevTool

  const logos = ['Acme Corp', 'BuildFast', 'NexusCo', 'Orbit Inc']
  const testimonials = [
    { quote: 'Transformed how our team manages the entire pipeline.', author: 'Sarah K.', role: 'Operations Lead' },
    { quote: 'Cut our time-to-close by 40% in the first quarter.', author: 'Marcus T.', role: 'Sales Director' },
  ]

  return (
    // Scrollable document — sticky navbar + stacked sections of natural height
    <div style={{ background: dp.background, height: '100%', overflowY: 'auto' }}>

      {/* Sticky navbar */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 36,
          background: dp.surface,
          borderBottom: `1px solid ${dp.border}`,
          boxShadow: dp.colorMode === 'light' ? dp.shadow : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: dp.radiusSm, background: isCreator ? (dp.primaryGradient ?? dp.primary) : dp.primary }} />
          <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {navItems.map((l) => (
            <span key={l} style={{ fontSize: 9, color: dp.textMuted, fontFamily: dp.fontFamily }}>{l}</span>
          ))}
          <div
            style={{ ...btn(dp, { primary: true, sm: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
            onClick={onNavigatePrimary}
          >
            {isDevTool ? 'Install' : isCreator ? 'Join now' : 'Sign up'}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: '36px 24px 28px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${dp.border}`,
        }}
      >
        <div style={badge(dp)}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dp.primary }} />
          {hero?.badge ?? 'Phase 1 complete'}
        </div>
        <div style={{
          fontSize: isCreator ? 24 : 20,
          fontWeight: dp.fontWeightBold,
          color: dp.text,
          lineHeight: 1.15,
          whiteSpace: 'pre-line',
          fontFamily: isMono ? dp.fontFamilyMono : dp.fontFamily,
          letterSpacing: isCreator ? '-0.03em' : isDevTool ? '0.01em' : '-0.01em',
          maxWidth: 300,
        }}>
          {hero?.headline ?? `${name}.`}
        </div>
        <div style={{ fontSize: 10, color: dp.textMuted, lineHeight: 1.6, maxWidth: 230, fontFamily: dp.fontFamily }}>
          {hero?.subheadline ?? 'Your generated product is ready.'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{ ...btn(dp, { primary: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
            onClick={onNavigatePrimary}
          >
            {hero?.cta ?? 'Get started →'}
          </div>
          {onNavigateSecondary ? (
            <div style={{ ...btn(dp), cursor: 'pointer' }} onClick={onNavigateSecondary}>Sign in</div>
          ) : (
            <div style={btn(dp)}>{hero?.ctaSecondary ?? 'Learn more'}</div>
          )}
        </div>

        {/* Abstract app mockup */}
        <div style={{
          width: '90%', maxWidth: 300,
          borderRadius: dp.radius,
          border: `1px solid ${dp.border}`,
          background: dp.surface,
          overflow: 'hidden',
          marginTop: 8,
        }}>
          <div style={{ height: 14, background: dp.surfaceHover, borderBottom: `1px solid ${dp.border}`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: dp.border }} />
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: dp.border, margin: '0 8px' }} />
          </div>
          <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, width: '65%', borderRadius: 2, background: dp.border }} />
            <div style={{ height: 3, width: '45%', borderRadius: 2, background: dp.border, opacity: 0.5 }} />
            <div style={{ height: 3, width: '55%', borderRadius: 2, background: dp.border, opacity: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Social proof strip */}
      <div
        style={{
          padding: '10px 16px',
          background: dp.surface,
          borderBottom: `1px solid ${dp.border}`,
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 7, color: dp.textFaint, fontFamily: dp.fontFamilyMono, letterSpacing: '0.1em' }}>TRUSTED BY</span>
        {logos.map((l) => (
          <span key={l} style={{ fontSize: 8.5, color: dp.textFaint, fontWeight: 600, fontFamily: dp.fontFamily }}>{l}</span>
        ))}
      </div>

      {/* Features section */}
      <div style={{ padding: '20px 14px', borderBottom: `1px solid ${dp.border}` }}>
        <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Everything you need
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {features.map(({ label, sub }) => (
            <div key={label} style={{ ...card(dp), padding: '10px' }}>
              <div style={{
                width: 14, height: 14, borderRadius: dp.radiusSm,
                background: dp.primaryGradient ?? dp.primarySubtle,
                border: `1px solid ${dp.primaryBorder}`,
                marginBottom: 6,
              }} />
              <div style={{ fontSize: 9, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 2, fontFamily: dp.fontFamily }}>{label}</div>
              <div style={{ fontSize: 8, color: dp.textMuted, fontFamily: dp.fontFamily }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '16px 14px', background: dp.surface, borderBottom: `1px solid ${dp.border}` }}>
        <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          What teams are saying
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {testimonials.map(({ quote, author, role }) => (
            <div key={author} style={{ ...card(dp), padding: '10px' }}>
              <div style={{ fontSize: 8.5, color: dp.textMuted, lineHeight: 1.5, marginBottom: 8, fontFamily: dp.fontFamily, fontStyle: 'italic' }}>
                &ldquo;{quote}&rdquo;
              </div>
              <div style={{ fontSize: 8, fontWeight: 600, color: dp.text, fontFamily: dp.fontFamily }}>{author}</div>
              <div style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamily }}>{role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          borderBottom: `1px solid ${dp.border}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
          Ready to get started?
        </div>
        <div style={{ fontSize: 9, color: dp.textMuted, fontFamily: dp.fontFamily }}>
          Join hundreds of teams already using {name}.
        </div>
        <div
          style={{ ...btn(dp, { primary: true }), cursor: onNavigatePrimary ? 'pointer' : 'default' }}
          onClick={onNavigatePrimary}
        >
          {hero?.cta ?? 'Start free →'}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          background: dp.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>© 2026 {name}</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <span key={l} style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>{l}</span>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Auth ───────────────────────────────────────────────────────────────────────

function AuthPreview({
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
            {/* Divider */}
            <div className="flex items-center gap-2" style={{ margin: '10px 0' }}>
              <div style={{ flex: 1, height: 1, background: dp.border }} />
              <span style={{ fontSize: 8, color: dp.textFaint }}>or</span>
              <div style={{ flex: 1, height: 1, background: dp.border }} />
            </div>

            {/* OAuth */}
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

// ── Dashboard ──────────────────────────────────────────────────────────────────

// ── Dashboard data helpers ─────────────────────────────────────────────────────

type TableConfig = { label: string; columns: string[]; rows: string[][] }
type ActivityItem = { time: string; event: string; detail: string }

function getTableConfig(ctx: StartupPreviewContext | null | undefined): TableConfig {
  const corpus = [
    ...(ctx?.appNav?.map((n) => n.label) ?? []),
    ...(ctx?.metrics?.map((m) => m.label) ?? []),
  ].join(' ').toLowerCase()

  if (/lead/.test(corpus)) return {
    label: 'Recent Leads',
    columns: ['NAME', 'STATUS', 'SOURCE', 'VALUE', 'AGENT'],
    rows: [
      ['John Smith',     'Contacted', 'Website',    '$450k', 'A. Chen'],
      ['Sarah Williams', 'New',       'Referral',   '$680k', 'T. Lee'],
      ['Michael Brown',  'Qualified', 'LinkedIn',   '$320k', 'A. Chen'],
      ['Emma Johnson',   'Proposal',  'Website',    '$890k', 'R. Kim'],
      ['David Martinez', 'New',       'Cold reach', '$230k', 'T. Lee'],
    ],
  }

  if (/propert|listing/.test(corpus)) return {
    label: 'Active Listings',
    columns: ['ADDRESS', 'STATUS', 'PRICE', 'TYPE', 'AGENT'],
    rows: [
      ['123 Oak Ave',  'Active',      '$850k', '4BR', 'A. Chen'],
      ['456 Pine St',  'Under Offer', '$1.2M', '5BR', 'T. Lee'],
      ['789 Elm Rd',   'Active',      '$620k', '3BR', 'R. Kim'],
      ['321 Maple Dr', 'Active',      '$975k', '4BR', 'A. Chen'],
      ['654 Cedar Ln', 'Sold',        '$740k', '3BR', 'T. Lee'],
    ],
  }

  if (/order/.test(corpus)) return {
    label: 'Recent Orders',
    columns: ['ORDER', 'CUSTOMER', 'AMOUNT', 'STATUS', 'DATE'],
    rows: [
      ['#4821', 'Apex LLC',  '$2,400', 'Completed', 'May 30'],
      ['#4820', 'BuildCo',   '$890',   'Processing','May 29'],
      ['#4819', 'NexusCorp', '$3,200', 'Completed', 'May 28'],
      ['#4818', 'Orbit Inc', '$650',   'Pending',   'May 27'],
      ['#4817', 'FastBuild', '$1,875', 'Completed', 'May 26'],
    ],
  }

  if (/patient/.test(corpus)) return {
    label: 'Recent Patients',
    columns: ['NAME', 'MRN', 'STATUS', 'NEXT APPT', 'PROVIDER'],
    rows: [
      ['Sarah Chen',   'MRN-0042', 'Active',   'Jun 2', 'Dr. Patel'],
      ['James Wilson', 'MRN-0041', 'New',      'Jun 5', 'Dr. Kim'],
      ['Maria Lopez',  'MRN-0040', 'Active',   'Jun 1', 'Dr. Patel'],
      ['Robert Brown', 'MRN-0039', 'Active',   'Jun 8', 'Dr. Lee'],
      ['Emily Davis',  'MRN-0038', 'Inactive', '—',     'Dr. Kim'],
    ],
  }

  if (/client|customer/.test(corpus)) return {
    label: 'Recent Clients',
    columns: ['NAME', 'STATUS', 'LAST CONTACT', 'AGENT'],
    rows: [
      ['Apex Corp',     'Active',  '2 days ago', 'A. Chen'],
      ['BuildFast LLC', 'Active',  'Today',      'T. Lee'],
      ['Nexus Inc',     'At risk', '3 weeks ago','R. Kim'],
      ['Orbit Co',      'Active',  'Yesterday',  'A. Chen'],
      ['FastGroup',     'New',     '1 day ago',  'T. Lee'],
    ],
  }

  return {
    label: 'Recent Items',
    columns: ['ITEM', 'STATUS', 'UPDATED', 'OWNER'],
    rows: [
      ['Q2 Launch Campaign', 'Active',    '2h ago', 'Jane F.'],
      ['API Integration',    'In Review', '1d ago', 'Tom K.'],
      ['User Research',      'Completed', '3d ago', 'Alice M.'],
      ['Dashboard Redesign', 'Active',    '1h ago', 'Jane F.'],
      ['Email Templates',    'Draft',     '5d ago', 'Tom K.'],
    ],
  }
}

function getActivityItems(ctx: StartupPreviewContext | null | undefined): ActivityItem[] {
  const corpus = [
    ...(ctx?.appNav?.map((n) => n.label) ?? []),
    ...(ctx?.metrics?.map((m) => m.label) ?? []),
  ].join(' ').toLowerCase()

  if (/lead/.test(corpus)) return [
    { time: '2m ago',  event: 'New lead',      detail: 'Emma J. via website contact form' },
    { time: '18m ago', event: 'Lead updated',   detail: 'Michael B. moved to Qualified' },
    { time: '1h ago',  event: 'Meeting booked', detail: 'Sarah W. — demo call scheduled' },
    { time: '3h ago',  event: 'Deal closed',    detail: 'Robert H. signed — $450k' },
  ]

  if (/propert|listing/.test(corpus)) return [
    { time: '4m ago',  event: 'New listing',    detail: '321 Maple Dr listed at $975k' },
    { time: '22m ago', event: 'Offer received', detail: '456 Pine St — $1.15M offer' },
    { time: '2h ago',  event: 'Showing booked', detail: '123 Oak Ave — 3pm Saturday' },
    { time: '5h ago',  event: 'Property sold',  detail: '654 Cedar Ln closed at $740k' },
  ]

  if (/order/.test(corpus)) return [
    { time: '3m ago',  event: 'Order placed',     detail: 'Orbit Inc — $650 · 2 items' },
    { time: '45m ago', event: 'Payment received', detail: 'Apex LLC — $2,400 confirmed' },
    { time: '2h ago',  event: 'Order shipped',    detail: '#4819 dispatched to NexusCorp' },
    { time: '4h ago',  event: 'Refund processed', detail: '#4815 — $180 returned' },
  ]

  if (/patient/.test(corpus)) return [
    { time: '5m ago',  event: 'Appt booked',   detail: 'Sarah Chen — Dr. Patel, Jun 2' },
    { time: '30m ago', event: 'New patient',    detail: 'James Wilson registered' },
    { time: '2h ago',  event: 'Record updated', detail: 'Maria Lopez — labs attached' },
    { time: '4h ago',  event: 'Invoice sent',   detail: 'Robert Brown — $1,200' },
  ]

  if (/client|customer/.test(corpus)) return [
    { time: '8m ago',  event: 'Client added',   detail: 'FastGroup onboarded' },
    { time: '40m ago', event: 'Note added',      detail: 'Apex Corp — Q3 renewal discussed' },
    { time: '2h ago',  event: 'Meeting logged',  detail: 'BuildFast LLC — 45 min call' },
    { time: '5h ago',  event: 'Contract signed', detail: 'Nexus Inc — $24k ARR' },
  ]

  return [
    { time: '5m ago',  event: 'Project created', detail: 'Q2 Launch Campaign — 4 tasks' },
    { time: '32m ago', event: 'Task completed',  detail: 'API Integration v2 merged' },
    { time: '1h ago',  event: 'New member',      detail: 'alice@company.com joined' },
    { time: '4h ago',  event: 'Report exported', detail: 'Monthly summary — 18 pages' },
  ]
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function DashboardPreview({
  dp, ctx, onNavigatePricing, onNavigateSettings,
}: {
  dp: DesignProfile
  ctx?: StartupPreviewContext | null
  onNavigatePricing?: () => void
  onNavigateSettings?: () => void
}) {
  const name       = ctx?.name ?? 'App'
  const chartLabel = ctx?.chartLabel ?? 'Revenue'
  const metrics    = ctx?.metrics ?? [
    { label: 'MRR',   value: '$12.4k', delta: '+18%',  up: true },
    { label: 'Users', value: '847',    delta: '+34',   up: true },
    { label: 'Churn', value: '2.1%',   delta: '-0.3%', up: false },
  ]
  const rawNav = ctx?.appNav ?? [
    { icon: '⊞', label: 'Overview' },
    { icon: '◇', label: 'Analytics' },
    { icon: '⊙', label: 'Activity' },
    { icon: '♦', label: 'Settings' },
  ]

  const navItems = rawNav.map((item, i) => ({
    ...item,
    active:  i === 0,
    onClick: i === rawNav.length - 1 ? onNavigateSettings : i === 1 ? onNavigatePricing : undefined,
  }))

  const isTopNav      = dp.navPattern === 'topnav'
  const isSidebarFull = dp.navPattern === 'sidebar-full'
  const isCompact     = dp.density === 'compact'
  const pad           = isCompact ? 12 : 14

  const tableConfig   = getTableConfig(ctx)
  const activityItems = getActivityItems(ctx)
  const gridCols      = `repeat(${tableConfig.columns.length}, 1fr)`

  // Scrollable main — sticky page header keeps orientation while content scrolls
  const mainContent = (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Topnav (marketplace / creator pattern) */}
      {isTopNav && (
        <div
          style={{
            position: 'sticky', top: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 14px', height: 38,
            background: dp.surface,
            borderBottom: `1px solid ${dp.border}`,
            boxShadow: dp.colorMode === 'light' ? dp.shadow : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: dp.radiusSm, background: dp.primaryGradient ?? dp.primary }} />
            <span style={{ fontSize: 11, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>{name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {navItems.map(({ label, active, onClick }) => (
              <span key={label} onClick={onClick} style={{
                fontSize: 9, fontFamily: dp.fontFamily, cursor: onClick ? 'pointer' : 'default',
                color: active ? dp.primary : dp.textMuted,
                fontWeight: active ? dp.fontWeightBold : 400,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sticky page header */}
      <div
        style={{
          position: 'sticky', top: isTopNav ? 38 : 0, zIndex: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `0 ${pad}px`,
          height: isCompact ? 36 : 40,
          background: dp.surface,
          borderBottom: `1px solid ${dp.border}`,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>Overview</div>
          <div style={{ fontSize: 8, color: dp.textFaint, fontFamily: dp.fontFamily }}>Last 30 days · {name}</div>
        </div>
        <div style={{ ...btn(dp, { primary: true, sm: true }), gap: 4 }}>+ New</div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: `${isCompact ? 8 : 10}px ${pad}px ${isCompact ? 6 : 8}px` }}>
        {metrics.map(({ label, value, delta, up }) => (
          <div key={label} style={{ ...card(dp), padding: isCompact ? '8px 10px' : '10px 12px' }}>
            <div style={{ fontSize: 7, color: dp.textFaint, marginBottom: 4, fontFamily: dp.fontFamily, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </div>
            <div style={{ fontSize: 15, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 2, fontFamily: dp.fontFamily }}>{value}</div>
            <div style={{ fontSize: 8, color: up ? dp.success : dp.danger, fontFamily: dp.fontFamily }}>{delta}</div>
          </div>
        ))}
      </div>

      {/* Chart — fixed height, not stretched */}
      <div style={{ padding: `0 ${pad}px ${isCompact ? 8 : 10}px` }}>
        <div style={{ ...card(dp), overflow: 'hidden' }}>
          <div style={{ padding: isCompact ? '8px 10px 4px' : '10px 12px 4px', fontSize: 9, fontWeight: 600, color: dp.textMuted, fontFamily: dp.fontFamily }}>
            {chartLabel}
          </div>
          <svg width="100%" height="72" viewBox="0 0 280 72" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`cg-${dp.visualStyle}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dp.primary} stopOpacity="0.3" />
                <stop offset="100%" stopColor={dp.primary} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d="M0,56 C30,53 55,48 80,40 C105,32 125,38 150,28 C175,18 200,24 225,14 C250,4 265,9 280,5 L280,72 L0,72 Z"
              fill={`url(#cg-${dp.visualStyle})`}
            />
            <path
              d="M0,56 C30,53 55,48 80,40 C105,32 125,38 150,28 C175,18 200,24 225,14 C250,4 265,9 280,5"
              stroke={dp.primary} strokeWidth="1.5" fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Data table */}
      <div style={{ padding: `0 ${pad}px ${isCompact ? 8 : 10}px` }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: dp.text, marginBottom: 6, fontFamily: dp.fontFamily }}>
          {tableConfig.label}
        </div>
        <div style={{ ...card(dp), overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, padding: '5px 10px', borderBottom: `1px solid ${dp.border}`, background: dp.surface }}>
            {tableConfig.columns.map((col) => (
              <span key={col} style={{
                fontSize: 7, color: dp.textFaint, fontFamily: dp.fontFamilyMono,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
              }}>
                {col}
              </span>
            ))}
          </div>
          {/* Data rows */}
          {tableConfig.rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid', gridTemplateColumns: gridCols,
                padding: '6px 10px',
                borderBottom: i < tableConfig.rows.length - 1 ? `1px solid ${dp.border}` : 'none',
                background: i % 2 === 0 ? dp.surfaceHover : 'transparent',
              }}
            >
              {row.map((cell, j) => (
                <span key={j} style={{
                  fontSize: 8, fontFamily: dp.fontFamily,
                  color: j === 0 ? dp.text : dp.textMuted,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ padding: `0 ${pad}px ${pad}px` }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: dp.text, marginBottom: 6, fontFamily: dp.fontFamily }}>
          Recent Activity
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {activityItems.map(({ time, event, detail }, i) => (
            <div key={i} style={{ ...card(dp), padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: dp.primary, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 8.5, fontWeight: 600, color: dp.text, fontFamily: dp.fontFamily }}>{event}</div>
                <div style={{ fontSize: 8, color: dp.textMuted, fontFamily: dp.fontFamily, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {detail}
                </div>
              </div>
              <span style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: dp.background }}>

      {/* Sidebar — stays fixed while main content scrolls */}
      {!isTopNav && (
        <div
          style={{
            width: isSidebarFull ? 80 : 44,
            borderRight: `1px solid ${dp.border}`,
            background: dp.colorMode === 'light' ? dp.surface : dp.surfaceHover,
            flexShrink: 0,
            paddingTop: 10,
            paddingBottom: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isSidebarFull ? 'flex-start' : 'center',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: dp.radiusSm,
            background: dp.primaryGradient ?? dp.primary,
            margin: isSidebarFull ? '0 0 10px 10px' : '0 auto 10px',
          }} />
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 2, width: '100%',
            paddingLeft: isSidebarFull ? 6 : 0,
            paddingRight: isSidebarFull ? 6 : 0,
            alignItems: isSidebarFull ? 'flex-start' : 'center',
          }}>
            {navItems.map(({ icon, label, active, onClick }) => (
              <div
                key={label}
                title={label}
                onClick={onClick}
                style={{
                  width: isSidebarFull ? '100%' : 28,
                  height: 28,
                  borderRadius: dp.radius,
                  display: 'flex', alignItems: 'center',
                  gap: isSidebarFull ? 6 : 0,
                  justifyContent: isSidebarFull ? 'flex-start' : 'center',
                  paddingLeft: isSidebarFull ? 8 : 0,
                  background: active ? dp.primarySubtle : 'transparent',
                  border: active ? `1px solid ${dp.primaryBorder}` : '1px solid transparent',
                  color: active ? dp.primary : onClick ? dp.textMuted : dp.textFaint,
                  cursor: onClick ? 'pointer' : 'default',
                  fontFamily: dp.fontFamily,
                  fontWeight: active ? dp.fontWeightBold : 400,
                }}
              >
                <span style={{ fontSize: 12 }}>{icon}</span>
                {isSidebarFull && <span style={{ fontSize: 9 }}>{label}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {mainContent}

    </div>
  )
}

// ── Pricing ────────────────────────────────────────────────────────────────────

function PricingPreview({ dp, ctx }: { dp: DesignProfile; ctx?: StartupPreviewContext | null }) {
  const names    = ctx?.planNames    ?? ['Starter', 'Pro', 'Enterprise']
  const prices   = ctx?.planPrices   ?? ['Free', '$49', 'Custom']
  const feats    = ctx?.planFeatures ?? { starter: ['1 workspace'], pro: ['Unlimited', 'Priority support'], enterprise: ['Custom SLA'] }

  const plans = [
    { name: names[0], price: prices[0], period: prices[0] === 'Free' || prices[0] === '$0' ? 'free forever' : '/mo', features: feats.starter, pop: false },
    { name: names[1], price: prices[1], period: '/mo', features: feats.pro, pop: true },
    { name: names[2], price: prices[2], period: prices[2] === 'Custom' ? '— contact us' : '/mo', features: feats.enterprise, pop: false },
  ]

  return (
    <div
      className="flex flex-col items-center justify-center h-full px-4"
      style={{ background: dp.background, gap: 10 }}
    >
      <div style={{ fontSize: 14, fontWeight: dp.fontWeightBold, color: dp.text, fontFamily: dp.fontFamily }}>
        Simple, transparent pricing
      </div>
      <div style={{ fontSize: 9, color: dp.textMuted, marginBottom: 4, fontFamily: dp.fontFamily }}>
        Start free. Scale when you&apos;re ready.
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {plans.map(({ name, price, period, features, pop }) => (
          <div
            key={name}
            style={{
              ...card(dp, { accent: pop }),
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              background: pop ? dp.primarySubtle : dp.surface,
            }}
          >
            {pop && (
              <div style={{ ...badge(dp), marginBottom: 6, alignSelf: 'flex-start' }}>POPULAR</div>
            )}
            <div style={{ fontSize: 9, fontWeight: dp.fontWeightBold, color: dp.text, marginBottom: 2, fontFamily: dp.fontFamily }}>{name}</div>
            <div style={{ fontSize: 16, fontWeight: dp.fontWeightBold, color: pop ? dp.primary : dp.text, fontFamily: dp.fontFamily }}>{price}</div>
            <div style={{ fontSize: 7, color: dp.textFaint, marginBottom: 8, fontFamily: dp.fontFamily }}>{period}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                  <span style={{ fontSize: 7, color: pop ? dp.primary : dp.textMuted, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 7.5, color: dp.textMuted, lineHeight: 1.3, fontFamily: dp.fontFamily }}>{f}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                ...btn(dp, { primary: pop }),
                marginTop: 10,
                width: '100%',
                height: 24,
                fontSize: 8,
              }}
            >
              {pop ? 'Get started' : price === 'Custom' ? 'Contact sales' : 'Choose plan'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Settings ───────────────────────────────────────────────────────────────────

function SettingsPreview({ dp, ctx }: { dp: DesignProfile; ctx?: StartupPreviewContext | null }) {
  const domain   = ctx?.domain ?? 'yourapp.com'
  const sections = ['Profile', 'Billing', 'Security', 'Integrations', 'Team']

  return (
    <div className="flex h-full" style={{ background: dp.background }}>
      {/* Nav */}
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

      {/* Content */}
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

          {/* Avatar row */}
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

// ── Data Model ─────────────────────────────────────────────────────────────────

function DataModelPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
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
      {/* Header */}
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

      {/* Label */}
      <div style={{ padding: '8px 14px 4px', flexShrink: 0 }}>
        <span style={{ fontSize: 7.5, color: dp.textFaint, fontFamily: dp.fontFamilyMono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Core entities
        </span>
      </div>

      {/* Entity cards */}
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
            {/* Entity header */}
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
            {/* Fields */}
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

      {/* More entity pills */}
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

// ── System Design helpers (module-scope so React can reconcile them) ──────────

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

// ── System Design ──────────────────────────────────────────────────────────────

function SystemDesignPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const name         = ctx?.name ?? asset.title
  const frontend     = ctx?.frontendModules      ?? ['Dashboard', 'Auth', 'Settings']
  const backend      = ctx?.backendServices      ?? ['Auth Service', 'API Service']
  const integrations = ctx?.externalIntegrations ?? ['Stripe', 'Resend']
  const isDevTool    = dp.visualStyle === 'developer-tool'

  // Conceptual layer colors (fixed semantic, not brand)
  const FRONTEND_COLOR     = '#60A5FA'   // blue (UI layer)
  const INTEGRATION_COLOR  = '#C084FC'   // purple (external)

  return (
    <div style={{ background: dp.background, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
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
        <Divider dp={dp} label={isDevTool ? 'SDK / Webhook' : 'SDK / Webhook'} />
        <Layer dp={dp} label="External integrations" items={integrations} color={INTEGRATION_COLOR} />

        {/* Status */}
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

// ── API Surface ────────────────────────────────────────────────────────────────

function ApiSurfacePreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const endpoints = ctx?.apiEndpoints ?? []
  const isDevTool = dp.visualStyle === 'developer-tool'

  // Fixed semantic method colors
  const METHOD_COLOR: Record<string, string> = {
    GET:    '#22C55E',
    POST:   '#60A5FA',
    PUT:    '#F59E0B',
    PATCH:  '#C084FC',
    DELETE: '#EF4444',
  }

  return (
    <div style={{ background: dp.background, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
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

// ── Workflow ───────────────────────────────────────────────────────────────────

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

function WorkflowPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
  const wf = WORKFLOW_STEPS[asset.id] ?? {
    trigger: 'event.triggered',
    steps: [{ icon: '▶', label: asset.title, sub: asset.description }],
  }

  return (
    <div style={{ background: dp.background, height: '100%', overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Trigger */}
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

      {/* Steps */}
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

// ── Integration ────────────────────────────────────────────────────────────────

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

function IntegrationPreview({ dp, ctx, asset }: { dp: DesignProfile; ctx?: StartupPreviewContext | null; asset: WorkspaceAsset }) {
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
        {/* Integration header */}
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

        {/* Warning banner */}
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

        {/* Fields */}
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

// ── Generic fallback ───────────────────────────────────────────────────────────

function GenericPreview({ dp, asset }: { dp: DesignProfile; asset: WorkspaceAsset }) {
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
