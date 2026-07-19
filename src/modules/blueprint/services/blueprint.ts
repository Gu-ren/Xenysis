import { apiGet, apiPost, apiPostSSE, apiPut, hasBackend } from '@/lib/api'
import type {
  AnalyzeChangesResult,
  BlueprintApiResponse,
  BlueprintContent,
  BlueprintSaveSource,
  BlueprintVersionHeader,
  PresencePeer,
} from '../types/blueprint-api'

interface ApiBlueprintResponse {
  data: BlueprintApiResponse
}

// Mock blueprint returned when NEXT_PUBLIC_API_URL is unset.
// Minimal but structurally valid — mirrors the real BlueprintContent v1.0 shape.
const MOCK_BLUEPRINT: BlueprintApiResponse = {
  blueprintId:   'mock-blueprint-id',
  versionId:     'mock-version-id',
  versionNumber: 1,
  generatedAt:   new Date().toISOString(),
  content: {
    _schemaVersion: '1.0',
    overview: {
      tagline:              'Your startup blueprint is ready.',
      positionStatement:    'A blueprint has been generated from your Founder Session. Connect to the backend to view your real content.',
      coreValueProposition: 'AI-generated startup blueprints from founder discovery sessions.',
      targetMarketSummary:  'Early-stage founders building their first product.',
    },
    problem: {
      statement:           'Founders struggle to translate ideas into structured, executable plans.',
      painPoints:          ['No structured validation process', 'Difficulty articulating the problem', 'Building before validating assumptions'],
      currentAlternatives: ['Notion', 'Manual docs', 'Consultants'],
      whyNow:              'AI has made deep discovery conversations scalable and instant.',
      problemSeverity:     'high',
    },
    customer: {
      icp: {
        title:       'Early-stage founder (pre-seed to seed)',
        description: 'Technical and non-technical founders with a startup idea who need structure before building.',
        jobToBeDone: 'Go from raw idea to a structured, build-ready foundation without months of wasted effort.',
        buyerVsUser: 'same',
      },
      segments: [
        {
          name:           'Technical Founder',
          description:    'Engineer with a great idea but no business structure.',
          characteristics: ['Strong product instincts', 'Weak on GTM', 'Idea-stage to pre-product'],
          estimatedSize:  '~200K technical founders globally per year',
          isPrimaryBuyer: true,
        },
      ],
    },
    solution: {
      description:        'An AI-guided discovery session that produces a complete startup blueprint.',
      coreCapabilities:   ['Structured founder interview', 'Blueprint generation', 'Persona mapping', 'MVP scope definition'],
      differentiators:    ['AI-native', 'Founder-first UX', 'Zero-config setup'],
      unfairAdvantage:    'Proprietary founder memory extraction trained on thousands of startup patterns.',
      technologyApproach: 'LLM-powered structured output with evidence-based confidence scoring.',
    },
    businessModel: {
      revenueStreams: [
        {
          type:              'subscription',
          description:       'Monthly or annual subscription per founder',
          pricingHypothesis: '~$49/month',
          isPrimary:         true,
        },
      ],
      unitEconomicsHypothesis: 'Target LTV/CAC > 3x at 12-month payback period.',
      goToMarketSummary:       'Product-led growth through word-of-mouth in founder communities.',
      gtmMotion:               'product_led',
      keyChannels:             ['Product Hunt', 'Founder communities', 'Content marketing'],
    },
    personas: {
      personas: [
        {
          name:          'The Technical Founder',
          role:          'Engineer turned founder',
          demographics:  '28–38, early-stage, 1–5 person team',
          goals:         ['Validate idea quickly', 'Get co-founder alignment'],
          frustrations:  ['No business framework', 'Unclear on customer definition'],
          behaviors:     ['Builds before validating', 'Reads Hacker News daily'],
          techSavviness: 'high',
          isPrimary:     true,
        },
      ],
    },
    userJourneys: {
      journeys: [
        {
          personaName: 'The Technical Founder',
          scenario:    'First-time founder discovers Xenysis and completes a blueprint session.',
          stages: [
            { stage: 'Discover',  action: 'Finds Xenysis via Product Hunt', emotion: 'interested',  painPoint: 'Skeptical of yet another tool',     opportunity: 'Clear value proposition on landing page' },
            { stage: 'Onboard',   action: 'Signs up and enters startup idea', emotion: 'neutral',   painPoint: 'Uncertain what level of detail to share', opportunity: 'Prompt guidance on idea input' },
            { stage: 'Session',   action: 'Completes AI founder interview',  emotion: 'satisfied',  painPoint: null,                                 opportunity: 'Real-time understanding progress bar' },
            { stage: 'Blueprint', action: 'Reviews generated startup plan',  emotion: 'delighted',  painPoint: null,                                 opportunity: 'Share blueprint with co-founders' },
          ],
          keyInsight: 'Time-to-value must be under 20 minutes to drive completion.',
        },
      ],
    },
    mvpScope: {
      hypothesis:          'Founders who complete a guided session will produce a better blueprint than DIY approaches.',
      successCriteria:     '70% of users who start a session complete it and rate the blueprint as "useful".',
      scope: [
        { feature: 'Founder Session chat interface',  rationale: 'Core product loop',       priority: 'must_have' },
        { feature: 'Blueprint generation',            rationale: 'Primary value delivery',  priority: 'must_have' },
        { feature: 'Auth (email + Google)',           rationale: 'Required for persistence', priority: 'must_have' },
        { feature: 'Blueprint export (PDF)',          rationale: 'Increases perceived value', priority: 'should_have' },
      ],
      outOfScope:          ['Mobile app', 'Team collaboration', 'Workspace canvas', 'Billing integration'],
      estimatedBuildTime:  '8–12 weeks with a 2-person team',
    },
    requirements: {
      functional: [
        { id: 'F-001', type: 'functional', category: 'Auth',      description: 'Users can sign up and log in via email or Google OAuth', priority: 'must_have',    acceptanceCriteria: 'Auth flow completes in < 30 seconds; session persists across reloads' },
        { id: 'F-002', type: 'functional', category: 'Session',   description: 'AI conducts a structured discovery interview',           priority: 'must_have',    acceptanceCriteria: 'Session completes with at least 8 categories at ≥ 70% confidence' },
        { id: 'F-003', type: 'functional', category: 'Blueprint', description: 'System generates a structured blueprint from session',   priority: 'must_have',    acceptanceCriteria: 'Blueprint contains all 12 sections within 30 seconds of session end' },
        { id: 'F-004', type: 'functional', category: 'Blueprint', description: 'Users can view their generated blueprint',               priority: 'must_have',    acceptanceCriteria: 'Blueprint page loads in < 2 seconds' },
        { id: 'F-005', type: 'functional', category: 'Session',   description: 'Session state persists if user refreshes mid-session',   priority: 'should_have',  acceptanceCriteria: 'Session resumes from last exchange on reload' },
      ],
      nonFunctional: [
        { id: 'NF-001', type: 'non_functional', category: 'Performance', description: 'API responses return in < 500ms at p95',       priority: 'must_have',   acceptanceCriteria: 'Load test at 100 concurrent users shows p95 < 500ms' },
        { id: 'NF-002', type: 'non_functional', category: 'Security',    description: 'All endpoints require authenticated JWT tokens', priority: 'must_have',   acceptanceCriteria: 'Unauthenticated requests return 401' },
      ],
    },
    roadmap: {
      milestones: [
        { phase: 1, name: 'Foundation',    description: 'Auth, onboarding, and core session flow',    deliverables: ['Auth system', 'Founder session MVP', 'Basic blueprint output'], successMetric: 'First 10 users complete a full session', estimatedDuration: 'Weeks 1–4',  dependencies: [] },
        { phase: 2, name: 'Core Product',  description: 'Full blueprint generation and polish',       deliverables: ['All 12 blueprint sections', 'Blueprint page UI', 'Export'],      successMetric: '80% session completion rate',            estimatedDuration: 'Weeks 5–10', dependencies: ['Foundation'] },
        { phase: 3, name: 'Growth',        description: 'Acquisition loops and conversion',           deliverables: ['Referral system', 'Public blueprint sharing', 'Analytics'],      successMetric: '20% MoM user growth',                   estimatedDuration: 'Weeks 11–16', dependencies: ['Core Product'] },
        { phase: 4, name: 'Launch',        description: 'Public launch and paid tier',                deliverables: ['Billing integration', 'Product Hunt launch', 'Paid plans'],      successMetric: '100 paying customers in first month',   estimatedDuration: 'Week 17+',   dependencies: ['Growth'] },
      ],
      totalEstimatedTimeline: '4–5 months to public launch',
      criticalPath:           'Session quality gates in Phase 1 — low completion rate here delays all downstream phases.',
    },
    risks: {
      risks: [
        { category: 'product',            title: 'AI response quality variance',  description: 'Model outputs may be generic or miss founder context.',          severity: 'high',   mitigation: 'Structured prompts with founder memory extraction gates.',    phase: 1 },
        { category: 'customer_adoption',  title: 'Low session completion rate',   description: 'Founders may drop off before generating a blueprint.',           severity: 'high',   mitigation: 'Progressive value signals and short-form session design.',   phase: 1 },
        { category: 'market',             title: 'Crowded productivity tool space', description: 'Many competing tools make user acquisition expensive.',          severity: 'medium', mitigation: 'Narrow ICP focus on idea-stage founders; avoid feature bloat.', phase: 2 },
        { category: 'technical',          title: 'LLM latency spikes',            description: 'Provider outages or rate limits can degrade session experience.', severity: 'medium', mitigation: 'Fallback provider strategy and client-side retry logic.',     phase: 1 },
      ],
    },
    metrics: {
      northStar: {
        name:        'Weekly Active Blueprint Creators',
        description: 'Founders who complete at least one blueprint session per week.',
        rationale:   'Reflects genuine product value delivery, not vanity sign-up numbers.',
        target:      '500 weekly active creators by end of Phase 2',
      },
      metrics: [
        { name: 'Session Completion Rate',    category: 'activation',  description: 'Founders who complete a full session',             target: '> 70%',           measurementMethod: 'Session events in analytics',              phase: 1 },
        { name: 'Blueprint Generation Time',  category: 'operational', description: 'Time from session end to blueprint ready',         target: '< 30 seconds',    measurementMethod: 'Server-side timing logs',                  phase: 1 },
        { name: 'Day-7 Retention',            category: 'retention',   description: 'Users who return within 7 days of first session',  target: '> 30%',           measurementMethod: 'Cohort analysis in analytics dashboard',   phase: 2 },
        { name: 'Monthly Recurring Revenue',  category: 'revenue',     description: 'Total MRR from paid subscriptions',                target: '$10K MRR by M6',  measurementMethod: 'Stripe dashboard',                        phase: 3 },
      ],
    },
    customSections: [],
    customBlocks: [],
  } satisfies BlueprintContent,
}

