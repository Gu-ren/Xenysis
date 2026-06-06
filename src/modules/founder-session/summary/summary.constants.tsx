import { TrendingUp, Target, BarChart2, Lightbulb, Users } from 'lucide-react'
import type {
  LabelValueRow,
  ConfidenceRow,
  RiskItem,
  AssumptionItem,
  TrustSignalItem,
  WhyNowItem,
  WhyWinItem,
  FoundationCategory,
  MarketSizingCard,
  MarketSizingBasis,
  LoaderChecklistItem,
} from './summary.types'

export const LOADER_CHECKLIST: LoaderChecklistItem[] = [
  { label: 'Customer profile identified' },
  { label: 'Revenue model identified' },
  { label: 'Workflow mapped' },
  { label: 'Market signals collected' },
  { label: 'Competitive landscape analyzed' },
]

export const WHY_NOW_ITEMS: WhyNowItem[] = [
  { text: 'AI adoption accelerating in the target market' },
  { text: 'Existing solutions have significant onboarding friction' },
  { text: 'Customer demand remains underserved at current price points' },
]

export const WHY_WIN_ITEMS: WhyWinItem[] = [
  { text: 'Strong market demand signals' },
  { text: 'Clear, validated customer pain' },
  { text: 'Proven willingness to pay' },
  { text: 'Focused, achievable MVP scope' },
]

export const BIGGEST_RISK =
  'Incumbents are rapidly adding AI features to existing platforms, which could compress your differentiation window.'

export const EXPECTED_OUTCOME =
  'Strong probability of reaching early product-market validation if core assumptions are validated through customer discovery interviews before full build.'

export const BLUEPRINT_CUSTOMER: LabelValueRow[] = [
  { label: 'Primary Customer', value: 'Small Real Estate Teams' },
  { label: 'Core Pain Point', value: 'Lead management and client follow-up' },
  { label: 'Buying Motivation', value: 'Save time and increase conversion' },
]

export const BLUEPRINT_MODEL: LabelValueRow[] = [
  { label: 'Revenue Model', value: 'SaaS Subscription' },
  { label: 'Pricing Recommendation', value: '$49–99 per seat / month' },
  { label: 'Monetization Strategy', value: 'Seat-based with usage tiers' },
]

export const BLUEPRINT_MVP: string[] = [
  'Authentication',
  'CRM Pipeline',
  'Property Listings',
  'Team Permissions',
  'Billing & Subscription',
]

export const BLUEPRINT_POSITIONING: LabelValueRow[] = [
  { label: 'Differentiator', value: 'AI-first automation for real estate' },
  { label: 'Market Wedge', value: 'Faster onboarding than legacy CRMs' },
  { label: 'Switching Reason', value: 'Lower cost with higher automation' },
]

export const CONFIDENCE_ROWS: ConfidenceRow[] = [
  { label: 'Market Demand', pct: 92 },
  { label: 'Competitor Analysis', pct: 85 },
  { label: 'Monetization Signals', pct: 89 },
  { label: 'Technical Feasibility', pct: 94 },
  { label: 'Customer Validation', pct: 81 },
]

export const ASSUMPTIONS: AssumptionItem[] = [
  { text: 'Customers will pay $49–99/month' },
  { text: 'Faster onboarding is a meaningful differentiator' },
  { text: 'Existing tools do not solve this pain point' },
  { text: 'AI workflows improve team productivity' },
]

export const CRITICAL_RISKS: RiskItem[] = [
  { text: 'Incumbents launch competing AI features', severity: 'high' },
  { text: 'Customer acquisition costs increase', severity: 'high' },
  { text: 'Users resist switching tools', severity: 'medium' },
  { text: 'Demand weaker than expected', severity: 'medium' },
]

export const TRUST_SIGNALS: TrustSignalItem[] = [
  { icon: <TrendingUp className="w-3.5 h-3.5" />, text: 'Market Signal Analysis' },
  { icon: <Target className="w-3.5 h-3.5" />, text: 'Competitor Intelligence' },
  { icon: <BarChart2 className="w-3.5 h-3.5" />, text: 'Industry Benchmarking' },
  { icon: <Lightbulb className="w-3.5 h-3.5" />, text: 'Startup Pattern Recognition' },
  { icon: <Users className="w-3.5 h-3.5" />, text: 'Founder Session Inputs' },
]

export const FOUNDATION_CATEGORIES: FoundationCategory[] = [
  { label: 'Product', items: ['Product Blueprint', 'Core Features', 'User Journeys'] },
  {
    label: 'System',
    items: ['System Architecture', 'Database Design', 'Application Modules', 'User Roles & Permissions'],
  },
  { label: 'Business', items: ['Business Model', 'Monetization Structure', 'Market Positioning'] },
  { label: 'Intelligence', items: ['AI Agent Opportunities', 'Workflow Automation Blueprint'] },
]

export const MARKET_SIZING_CARDS: MarketSizingCard[] = [
  {
    label: 'TAM',
    abbr: 'Total Addressable Market',
    value: '$142B',
    description: 'Global market opportunity if all potential customers adopted similar solutions.',
  },
  {
    label: 'SAM',
    abbr: 'Serviceable Addressable Market',
    value: '$18B',
    description: 'Customers realistically reachable based on product scope, geography, and target segment.',
  },
  {
    label: 'SOM',
    abbr: 'Serviceable Obtainable Market',
    value: '$420M',
    description: 'Estimated share Xenysis believes could be captured during early growth stages.',
  },
]

export const MARKET_SIZING_BASIS: MarketSizingBasis[] = [
  { text: 'Industry reports' },
  { text: 'Market research datasets' },
  { text: 'Competitor analysis' },
  { text: 'Customer segmentation' },
  { text: 'Founder Session inputs' },
]
