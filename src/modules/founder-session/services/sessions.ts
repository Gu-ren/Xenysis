import { apiGet, apiPost, apiPostSSE, ApiError, hasBackend } from '@/lib/api'
import { EMPTY_UNDERSTANDING, type FounderUnderstanding } from '../types/understanding'
import {
  normalizeAnswerChoices,
  type AnswerChoice,
} from '../utils/answer-choices'
import { understandingFingerprint } from '../utils/understanding-fingerprint'

export interface ApiSession {
  id: string
  startupId: string
  userId: string
  idea: string
  status: 'active' | 'completed' | 'abandoned'
  messagesCount: number
  createdAt: string
  updatedAt: string
}

export interface ApiSessionAnswer {
  id: string
  sessionId: string
  questionId: string
  questionType: string
  question: string
  answer: string
  sequenceOrder: number
  createdAt: string
}

export interface CreateSessionParams {
  idea: string
  founderStage?: 'idea' | 'building' | 'revenue'
}

export interface AddAnswerParams {
  questionId: string
  questionType: 'problem' | 'customer' | 'market' | 'competition' | 'revenue' | 'team' | 'vision' | 'assumption'
  question: string
  answer: string
  sequenceOrder: number
}

export async function createSession(
  startupId: string,
  params: CreateSessionParams,
): Promise<ApiSession> {
  if (!hasBackend) {
    return {
      id: `mock-session-${Date.now()}`,
      startupId,
      userId: 'mock-user',
      idea: params.idea,
      status: 'active',
      messagesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  const { data } = await apiPost<CreateSessionParams, { data: ApiSession }>(
    `/api/v1/startups/${startupId}/sessions`,
    params,
  )
  return data
}

export async function fetchSession(
  startupId: string,
  sessionId: string,
): Promise<ApiSession & { answers: ApiSessionAnswer[] }> {
  const { data } = await apiGet<{ data: ApiSession & { answers: ApiSessionAnswer[] } }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}`,
  )
  return data
}

export async function addAnswer(
  startupId: string,
  sessionId: string,
  params: AddAnswerParams,
): Promise<ApiSessionAnswer> {
  const { data } = await apiPost<AddAnswerParams, { data: ApiSessionAnswer }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/answers`,
    params,
  )
  return data
}

export async function fetchUnderstanding(
  startupId: string,
  sessionId: string,
): Promise<FounderUnderstanding> {
  if (!hasBackend) return EMPTY_UNDERSTANDING
  const { data } = await apiGet<{ data: FounderUnderstanding }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/understanding`,
  )
  return data ?? EMPTY_UNDERSTANDING
}

export { understandingFingerprint }

/**
 * Poll until understanding fingerprint changes vs previousFingerprint, or timeout.
 * On timeout returns the latest fetch so the UI never sticks forever.
 * Offline/mock: short wait then return EMPTY (or latest) so local dev doesn't hang.
 */
export async function waitForUnderstandingUpdate(
  startupId: string,
  sessionId: string,
  previousFingerprint: string,
  options?: { intervalMs?: number; timeoutMs?: number },
): Promise<FounderUnderstanding> {
  const intervalMs = options?.intervalMs ?? 800
  const timeoutMs = options?.timeoutMs ?? (hasBackend ? 20_000 : 400)
  const started = Date.now()
  let latest: FounderUnderstanding = EMPTY_UNDERSTANDING

  while (Date.now() - started < timeoutMs) {
    try {
      latest = await fetchUnderstanding(startupId, sessionId)
      if (understandingFingerprint(latest) !== previousFingerprint) {
        return latest
      }
    } catch {
      // ignore transient errors and keep polling
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }

  try {
    latest = await fetchUnderstanding(startupId, sessionId)
  } catch {
    /* keep previous latest */
  }
  return latest
}

// Beta early-exit: founder elects to generate an assessment before natural session completion.
// Validates eligibility server-side, forces isComplete = true with blueprintMode = 'hypothesis'.
export async function requestAssessment(
  startupId: string,
  sessionId: string,
): Promise<FounderUnderstanding> {
  if (!hasBackend) {
    return { ...EMPTY_UNDERSTANDING, isComplete: true, blueprintMode: 'hypothesis' }
  }
  const { data } = await apiPost<Record<string, never>, { data: { understanding: FounderUnderstanding } }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/request-assessment`,
    {},
  )
  return data?.understanding ?? EMPTY_UNDERSTANDING
}