function withDefaults(content: BlueprintContent): BlueprintContent {
  return {
    ...content,
    customSections: content.customSections ?? [],
    customBlocks: content.customBlocks ?? [],
  }
}

export async function fetchCurrentBlueprint(startupId: string): Promise<BlueprintApiResponse> {
  if (!hasBackend) {
    await new Promise((r) => setTimeout(r, 0))
    return MOCK_BLUEPRINT
  }

  const { data } = await apiGet<ApiBlueprintResponse>(
    `/api/v1/startups/${startupId}/blueprints/current`,
  )
  return { ...data, content: withDefaults(data.content) }
}

export async function saveBlueprint(
  startupId: string,
  content: BlueprintContent,
  source: BlueprintSaveSource = 'manual',
  expectedVersionNumber?: number,
  note?: string,
): Promise<{ versionId: string; versionNumber: number; content: BlueprintContent }> {
  if (!hasBackend) {
    return {
      versionId: crypto.randomUUID(),
      versionNumber: (expectedVersionNumber ?? 1) + 1,
      content: withDefaults(content),
    }
  }
  const { data } = await apiPut<
    {
      content: BlueprintContent
      source: BlueprintSaveSource
      expectedVersionNumber?: number
      note?: string
    },
    { data: { versionId: string; versionNumber: number; content: BlueprintContent } }
  >(`/api/v1/startups/${startupId}/blueprints/current`, {
    content: withDefaults(content),
    source,
    expectedVersionNumber,
    note,
  })
  return { ...data, content: withDefaults(data.content) }
}

