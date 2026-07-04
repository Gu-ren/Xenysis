import { apiGet, apiPost, getAccessTokenForRequest, hasBackend } from '@/lib/api'
import { EMPTY_UNDERSTANDING, type FounderUnderstanding } from '../types/understanding'
import {
  normalizeAnswerChoices,
  type AnswerChoice,
} from '../utils/answer-choices'

export interface ApiSession {
  id: string
  startup_id: string
  user_id: string
  idea: string
  status: 'active' | 'completed' | 'abandoned'
  messages_count: number
  created_at: string
  updated_at: string
}

export interface ApiSessionAnswer {
  id: string
  session_id: string
  question_id: string
  question_type: string
  question: string
  answer: string
  sequence_order: number
  created_at: string
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
      startup_id: startupId,
      user_id: 'mock-user',
      idea: params.idea,
      status: 'active',
      messages_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
  return data
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
  return data.understanding
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
  return data.understanding
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
  const { data } = await apiPost<{ questionText: string }, { data: { choices: unknown[] } }>(
    `/api/v1/startups/${startupId}/sessions/${sessionId}/generate-choices`,
    { questionText },
  )
  return normalizeAnswerChoices(data.choices)
}

// ── SSE chat stream ───────────────────────────────────────────────────────────

export interface ChatStreamEvent {
  type: 'delta' | 'done' | 'error'
  data: { content?: string; jobId?: string; message?: string; choices?: unknown[] }
}

export type OnChunk = (content: string) => void
export type OnComplete = (jobId: string, choices?: AnswerChoice[]) => void
export type OnError = (message: string, status?: number) => void

export async function streamChatMessage(
  startupId: string,
  sessionId: string,
  message: string,
  callbacks: { onChunk: OnChunk; onComplete: OnComplete; onError: OnError },
): Promise<void> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
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
    callbacks.onComplete('mock-job-id', mockChoices)
    return
  }

  const token = getAccessTokenForRequest()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/startups/${startupId}/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    },
  )

  if (!res.ok || !res.body) {
    callbacks.onError(`Request failed: ${res.status} ${res.statusText}`, res.status)
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const event = JSON.parse(line.slice(6)) as ChatStreamEvent
        if (event.type === 'delta' && event.data.content) {
          callbacks.onChunk(event.data.content)
        } else if (event.type === 'done' && event.data.jobId) {
          const choices = event.data.choices?.length
            ? normalizeAnswerChoices(event.data.choices)
            : undefined
          callbacks.onComplete(event.data.jobId, choices)
        } else if (event.type === 'error' && event.data.message) {
          callbacks.onError(event.data.message)
        }
      } catch { /* malformed SSE line */ }
    }
  }
}
