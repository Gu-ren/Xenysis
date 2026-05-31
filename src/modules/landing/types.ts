import type { ElementType } from "react"

export interface FeatureItem {
  icon: ElementType
  title: string
  description: string
}

export interface TestimonialItem {
  quote: string
  author: string
  role: string
}

export interface DialogueLine {
  id: string
  speaker: "ai" | "founder"
  text: string
}

export interface SystemNode {
  id: string
  label: string
  x: number
  y: number
  accent?: boolean
  dark?: boolean
}

export interface SystemEdge {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface DeployStep {
  label: string
  time: string
  active?: boolean
}

export interface PageCard {
  id: string
  name: string
  active: boolean
  delay: number
  lines: Array<{ width: string; accent: boolean }>
}

export interface FlowConnection {
  id: string
  fromId: string
  toId: string
  d: string
  length: number
  mint: boolean
  delay: number
  labelPct?: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  heading: string
  links: FooterLink[]
}
