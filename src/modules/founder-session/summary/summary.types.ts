import type { ReactNode } from 'react'

export interface ConfidenceRow {
  label: string
  pct: number
}

export interface TrustSignalItem {
  icon: ReactNode
  text: string
}

export interface FoundationCategory {
  label: string
  items: string[]
}
