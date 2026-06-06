import { Layout, Database, Lock, CreditCard, Cloud, Zap } from "lucide-react"
import type {
  FeatureItem,
  TestimonialItem,
  DialogueLine,
  SystemNode,
  SystemEdge,
  DeployStep,
  PageCard,
  FlowConnection,
  FooterSection,
} from "./types"

export const FEATURES: FeatureItem[] = [
  { icon: Layout, title: "Pages", description: "Multi-page product architecture with routing" },
  { icon: Database, title: "Database", description: "Schema designed around your business model" },
  { icon: Lock, title: "Auth", description: "User authentication and role management" },
  { icon: CreditCard, title: "Billing", description: "Stripe integration, plans, and invoices" },
  { icon: Cloud, title: "Deploy", description: "Zero-config CI/CD pipeline" },
  { icon: Zap, title: "Workflow", description: "Automated triggers and task logic" },
]

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "I stopped wasting weeks deciding what to build. Xenysis forced clarity before I wrote a single line.",
    author: "YC Applicant",
    role: "SOLO FOUNDER",
  },
  {
    quote: "It felt like having a technical cofounder who challenged every assumption.",
    author: "Bootstrapped Founder",
    role: "INDIE HACKER",
  },
  {
    quote: "Xenysis questioned my target user before I even asked. That alone saved me three months.",
    author: "First-Time Founder",
    role: "SOLO FOUNDER",
  },
]

export const DIALOGUE: DialogueLine[] = [
  { id: "q1", speaker: "ai", text: "Who are your target users and what problem do they face daily?" },
  { id: "a1", speaker: "founder", text: "I want to help remote teams run async standups with AI summaries." },
  { id: "q2", speaker: "ai", text: "What's your business model — subscription, usage-based, or marketplace?" },
  { id: "a2", speaker: "founder", text: "Team Management, Async Standup, AI Digest, Notifications." },
  {
    id: "q3",
    speaker: "ai",
    text: "Market fit validated. 3 comparable products found. Differentiation: AI-native, async-first.",
  },
]

export const SYSTEM_NODES: SystemNode[] = [
  { id: "founder", label: "FOUNDER SESSION", x: 44, y: 160 },
  { id: "system", label: "STARTUP BLUEPRINT", x: 160, y: 160, accent: true },
  { id: "product-spec", label: "PRODUCT SPEC", x: 252, y: 80 },
  { id: "ux-flows", label: "UX FLOWS", x: 316, y: 56 },
  { id: "automation", label: "AUTOMATION", x: 380, y: 80 },
  { id: "data-model", label: "DATA MODEL", x: 252, y: 240 },
  { id: "launch-plan", label: "LAUNCH PLAN", x: 316, y: 264 },
  { id: "growth-engine", label: "GROWTH ENGINE", x: 380, y: 240 },
  { id: "deploy", label: "LAUNCH READY", x: 468, y: 160, dark: true },
]

export const SYSTEM_EDGES: SystemEdge[] = [
  { id: "e0", x1: 81, y1: 160, x2: 123, y2: 160 },
  { id: "e1", x1: 197, y1: 160, x2: 221, y2: 80 },
  { id: "e2", x1: 197, y1: 160, x2: 285, y2: 56 },
  { id: "e3", x1: 197, y1: 160, x2: 349, y2: 80 },
  { id: "e4", x1: 197, y1: 160, x2: 221, y2: 240 },
  { id: "e5", x1: 197, y1: 160, x2: 285, y2: 264 },
  { id: "e6", x1: 197, y1: 160, x2: 349, y2: 240 },
  { id: "e7", x1: 283, y1: 80, x2: 431, y2: 160 },
  { id: "e8", x1: 347, y1: 56, x2: 431, y2: 160 },
  { id: "e9", x1: 411, y1: 80, x2: 431, y2: 160 },
  { id: "e10", x1: 283, y1: 240, x2: 431, y2: 160 },
  { id: "e11", x1: 347, y1: 264, x2: 431, y2: 160 },
  { id: "e12", x1: 411, y1: 240, x2: 431, y2: 160 },
]