export async function continueDiscovery(
  startupId: string,
  sessionId: string,
): Promise<FounderUnderstanding> {
  if (!hasBackend) {
    return { ...EMPTY_UNDERSTANDING, earlyExitDismissed: true, earlyExitEligible: false }
  }
  const { data } = await apiPost<Record<string, never>, { data: { understanding: FounderUnderstanding } }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/continue-discovery`,
    {},
  )
  return data?.understanding ?? {
    ...EMPTY_UNDERSTANDING,
    earlyExitDismissed: true,
    earlyExitEligible: false,
  }
}

export async function generateChoices(
  startupId: string,
  sessionId: string,
  questionText: string,
): Promise<AnswerChoice[]> {
  if (!hasBackend) {
    return normalizeAnswerChoices([
      {
        label: 'SMB finance teams',
        text: 'Our primary buyer is a finance lead at a 20–100 person company still reconciling invoices in spreadsheets. They feel the pain when month-end close takes 5+ days and errors create audit risk.',
      },
      {
        label: 'Enterprise CFOs',
        text: 'We target CFOs at mid-market firms with multi-entity accounting who need real-time visibility across subsidiaries. The trigger is usually a failed audit or a board mandate to cut close time in half.',
      },
      {
        label: 'Freelance accountants',
        text: 'Independent bookkeepers managing 10–30 client accounts who spend hours chasing receipts and reconciling bank feeds. They look for a solution when a client outgrows their manual workflow.',
      },
    ])
  }
  const { data } = await apiPost<{ questionText: string }, { data: { choices?: unknown[] } }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/generate-choices`,
    { questionText },
  )
  return normalizeAnswerChoices(Array.isArray(data?.choices) ? data.choices : [])
}

// ── SSE chat stream ───────────────────────────────────────────────────────────

export type ChatStreamPhase = 'understanding' | 'planning' | 'thinking'

export interface ChatStreamEvent {
  type: 'delta' | 'done' | 'error' | 'status'
  data: {
    content?: string
    jobId?: string
    message?: string
    choices?: unknown[]
    phase?: ChatStreamPhase
    earlyExitEligible?: boolean
    earlyExitDismissed?: boolean
  }
}

export interface ChatCompleteMeta {
  earlyExitEligible?: boolean
  earlyExitDismissed?: boolean
}

export type OnChunk = (content: string) => void
export type OnStatus = (phase: ChatStreamPhase) => void
export type OnComplete = (jobId: string, choices?: AnswerChoice[], meta?: ChatCompleteMeta) => void
export type OnError = (message: string, status?: number, errorCode?: string) => void

function parseApiErrorBody(body: unknown): { message?: string; code?: string } {
  if (!body || typeof body !== 'object') return {}
  const root = body as Record<string, unknown>
  const err = (root.error ?? root) as Record<string, unknown>
  return {
    message: typeof err.message === 'string' ? err.message : undefined,
    code: typeof err.code === 'string' ? err.code : undefined,
  }
}

export async function streamChatMessage(
  startupId: string,
  sessionId: string,
  message: string,
  callbacks: {
    onChunk: OnChunk
    onComplete: OnComplete
    onError: OnError
    onStatus?: OnStatus
  },
): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    callbacks.onStatus?.('understanding')
    await new Promise((r) => setTimeout(r, 200))
    callbacks.onStatus?.('thinking')
    const mockQuestion =
      'Who is your primary customer — and what triggers them to look for a solution like yours?'
    const mockChoices: AnswerChoice[] = [
      {
        label: 'SMB finance teams',
        text: 'Our primary buyer is a finance lead at a 20–100 person company still reconciling invoices in spreadsheets. They feel the pain when month-end close takes 5+ days and errors create audit risk.',
      },
      {
        label: 'Enterprise CFOs',
        text: 'We target CFOs at mid-market firms with multi-entity accounting who need real-time visibility across subsidiaries. The trigger is usually a failed audit or a board mandate to cut close time in half.',
      },
      {
        label: 'Freelance accountants',
        text: 'Independent bookkeepers managing 10–30 client accounts who spend hours chasing receipts and reconciling bank feeds. They look for a solution when a client outgrows their manual workflow.',
      },
    ]
    const words = mockQuestion.split(' ')
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 60))
      callbacks.onChunk(word + ' ')
    }
    callbacks.onComplete('mock-job-id', mockChoices, {
      earlyExitEligible: false,
      earlyExitDismissed: false,
    })
    return
  }

  const path = `/api/v1/startups/${startupId}/sessions/${sessionId}/messages`
  let settled = false

  try {
    await apiPostSSE<{ message: string }>(path, { message }, (raw) => {
      const event = raw as ChatStreamEvent
      if (event.type === 'status' && event.data?.phase) {
        callbacks.onStatus?.(event.data.phase)
      } else if (event.type === 'delta' && event.data?.content) {
        callbacks.onChunk(event.data.content)
      } else if (event.type === 'done') {
        settled = true
        const choices = Array.isArray(event.data?.choices) && event.data.choices.length > 0
          ? normalizeAnswerChoices(event.data.choices)
          : undefined
        callbacks.onComplete(event.data?.jobId ?? 'unknown-job', choices, {
          earlyExitEligible: Boolean(event.data?.earlyExitEligible),
          earlyExitDismissed: Boolean(event.data?.earlyExitDismissed),
        })
      } else if (event.type === 'error' && event.data?.message) {
        settled = true
        callbacks.onError(event.data.message)
      }
    })

    if (!settled) {
      callbacks.onError('Stream ended unexpectedly')
    }
  } catch (err) {
    if (err instanceof ApiError) {
      const { message, code } = parseApiErrorBody(err.body)
      callbacks.onError(
        message ?? `Request failed: ${err.status} ${err.statusText}`,
        err.status,
        code,
      )
      return
    }
    callbacks.onError(err instanceof Error ? err.message : 'Stream error')
  }
}
