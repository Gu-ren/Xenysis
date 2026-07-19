// Typed API client. Calls NEXT_PUBLIC_API_URL (Railway) when set.
// All requests include the JWT access token as an Authorization: Bearer header.

import { getAccessTokenForRequest, refreshSession } from '@/services/auth'
import { getAuthHeader } from '@/services/auth/storage'

export const hasBackend = Boolean(process.env.NEXT_PUBLIC_API_URL)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly path: string,
    public readonly method: string,
    public readonly body?: unknown,
  ) {
    super(`[api] ${method} ${path} → ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

async function baseHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const auth = getAuthHeader()
  if (auth) {
    headers['Authorization'] = auth
  }
  return headers
}

async function handleResponse<T>(res: Response, method: string, path: string): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, res.statusText, path, method)
  return res.json() as Promise<T>
}

async function fetchWithAuth(
  path: string,
  init: RequestInit,
  method: string,
  retried = false,
): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: await baseHeaders(),
    cache: 'no-store',
  })

  if (res.status === 401 && !retried) {
    const session = await refreshSession()
    if (session) {
      return fetchWithAuth(path, init, method, true)
    }
  }

  return res
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(path, {}, 'GET')
  return handleResponse<T>(res, 'GET', path)
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetchWithAuth(path, {
    method: 'POST',
    body: JSON.stringify(body),
  }, 'POST')
  return handleResponse<TResponse>(res, 'POST', path)
}

export async function apiPatch<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetchWithAuth(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }, 'PATCH')
  return handleResponse<TResponse>(res, 'PATCH', path)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(path, { method: 'DELETE' }, 'DELETE')
  return handleResponse<T>(res, 'DELETE', path)
}

// ── SSE streaming POST ────────────────────────────────────────────────────────
// Sends a POST and calls `onEvent` for each parsed SSE data line.
// Handles 401 → token refresh → retry (once) same as fetchWithAuth.
export async function apiPostSSE<TBody>(
  path: string,
  body: TBody,
  onEvent: (event: unknown) => void,
  signal?: AbortSignal,
): Promise<void> {
  const headers = await baseHeaders()
  const init: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
    signal,
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...init, cache: 'no-store' })

  if (res.status === 401) {
    const session = await refreshSession()
    if (session) {
      const retryHeaders = await baseHeaders()
      res = await fetch(`${BASE_URL}${path}`, { ...init, headers: retryHeaders, cache: 'no-store' })
    }
  }

  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = undefined
    }
    throw new ApiError(res.status, res.statusText, path, 'POST', body)
  }
  if (!res.body) throw new Error('No response body for SSE stream')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const emitLine = (line: string) => {
    if (!line.startsWith('data: ')) return
    try {
      onEvent(JSON.parse(line.slice(6)))
    } catch {
      // ignore malformed lines
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) emitLine(line)
  }

  // Flush any trailing SSE payload that lacked a final newline.
  if (buffer.trim()) emitLine(buffer.trim())
}

export { getAccessTokenForRequest }
