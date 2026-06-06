import type { ReactNode } from 'react'

export interface LabelValueRow {
  label: string
  value: string
}

export interface ConfidenceRow {
  label: string
  pct: number
}

export interface RiskItem {
  text: string
  severity: 'high' | 'medium'
}

export interface AssumptionItem {
  text: string
}

export interface TrustSignalItem {
  icon: ReactNode
  text: string
}

export interface WhyNowItem {
  text: string
}

export interface WhyWinItem {
  text: string
}

export interface FoundationCategory {
  label: string
  items: string[]
}

export interface MarketSizingCard {
  label: string
  abbr: string
  value: string
  description: string
}

export interface MarketSizingBasis {
  text: string
}

export interface LoaderChecklistItem {
  label: string
}
