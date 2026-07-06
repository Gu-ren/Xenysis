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

export { getAccessTokenForRequest }
