'use client'

import { useState, useCallback, useRef } from 'react'
import { getAccessTokenForRequest } from '@/lib/api'
import { useFounderSessionStore } from '@/store/founder-session'
import { useStartupStore } from '@/store/startup'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GenerateStage =
  | 'idle'
  | 'generating-oa'
  | 'generating-blueprint'
  | 'complete'
  | 'error'

export interface GenerateReportState {
  stage:      GenerateStage
  stageLabel: string
  error:      string | null
}

const STAGE_LABELS: Record<GenerateStage, string> = {
  'idle':                 '',
  'generating-oa':        'Analyzing your session...',
  'generating-blueprint': 'Building your blueprint...',
  'complete':             'Done',
  'error':                'Generation failed',
}

// ── SSE helper ────────────────────────────────────────────────────────────────
// Streams a POST endpoint that emits GenerationEvents and resolves when a
// `complete` event arrives, or rejects on `error` or stream close without complete.

type GenerationEvent =
  | { type: 'stage';    data: { stageId: string; label: string; sublabel: string; state: string } }
  | { type: 'progress'; data: { percent: number } }
  | { type: 'log';      data: { message: string; level: string } }
  | { type: 'complete'; data: { artifactId: string; versionId: string; artifactType: string } }
  | { type: 'error';    data: { code: string; message: string; retryable: boolean } }

async function streamGenerationEndpoint(
  url:    string,
  token:  string | undefined,
  signal: AbortSignal,
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(url, { method: 'POST', headers, signal })

  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const reader  = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer    = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      let event: GenerationEvent
      try { event = JSON.parse(line.slice(6)) } catch { continue }

      if (event.type === 'complete') return
      if (event.type === 'error') throw new Error(event.data.message)
    }
  }

  // Stream closed without a complete event — treat as an error.
  throw new Error('Generation stream ended without a completion signal')
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGenerateReport() {
  const startupId        = useFounderSessionStore((s) => s.startupId)
  const sessionId        = useFounderSessionStore((s) => s.sessionId)
  const syncStartupStore = useStartupStore((s) => s.setStartupId)

  const [state, setState] = useState<GenerateReportState>({
    stage:      'idle',
    stageLabel: '',
    error:      null,
  })

  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (): Promise<'complete' | 'error'> => {
    if (!startupId || !sessionId) {
      setState({ stage: 'error', stageLabel: STAGE_LABELS['error'], error: 'Session context missing' })
      return 'error'
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const token = getAccessTokenForRequest()

    const base = process.env.NEXT_PUBLIC_API_URL ?? ''

    // Stage 1 — Opportunity Assessment
    setState({ stage: 'generating-oa', stageLabel: STAGE_LABELS['generating-oa'], error: null })
    try {
      await streamGenerationEndpoint(
        `${base}/api/v1/startups/${startupId}/sessions/${sessionId}/opportunity-assessment`,
        token,
        controller.signal,
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'error'
      const msg = err instanceof Error ? err.message : 'Opportunity assessment failed'
      setState({ stage: 'error', stageLabel: STAGE_LABELS['error'], error: msg })
      return 'error'
    }

    // Stage 2 — Blueprint
    setState({ stage: 'generating-blueprint', stageLabel: STAGE_LABELS['generating-blueprint'], error: null })
    try {
      await streamGenerationEndpoint(
        `${base}/api/v1/startups/${startupId}/blueprints/generate`,
        token,
        controller.signal,
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'error'
      const msg = err instanceof Error ? err.message : 'Blueprint generation failed'
      setState({ stage: 'error', stageLabel: STAGE_LABELS['error'], error: msg })
      return 'error'
    }

    // Sync the startup ID into the store that useBlueprint reads from,
    // so the /session-summary page can retrieve the just-generated blueprint.
    syncStartupStore(startupId)

    setState({ stage: 'complete', stageLabel: STAGE_LABELS['complete'], error: null })
    return 'complete'
  }, [startupId, sessionId])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ stage: 'idle', stageLabel: '', error: null })
  }, [])

  return { ...state, generate, reset }
}
