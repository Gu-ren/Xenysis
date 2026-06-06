// Typed API client. Routes calls to the backend when NEXT_PUBLIC_API_URL is set,
// otherwise the caller is responsible for falling back to mock data.
//
// Usage in services:
//   import { apiGet, apiPost, hasBackend } from '@/lib/api'
//   if (hasBackend) return apiGet<MyType>('/my-endpoint')
//   return mockFallback()

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

// BACKEND: inject auth token once auth is implemented
// e.g. const token = await getAccessToken(); headers['Authorization'] = `Bearer ${token}`
function baseHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' }
}

async function handleResponse<T>(res: Response, method: string, path: string): Promise<T> {
  if (!res.ok) throw new ApiError(res.status, res.statusText, path, method)
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: baseHeaders(),
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
    headers: baseHeaders(),
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
    headers: baseHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  return handleResponse<TResponse>(res, 'PATCH', path)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: baseHeaders(),
    cache: 'no-store',
  })
  return handleResponse<T>(res, 'DELETE', path)
}
