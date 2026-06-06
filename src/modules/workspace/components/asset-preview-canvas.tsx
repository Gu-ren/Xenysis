'use client'

import type { WorkspaceAsset } from '../types'
import type { NavigationTarget, StartupPreviewContext } from '@/modules/preview/types'
import { FALLBACK_DP } from './canvas/preview-helpers'
import { LandingPreview } from './canvas/landing-preview'
import { AuthPreview } from './canvas/auth-preview'
import { DashboardPreview } from './canvas/dashboard-preview'
import { PricingPreview } from './canvas/pricing-preview'
import { SettingsPreview } from './canvas/settings-preview'
import { DataModelPreview } from './canvas/data-model-preview'
import { SystemDesignPreview } from './canvas/system-design-preview'
import { ApiSurfacePreview } from './canvas/api-surface-preview'
import { WorkflowPreview } from './canvas/workflow-preview'
import { IntegrationPreview } from './canvas/integration-preview'
import { GenericPreview } from './canvas/generic-preview'

interface AssetPreviewCanvasProps {
  asset: WorkspaceAsset
  navigatesTo?: NavigationTarget[]
  onNavigate?: (id: string) => void
  ctx?: StartupPreviewContext | null
}

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
  dp: ReturnType<typeof Object.assign> & typeof FALLBACK_DP
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
