import type {
  NavItem,
  OverviewStat,
  Persona,
  Requirement,
  RoadmapPhase,
  RiskGroup,
  Metric,
  SolutionStep,
  CustomerCard,
  PricingTier,
} from './types'

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'customer', label: 'Customer' },
  { id: 'solution', label: 'Solution' },
  { id: 'business-model', label: 'Business Model' },
  { id: 'personas', label: 'Personas' },
  { id: 'user-journeys', label: 'User Journeys' },
  { id: 'mvp-scope', label: 'MVP Scope' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'risks', label: 'Risks' },
]

export const OVERVIEW_STATS: OverviewStat[] = [
  { label: 'Product Name', value: 'FlowSync' },
  { label: 'Industry', value: 'B2B SaaS / Productivity' },
  { label: 'Business Type', value: 'Software as a Service' },
  { label: 'Target Customer', value: 'Startup Operations Teams' },
  { label: 'Revenue Model', value: 'Subscription + Usage' },
]

export const PERSONAS: Persona[] = [
  {
    initials: 'JK',
    name: 'Jordan Kim',
    role: 'Head of Operations, Seed-stage startup',
    goals: 'Build scalable processes without slowing the team down',
    frustrations: 'Constant firefighting; tools that require too much upkeep',
    successMetric: 'Ship 2 product cycles per quarter with no ops bottlenecks',
  },
  {
    initials: 'AR',
    name: 'Alex Rivera',
    role: 'Co-founder / CEO',
    goals: 'Maintain company velocity while growing headcount',
    frustrations: 'Loses visibility when team grows past 10 people',
    successMetric: 'Zero surprises in weekly standups',
  },
  {
    initials: 'MP',
    name: 'Morgan Park',
    role: 'Engineering Lead',
    goals: 'Ship without being blocked by unclear requirements',
    frustrations: 'Requirements change mid-sprint with no documented reason',
    successMetric: 'Clear, AI-maintained requirements doc at all times',
  },
]

export const REQUIREMENTS: Requirement[] = [
  {
    id: 'auth',
    title: 'Authentication',
    items: ['Email/password login', 'Google OAuth', 'Team invitations', 'Role-based access'],
    isOpen: true,
  },
  {
    id: 'user-mgmt',
    title: 'User Management',
    items: ['Profile settings', 'Team management', 'Seat-based billing', 'Audit logs'],
    isOpen: false,
  },
  {
    id: 'core',
    title: 'Core Features',
    items: ['Workflow builder', 'Status tracking', 'Blocker flagging', 'Notifications'],
    isOpen: false,
  },
  {
    id: 'ai',
    title: 'AI Features',
    items: [
      'Daily digest generation',
      'Blocker detection',
      'Next-step suggestions',
      'Meeting summarization',
    ],
    isOpen: false,
  },
  {
    id: 'reporting',
    title: 'Reporting',
    items: ['Sprint velocity', 'Team activity feed', 'Export to PDF'],
    isOpen: false,
  },
]

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: '1',
    name: 'Foundation',
    time: 'Weeks 1–4',
    tasks: 'Auth, Onboarding, Workflow Builder',
    active: true,
  },
  {
    phase: '2',
    name: 'Core Product',
    time: 'Weeks 5–10',
    tasks: 'AI Blocker Detection, Integrations, Dashboard',
    active: false,
  },
  {
    phase: '3',
    name: 'AI Layer',
    time: 'Weeks 11–16',
    tasks: 'Daily Digest, Meeting AI, Smart Suggestions',
    active: false,
  },
  {
    phase: '4',
    name: 'Launch',
    time: 'Week 17+',
    tasks: 'Public Beta, Product Hunt, Growth Loops',
    active: false,
  },
]

export const RISK_GROUPS: RiskGroup[] = [
  {
    type: 'Product Risks',
    color: 'border-l-amber-500/70',
    items: [
      'Market timing risk — category may not be ready for AI ops tools',
      'Feature creep — risk of building too broad for an MVP',
    ],
  },
  {
    type: 'Technical Risks',
    color: 'border-l-orange-500/70',
    items: [
      'AI hallucination in workflow suggestions may erode trust',
      'Integration reliability dependent on third-party APIs',
    ],
  },
  {
    type: 'Execution Risks',
    color: 'border-l-red-500/70',
    items: [
      'Small team may struggle with sales + product simultaneously',
      'Onboarding drop-off if time-to-value is not immediately clear',
    ],
  },
]

export const METRICS: Metric[] = [
  { label: 'Product Definition', val: 92, color: 'bg-emerald-500' },
  { label: 'Requirements', val: 88, color: 'bg-emerald-500' },
  { label: 'Architecture Readiness', val: 74, color: 'bg-amber-500' },
  { label: 'Execution Readiness', val: 80, color: 'bg-emerald-500' },
]

export const SOLUTION_STEPS: SolutionStep[] = [
  { n: '1', t: 'Connect tools and define workflows' },
  { n: '2', t: 'AI monitors, surfaces blockers, and suggests next steps' },
  { n: '3', t: 'Teams act faster with automated updates and real-time visibility' },
]

export const CUSTOMER_CARDS: CustomerCard[] = [
  { label: 'Customer Profile', value: 'Ops lead / Founder' },
  { label: 'Company Size', value: '5–30 employees' },
  { label: 'Behaviors', value: 'Uses multiple SaaS tools daily, high-urgency decision maker' },
  { label: 'Goals', value: 'Ship fast, reduce chaos, scale processes' },
  { label: 'Pain Points', value: 'Firefighting instead of building, no single source of truth' },
]

export const PRICING_TIERS: PricingTier[] = [
  {
    key: 'starter',
    label: 'Starter',
    price: '$49',
    features: ['Up to 10 seats', 'Core workflows', 'Basic AI assistance'],
    highlighted: false,
  },
  {
    key: 'pro',
    label: 'Pro',
    price: '$149',
    features: ['Unlimited seats', 'Advanced AI intelligence', 'Full integrations suite'],
    highlighted: true,
  },
]

export const ACTIVATION_STEPS = [
  'Discover FlowSync',
  'Sign Up (Google SSO)',
  'Connect Tools',
  'Create First Workflow',
  'Invite Team',
  'Use Core Features',
  'Upgrade to Pro',
]

export const DAILY_STEPS = [
  'Receive AI Morning Digest',
  'Review Blockers',
  'Take Suggested Actions',
  'Update Status (auto)',
  'Review Sprint Progress',
  'Close Day',
]

export const MVP_INCLUDED = [
  'Authentication & Onboarding',
  'Workflow Builder',
  'AI Blocker Detection',
  'Team Notifications',
  'Integrations: Slack + Linear',
  'Progress Dashboard',
]

export const MVP_EXCLUDED = [
  'Mobile App',
  'Gantt View',
  'Advanced Reporting',
  'Custom AI Models',
  'Enterprise SSO',
  'API Access',
]

export const ACQUISITION_CHANNELS = [
  'Product Hunt',
  'LinkedIn Outreach',
  'Content Marketing',
  'Founder Communities',
]

export const EXPANSION_ITEMS = [
  'Enterprise tier for 50+ teams',
  'API access for developers',
  'White-label partnerships',
]

export const DIFFERENTIATORS = ['AI-native', 'Startup-first UX', 'Zero-config setup']

export const PAIN_POINTS = [
  'No centralized workflow visibility',
  'Constant context-switching between disconnected tools',
  'Manual status updates that become stale immediately',
]

export const ALTERNATIVES = ['Notion', 'ClickUp', 'Monday.com', 'Slack']

export const BLUEPRINT_HEALTH_SCORE = 85
