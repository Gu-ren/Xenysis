export interface NavItem {
  id: string
  label: string
}

export interface OverviewStat {
  label: string
  value: string
}

export interface Persona {
  initials: string
  name: string
  role: string
  goals: string
  frustrations: string
  successMetric: string
}

export interface Requirement {
  id: string
  title: string
  items: string[]
  isOpen: boolean
}

export interface RoadmapPhase {
  phase: string
  name: string
  time: string
  tasks: string
  active: boolean
}

export interface RiskGroup {
  type: string
  color: string
  items: string[]
}

export interface Metric {
  label: string
  val: number
  color: string
}

export interface SolutionStep {
  n: string
  t: string
}

export interface CustomerCard {
  label: string
  value: string
}

export interface PricingTier {
  key: string
  label: string
  price: string
  features: string[]
  highlighted: boolean
}
