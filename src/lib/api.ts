// Typed API client. Calls NEXT_PUBLIC_API_URL (Railway) when set.
// All requests include the Supabase access token as an Authorization: Bearer header.

import { supabase } from '@/services/auth/client'

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

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
  } catch {
    // No active session — request proceeds without auth header
  }

  return headers
}

async function handleResponse<T>(res: Response, method: string, path: string): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, res.statusText, path, method)
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: await baseHeaders(),
    cache: 'no-store',
  })
  return handleResponse<T>(res, 'GET', path)
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: await baseHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  return handleResponse<TResponse>(res, 'POST', path)
}

export async function apiPatch<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: await baseHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  return handleResponse<TResponse>(res, 'PATCH', path)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: await baseHeaders(),
    cache: 'no-store',
  })
  return handleResponse<T>(res, 'DELETE', path)
}
