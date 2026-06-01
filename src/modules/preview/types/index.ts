import type { WorkspaceAsset } from '@/modules/workspace/types'

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

// A navigation target resolved from a navigates-to connector.
export interface NavigationTarget {
  id: string
  label: string
  assetType: string
}

// A single screen in the founder journey.
export interface JourneyScreen {
  asset: WorkspaceAsset
  depth: number
  nextScreenIds: string[]
  prevScreenIds: string[]
  isRoot: boolean
  isLeaf: boolean
}

// The full derived journey for a startup.
// screens is ordered by BFS traversal (user journey order).
// screenMap is keyed by asset.id for O(1) lookups.
export interface StartupJourney {
  screens: JourneyScreen[]
  screenMap: Map<string, JourneyScreen>
}

// ── Design profile ────────────────────────────────────────────────────────────

export type VisualStyle =
  | 'modern-saas'
  | 'healthcare'
  | 'fintech'
  | 'creator'
  | 'marketplace'
  | 'developer-tool'
  | 'ai-product'

export interface DesignProfile {
  visualStyle: VisualStyle
  colorMode: 'light' | 'dark'

  // Brand color
  primary: string
  primaryFg: string              // text drawn on top of primary bg
  primaryGradient?: string       // optional gradient (creator / ai)
  primarySubtle: string          // 8-10 % tint for badges / active rows
  primaryBorder: string          // border in the primary hue

  // Surfaces
  background: string             // page / viewport bg
  surface: string                // card / panel bg
  surfaceHover: string           // hovered / alt row bg

  // Dividers
  border: string                 // default divider
  borderStrong: string           // stronger divider

  // Typography colors
  text: string
  textMuted: string
  textFaint: string

  // Typography style
  fontFamily: string
  fontFamilyMono: string
  fontWeightBold: number

  // Shape tokens (px)
  radius: number
  radiusSm: number
  radiusLg: number
  radiusFull: number

  // Layout density
  density: 'compact' | 'normal' | 'spacious'

  // Effects
  shadow: string
  glowPrimary: string

  // Nav layout hint
  navPattern: 'sidebar-icon' | 'sidebar-full' | 'topnav'

  // Semantic colors
  success: string
  warning: string
  danger: string
}

// ── Startup-specific preview context ─────────────────────────────────────────

export type StartupCategory =
  | 'saas'
  | 'marketplace'
  | 'healthcare'
  | 'fintech'
  | 'ecommerce'
  | 'developer-tool'
  | 'ai-tool'
  | 'social'

export interface StartupFeature {
  label: string
  sub: string
}

export interface StartupNavItem {
  icon: string
  label: string
}

export interface StartupMetric {
  label: string
  value: string
  delta: string
  up: boolean
}

export interface StartupEntityField {
  field: string
  type: string
  note?: string
}

export interface StartupEntity {
  name: string
  fields: StartupEntityField[]
}

export interface StartupApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  summary: string
  requestExample?: string
  responseExample?: string
}

export interface StartupPreviewContext {
  name: string
  domain: string
  tagline: string
  category: StartupCategory
  designProfile: DesignProfile

  hero: {
    badge: string
    headline: string
    subheadline: string
    cta: string
    ctaSecondary: string
  }

  marketingNav: string[]
  features: StartupFeature[]

  appNav: StartupNavItem[]
  metrics: StartupMetric[]
  chartLabel: string

  entities: StartupEntity[]

  frontendModules: string[]
  backendServices: string[]
  externalIntegrations: string[]

  apiEndpoints: StartupApiEndpoint[]

  planNames: [string, string, string]
  planPrices: [string, string, string]
  planFeatures: { starter: string[]; pro: string[]; enterprise: string[] }
}
