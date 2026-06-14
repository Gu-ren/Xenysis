import { TrendingUp, Target, BarChart2, Lightbulb, Users } from 'lucide-react'
import type { TrustSignalItem, FoundationCategory } from './summary.types'

// Static methodology trust signals — not opportunity-specific.
export const TRUST_SIGNALS: TrustSignalItem[] = [
  { icon: <TrendingUp className="w-3.5 h-3.5" />, text: 'Market Signal Analysis' },
  { icon: <Target className="w-3.5 h-3.5" />, text: 'Competitor Intelligence' },
  { icon: <BarChart2 className="w-3.5 h-3.5" />, text: 'Industry Benchmarking' },
  { icon: <Lightbulb className="w-3.5 h-3.5" />, text: 'Startup Pattern Recognition' },
  { icon: <Users className="w-3.5 h-3.5" />, text: 'Founder Session Inputs' },
]

// Static generation categories for the "Generate Startup Foundation" CTA.
export const FOUNDATION_CATEGORIES: FoundationCategory[] = [
  { label: 'Product', items: ['Product Blueprint', 'Core Features', 'User Journeys'] },
  {
    label: 'System',
    items: [
      'System Architecture',
      'Database Design',
      'Application Modules',
      'User Roles & Permissions',
    ],
  },
  {
    label: 'Business',
    items: ['Business Model', 'Monetization Structure', 'Market Positioning'],
  },
  {
    label: 'Intelligence',
    items: ['AI Agent Opportunities', 'Workflow Automation Blueprint'],
  },
]
