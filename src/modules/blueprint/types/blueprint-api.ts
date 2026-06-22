export type MoSCoWPriority = 'must_have' | 'should_have' | 'nice_to_have' | 'wont_have'
export type Rating = 'low' | 'medium' | 'high' | 'very_high'
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'
export type Emotion = 'frustrated' | 'confused' | 'neutral' | 'interested' | 'satisfied' | 'delighted'
export type TechSavviness = 'low' | 'medium' | 'high'
export type BuyerVsUser = 'same' | 'different' | 'both'
export type GtmMotion = 'product_led' | 'sales_led' | 'community_led' | 'partnership_led' | 'marketing_led'
export type RevenueStreamType = 'subscription' | 'usage' | 'one_time' | 'freemium' | 'marketplace' | 'enterprise' | 'other'
export type MetricCategory = 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral' | 'engagement' | 'operational'
export type BlueprintRiskCategory = 'product' | 'market' | 'technical' | 'customer_adoption' | 'competition' | 'regulatory' | 'team' | 'financial'

export interface BlueprintOverview {
  tagline: string
  positionStatement: string
  coreValueProposition: string
  targetMarketSummary: string
}

export interface BlueprintProblem {
  statement: string
  painPoints: string[]
  currentAlternatives: string[]
  whyNow: string
  problemSeverity: Rating
}

export interface CustomerSegment {
  name: string
  description: string
  characteristics: string[]
  estimatedSize: string
  isPrimaryBuyer: boolean
}

export interface BlueprintCustomer {
  icp: {
    title: string
    description: string
    jobToBeDone: string
    buyerVsUser: BuyerVsUser
  }
  segments: CustomerSegment[]
}

export interface BlueprintSolution {
  description: string
  coreCapabilities: string[]
  differentiators: string[]
  unfairAdvantage: string | null
  technologyApproach: string | null
}

export interface RevenueStream {
  type: RevenueStreamType
  description: string
  pricingHypothesis: string
  isPrimary: boolean
}

export interface BlueprintBusinessModel {
  revenueStreams: RevenueStream[]
  unitEconomicsHypothesis: string
  goToMarketSummary: string
  gtmMotion: GtmMotion
  keyChannels: string[]
}

export interface BlueprintPersona {
  name: string
  role: string
  demographics: string
  goals: string[]
  frustrations: string[]
  behaviors: string[]
  techSavviness: TechSavviness
  isPrimary: boolean
}

export interface BlueprintPersonas {
  personas: BlueprintPersona[]
}

export interface JourneyStage {
  stage: string
  action: string
  emotion: Emotion
  painPoint: string | null
  opportunity: string | null
}

export interface UserJourney {
  personaName: string
  scenario: string
  stages: JourneyStage[]
  keyInsight: string
}

export interface BlueprintUserJourneys {
  journeys: UserJourney[]
}

export interface ScopeItem {
  feature: string
  rationale: string
  priority: MoSCoWPriority
}

export interface BlueprintMvpScope {
  hypothesis: string
  successCriteria: string
  scope: ScopeItem[]
  outOfScope: string[]
  estimatedBuildTime: string
}

export interface BlueprintRequirement {
  id: string
  type: 'functional' | 'non_functional'
  category: string
  description: string
  priority: MoSCoWPriority
  acceptanceCriteria: string
}

export interface BlueprintRequirements {
  functional: BlueprintRequirement[]
  nonFunctional: BlueprintRequirement[]
}

export interface Milestone {
  phase: number
  name: string
  description: string
  deliverables: string[]
  successMetric: string
  estimatedDuration: string
  dependencies: string[]
}

export interface BlueprintRoadmap {
  milestones: Milestone[]
  totalEstimatedTimeline: string
  criticalPath: string
}

export interface BlueprintRisk {
  category: BlueprintRiskCategory
  title: string
  description: string
  severity: RiskSeverity
  mitigation: string
  phase: number | null
}

export interface BlueprintRisks {
  risks: BlueprintRisk[]
}

export interface BlueprintMetricItem {
  name: string
  category: MetricCategory
  description: string
  target: string
  measurementMethod: string
  phase: number
}

export interface BlueprintMetrics {
  northStar: {
    name: string
    description: string
    rationale: string
    target: string
  }
  metrics: BlueprintMetricItem[]
}

export interface BlueprintContent {
  _schemaVersion: '1.0'
  overview: BlueprintOverview
  problem: BlueprintProblem
  customer: BlueprintCustomer
  solution: BlueprintSolution
  businessModel: BlueprintBusinessModel
  personas: BlueprintPersonas
  userJourneys: BlueprintUserJourneys
  mvpScope: BlueprintMvpScope
  requirements: BlueprintRequirements
  roadmap: BlueprintRoadmap
  risks: BlueprintRisks
  metrics: BlueprintMetrics
}

export interface BlueprintApiResponse {
  blueprintId: string
  versionId: string
  versionNumber: number
  content: BlueprintContent
  generatedAt: string
}
