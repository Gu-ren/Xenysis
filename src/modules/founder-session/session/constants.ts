import {
  Globe,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  KanbanSquare,
  CreditCard,
  Users,
  Home,
  Activity,
  Lock,
} from 'lucide-react'
import type { CanvasNodeData, CanvasEdgeData, ClaritySegment } from '../types'

// BACKEND: replace with a streamed AI response from POST /founder-session/message
// The text is streamed token-by-token; canvas nodes/edges are revealed as AI insights are extracted.
export const STREAMING_FULL_TEXT =
  "Adding subscription infrastructure and property data models. I'm also seeing an opportunity for a client portal — real estate teams often need a white-labeled space for clients to track their deals."

// BACKEND: replace with nodes derived from the AI session response (extracted entities)
// Ordered: latent → core (top-to-bottom) → opportunity (last, renders on top)
export const CANVAS_NODES: CanvasNodeData[] = [
  // Latent — undiscovered possibilities (no label, no icon)
  { id: 'lat1', label: '', type: 'core', state: 'latent', cx: 178, cy: 50  },
  { id: 'lat2', label: '', type: 'core', state: 'latent', cx: 155, cy: 244 },
  { id: 'lat3', label: '', type: 'core', state: 'latent', cx: 388, cy: 335 },

  // Discovered / understood core nodes — founder-language labels
  {
    id: 'landing',
    label: 'Landing Page',
    sublabel: 'Marketing site',
    type: 'core',
    state: 'discovered',
    icon: Globe,
    cx: 270, cy: 55,
  },
  {
    id: 'signup',
    label: 'Customer Sign Up',
    sublabel: 'Email & Google login',
    type: 'core',
    state: 'understood',
    icon: ShieldCheck,
    cx: 120, cy: 150,
  },
  {
    id: 'onboard',
    label: 'Getting Started',
    sublabel: 'Guided setup flow',
    type: 'core',
    state: 'discovered',
    icon: UserCheck,
    cx: 420, cy: 150,
  },
  {
    id: 'workspace',
    label: 'Workspace',
    sublabel: 'Agent command center',
    type: 'core',
    state: 'understood',
    icon: LayoutDashboard,
    cx: 270, cy: 244,
  },
  {
    id: 'leads',
    label: 'Lead Management',
    sublabel: 'Pipeline & tracking',
    type: 'core',
    state: 'building',
    icon: KanbanSquare,
    cx: 96, cy: 335,
    buildProgress: 72,
  },
  {
    id: 'access',
    label: 'Team Access',
    sublabel: 'Roles & permissions',
    type: 'core',
    state: 'understood',
    icon: Lock,
    cx: 270, cy: 335,
  },
  {
    id: 'billing',
    label: 'Subscription Plans',
    sublabel: 'Per-seat billing',
    type: 'core',
    state: 'building',
    icon: CreditCard,
    cx: 444, cy: 335,
    buildProgress: 55,
  },
  {
    id: 'property',
    label: 'Property Listings',
    sublabel: '12 entities mapped',
    type: 'core',
    state: 'building',
    icon: Home,
    cx: 96, cy: 422,
    buildProgress: 72,
  },
  {
    id: 'activity',
    label: 'Client Activity',
    sublabel: 'Deal & event timeline',
    type: 'core',
    state: 'building',
    icon: Activity,
    cx: 270, cy: 422,
    buildProgress: 44,
  },

  // Opportunity node — rendered last so it appears above all edges and core nodes
  {
    id: 'portal',
    label: 'Client Portal',
    sublabel: 'Revenue opportunity',
    type: 'opportunity',
    state: 'opportunity',
    icon: Users,
    cx: 444, cy: 422,
  },
]

// BACKEND: replace with edges derived from the AI session response (relationships between entities)
export const CANVAS_EDGES: CanvasEdgeData[] = [
  { from: 'landing',   to: 'signup' },
  { from: 'landing',   to: 'onboard' },
  { from: 'signup',    to: 'workspace' },
  { from: 'onboard',   to: 'workspace' },
  { from: 'workspace', to: 'leads' },
  { from: 'workspace', to: 'access' },
  { from: 'workspace', to: 'billing' },
  { from: 'leads',     to: 'property' },
  { from: 'access',    to: 'activity' },
  { from: 'billing',   to: 'portal' },
  { from: 'property',  to: 'portal' },
]

// ── Business Clarity segments ─────────────────────────────────────────────────

export const CLARITY_SEGMENTS: ClaritySegment[] = [
  { id: 'business-model', label: 'Business Model', progress: 100 },
  { id: 'product-shape',  label: 'Product Shape',  progress: 62  },
  { id: 'architecture',   label: 'Architecture',   progress: 0   },
  { id: 'build-ready',    label: 'Build Ready',    progress: 0   },
]
