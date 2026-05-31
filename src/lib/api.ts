// Typed API client. Routes calls to the backend when NEXT_PUBLIC_API_URL is set,
// otherwise the caller is responsible for falling back to mock data.
//
// Usage in services:
//   import { apiGet, apiPost, hasBackend } from '@/lib/api'
//   if (hasBackend) return apiGet<MyType>('/my-endpoint')
//   return mockFallback()

export const hasBackend = Boolean(process.env.NEXT_PUBLIC_API_URL)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`[api] GET ${path} → ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`[api] POST ${path} → ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<TResponse>
}