export async function analyzeBlueprintChanges(
  startupId: string,
  previous: BlueprintContent,
  draft: BlueprintContent,
): Promise<AnalyzeChangesResult> {
  if (!hasBackend) {
    return {
      summary: 'Mock analysis — connect the API for real suggestions.',
      rationale: 'Your edits look reasonable.',
      suggestion: null,
      previewContent: null,
    }
  }
  const { data } = await apiPost<
    { previous: BlueprintContent; draft: BlueprintContent },
    { data: AnalyzeChangesResult }
  >(`/api/v1/startups/${startupId}/blueprints/analyze-changes`, {
    previous: withDefaults(previous),
    draft: withDefaults(draft),
  })
  return data
}

export async function listBlueprintVersions(startupId: string): Promise<BlueprintVersionHeader[]> {
  if (!hasBackend) {
    return [{
      versionId: MOCK_BLUEPRINT.versionId,
      versionNumber: 1,
      isCurrent: true,
      source: 'generate',
      generatedAt: MOCK_BLUEPRINT.generatedAt,
    }]
  }
  const { data } = await apiGet<{ data: BlueprintVersionHeader[] }>(
    `/api/v1/startups/${startupId}/blueprints`,
  )
  return data
}

export async function fetchBlueprintVersion(
  startupId: string,
  versionId: string,
): Promise<{ versionId: string; versionNumber: number; isCurrent: boolean; content: BlueprintContent; generatedAt: string }> {
  if (!hasBackend) {
    return {
      versionId: MOCK_BLUEPRINT.versionId,
      versionNumber: 1,
      isCurrent: true,
      content: MOCK_BLUEPRINT.content,
      generatedAt: MOCK_BLUEPRINT.generatedAt,
    }
  }
  const { data } = await apiGet<{
    data: {
      versionId: string
      versionNumber: number
      isCurrent: boolean
      content: BlueprintContent
      generatedAt: string
    }
  }>(`/api/v1/startups/${startupId}/blueprints/${versionId}`)
  return { ...data, content: withDefaults(data.content) }
}

export async function heartbeatBlueprintPresence(
  startupId: string,
  displayName: string,
  sectionId: string | null,
): Promise<PresencePeer[]> {
  if (!hasBackend) return []
  const { data } = await apiPost<
    { displayName: string; sectionId: string | null },
    { data: { peers: PresencePeer[] } }
  >(`/api/v1/startups/${startupId}/blueprints/presence`, { displayName, sectionId })
  return data.peers ?? []
}

export async function regenerateOpportunityFromBlueprint(
  startupId: string,
  blueprintContent: BlueprintContent,
  onEvent: (event: unknown) => void,
): Promise<void> {
  if (!hasBackend) {
    onEvent({ type: 'complete', data: { artifactId: 'mock', versionId: 'mock', artifactType: 'opportunity' } })
    return
  }
  await apiPostSSE(
    `/api/v1/startups/${startupId}/opportunity/regenerate-from-blueprint`,
    { blueprintContent: withDefaults(blueprintContent) },
    onEvent,
  )
}
