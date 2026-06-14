import { apiGet, ApiError } from '@/lib/api'
import { supabase } from '@/services/auth/client'

export { ApiError }

// ── Types mirroring the backend OpportunityAssessmentContent contract ─────────

export type Rating = 'low' | 'medium' | 'high' | 'very_high'
export type RecommendationAction =
  | 'proceed'
  | 'proceed_with_caution'
  | 'validate_first'
  | 'pivot'
  | 'pass'
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'
export type UnderstandingCategory =
  | 'problem'
  | 'customer'
  | 'solution'
  | 'market'
  | 'pricing'
  | 'competition'
  | 'risks'
  | 'founder_fit'

export interface MarketPotential {
  size: Rating
  growth: Rating
  score: number
  narrative: string
}

export interface FounderFit {
  domainExpertise: Rating
  customerAccess: Rating
  executionCapability: Rating
  score: number
  narrative: string
}

export interface CompetitiveAdvantage {
  moat: string | null
  differentiators: string[]
  defensibility: Rating
  narrative: string
}

export interface KeyRisk {
  category: UnderstandingCategory
  title: string
  description: string
  severity: RiskSeverity
  mitigation: string
}

export interface ValidationStep {
  priority: number
  category: UnderstandingCategory
  action: string
  successCriteria: string
  effort: 'low' | 'medium' | 'high'
  timeline: string
}

export interface Recommendation {
  action: RecommendationAction
  rationale: string
  nextSteps: string[]
}

export interface OpportunityAssessmentContent {
  _schemaVersion: '1.0'
  executiveSummary: string
  opportunityScore: number
  confidenceScore: number
  marketPotential: MarketPotential
  founderFit: FounderFit
  competitiveAdvantage: CompetitiveAdvantage
  keyRisks: KeyRisk[]
  validationPlan: ValidationStep[]
  recommendation: Recommendation
}

export interface OpportunityAssessmentResponse {
  assessmentId: string
  versionId: string
  versionNumber: number
  content: OpportunityAssessmentContent
  generatedAt: string
}

export interface OpportunityVersionHeader {
  versionId: string
  versionNumber: number
  isCurrent: boolean
  generatedAt: string
}

// ── SSE event payloads ────────────────────────────────────────────────────────

export interface SSEStageEvent {
  stageId: string
  label: string
  sublabel: string
  state: 'pending' | 'active' | 'done'
}

export interface GenerateCallbacks {
  onStage: (event: SSEStageEvent) => void
  onProgress: (percent: number) => void
  onComplete: (artifactId: string, versionId: string) => void
  onError: (code: string, message: string) => void
}

// ── API wrappers ──────────────────────────────────────────────────────────────

export async function fetchOpportunityAssessment(
  startupId: string,
): Promise<OpportunityAssessmentResponse> {
  const { data } = await apiGet<{ data: OpportunityAssessmentResponse }>(
    `/api/v1/startups/${startupId}/opportunity`,
  )
  return data
}

export async function fetchOpportunityVersions(
  startupId: string,
): Promise<OpportunityVersionHeader[]> {
  const { data } = await apiGet<{ data: OpportunityVersionHeader[] }>(
    `/api/v1/startups/${startupId}/opportunity/versions`,
  )
  return data
}

// ── SSE generation stream ─────────────────────────────────────────────────────
// Connects to POST /api/v1/startups/:id/opportunity/generate and parses the
// server-sent event stream, routing each event type to the provided callbacks.
// The `complete` callback fires at most once even if the backend emits duplicate
// terminal events (audit: runner re-throws after yielding MAX_RETRIES_EXCEEDED,
// causing the route catch to emit a second error — deduplication is handled here).
export async function streamOpportunityGeneration(
  startupId: string,
  sessionId: string,
  callbacks: GenerateCallbacks,
): Promise<void> {
  let token: string | undefined
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    token = session?.access_token
  } catch {
    /* no active session */
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/v1/startups/${startupId}/opportunity/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ sessionId }),
    },
  )

  if (!res.ok || !res.body) {
    callbacks.onError(
      'REQUEST_FAILED',
      `Generation request failed: ${res.status} ${res.statusText}`,
    )
    return
  }

  const reader  = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let completeFired = false
  let errorFired    = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const event = JSON.parse(line.slice(6)) as {
          type: 'stage' | 'progress' | 'complete' | 'error' | 'log'
          data: Record<string, unknown>
        }

        switch (event.type) {
          case 'stage':
            callbacks.onStage(event.data as SSEStageEvent)
            break
          case 'progress':
            callbacks.onProgress((event.data as { percent: number }).percent)
            break
          case 'complete':
            if (!completeFired) {
              completeFired = true
              const { artifactId, versionId } = event.data as {
                artifactId: string
                versionId: string
              }
              callbacks.onComplete(artifactId, versionId)
            }
            break
          case 'error':
            if (!errorFired) {
              errorFired = true
              const { code, message } = event.data as { code: string; message: string }
              callbacks.onError(code, message)
            }
            break
          // 'log' events are informational and not surfaced to the UI
        }
      } catch {
        /* malformed SSE line — skip */
      }
    }
  }
}