export const DEPLOY_STEPS: DeployStep[] = [
  { label: "System Ready", time: "00:00" },
  { label: "Build", time: "00:12" },
  { label: "Test", time: "00:31" },
  { label: "Preview", time: "00:48" },
  { label: "Live", time: "01:02", active: true },
]

export const SIDEBAR_MODULES = ["Pages", "Database", "Auth", "Billing", "Deploy"]
export const WORKSPACE_TILES = [1, 2, 3, 4]

export const CARD_W = 130
export const CARD_H = 80

export const CARD_POS: Record<string, { x: number; y: number }> = {
  login:     { x: 86,   y: 90  },
  signup:    { x: 86,   y: 522 },
  welcome:   { x: 518,  y: 72  },
  dashboard: { x: 461,  y: 712 },
  clients:   { x: 1224, y: 72  },
  analytics: { x: 1224, y: 504 },
  billing:   { x: 878,  y: 712 },
}

export const PAGE_CARDS: PageCard[] = [
  {
    id: "login", name: "Login", active: true, delay: 0.0,
    lines: [{ width: "70%", accent: true }, { width: "45%", accent: false }],
  },
  {
    id: "signup", name: "Signup", active: false, delay: 0.25,
    lines: [{ width: "65%", accent: false }, { width: "50%", accent: true }, { width: "40%", accent: false }],
  },
  {
    id: "welcome", name: "Welcome", active: false, delay: 0.5,
    lines: [{ width: "55%", accent: false }, { width: "70%", accent: false }],
  },
  {
    id: "dashboard", name: "Dashboard", active: true, delay: 0.75,
    lines: [{ width: "80%", accent: true }, { width: "55%", accent: false }, { width: "45%", accent: false }],
  },
  {
    id: "clients", name: "Clients", active: false, delay: 1.0,
    lines: [{ width: "60%", accent: false }, { width: "45%", accent: true }],
  },
  {
    id: "analytics", name: "Analytics", active: false, delay: 1.25,
    lines: [{ width: "75%", accent: false }, { width: "50%", accent: false }, { width: "60%", accent: true }],
  },
  {
    id: "billing", name: "Billing", active: false, delay: 1.5,
    lines: [{ width: "65%", accent: false }, { width: "40%", accent: false }],
  },
]

export function cardCenter(id: string): [number, number] {
  const pos = CARD_POS[id]
  if (!pos) return [0, 0]
  return [pos.x + CARD_W / 2, pos.y + CARD_H / 2]
}

export function flowPath(fromId: string, toId: string): string {
  const [x1, y1] = cardCenter(fromId)
  const [x2, y2] = cardCenter(toId)
  const dx = (x2 - x1) * 0.5
  const dy = (y2 - y1) * 0.5
  const cx1 = x1 + dx
  const cy1 = y1
  const cx2 = x2 - dx * 0.1
  const cy2 = y2 - dy * 0.5
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: "NAVIGATE",
    links: [
      { label: "How It Works",          href: "#how-it-works" },
      { label: "Pricing",               href: "#pricing" },
      { label: "Start Founder Session", href: "/founder-session" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Contact", href: "mailto:hello@xenysis.com" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms" },
    ],
  },
]

export const FLOW_CONNECTIONS: FlowConnection[] = [
  { id: "fc1", fromId: "login",     toId: "welcome",   d: flowPath("login",     "welcome"),   length: 500, mint: true,  delay: 0.0, labelPct: "100%" },
  { id: "fc2", fromId: "signup",    toId: "dashboard", d: flowPath("signup",    "dashboard"), length: 420, mint: false, delay: 0.5, labelPct: "76%"  },
  { id: "fc3", fromId: "welcome",   toId: "clients",   d: flowPath("welcome",   "clients"),   length: 780, mint: false, delay: 1.0 },
  { id: "fc4", fromId: "dashboard", toId: "billing",   d: flowPath("dashboard", "billing"),   length: 500, mint: true,  delay: 1.5, labelPct: "54%"  },
  { id: "fc5", fromId: "clients",   toId: "analytics", d: flowPath("clients",   "analytics"), length: 430, mint: false, delay: 2.0 },
]
