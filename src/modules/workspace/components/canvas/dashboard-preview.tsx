import type { DesignProfile, StartupPreviewContext } from '@/modules/preview/types'
import { btn, card } from './preview-helpers'

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

export function DashboardPreview({
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

  const mainContent = (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

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

      <div style={{ padding: `0 ${pad}px ${isCompact ? 8 : 10}px` }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: dp.text, marginBottom: 6, fontFamily: dp.fontFamily }}>
          {tableConfig.label}
        </div>
        <div style={{ ...card(dp), overflow: 'hidden' }}>
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
