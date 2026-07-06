import type { User, Session, AuthError } from './types'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './storage'

export type { User, Session, AuthError }

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

async function authFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data?: T; error: AuthError | null }> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })

    const body = (await res.json()) as T & ApiErrorBody

    if (!res.ok) {
      return {
        error: {
          message: body.error?.message ?? 'Request failed',
          code: body.error?.code,
        },
      }
    }

    return { data: body as T, error: null }
  } catch {
    return { error: { message: 'Network error' } }
  }
}

export async function register(
  email: string,
  password: string,
): Promise<{ error: AuthError | null }> {
  const { error } = await authFetch<{ data: { message: string } }>(
    '/api/v1/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  )
  return { error }
}

export async function login(
  email: string,
  password: string,
): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await authFetch<{
    data: {
      user: { id: string; email: string; createdAt: string }
      accessToken: string
      refreshToken: string
    }
  }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (error || !data?.data) {
    return { session: null, error: error ?? { message: 'Login failed' } }
  }

  const { user, accessToken, refreshToken } = data.data
  setTokens(accessToken, refreshToken)

  return {
    session: {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      accessToken,
      expiresAt: 0,
    },
    error: null,
  }
}

export async function refreshSession(): Promise<Session | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const { data, error } = await authFetch<{
    data: {
      user: { id: string; email: string; createdAt: string }
      accessToken: string
      refreshToken: string
    }
  }>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })

  if (error || !data?.data) {
    clearTokens()
    return null
  }

  const { user, accessToken, refreshToken: newRefresh } = data.data
  setTokens(accessToken, newRefresh)

  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    accessToken,
    expiresAt: 0,
  }
}

export async function signOut(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    await authFetch('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }
  clearTokens()
}

export async function getSession(): Promise<Session | null> {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return null

  const { data, error } = await authFetch<{
    data: { id: string; email: string; profile: unknown }
  }>('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!error && data?.data) {
    return {
      user: {
        id: data.data.id,
        email: data.data.email,
        createdAt: '',
      },
      accessToken,
      expiresAt: 0,
    }
  }

  return refreshSession()
}

export async function getUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export function signInWithGoogle(): void {
  const redirectUri = `${window.location.origin}/auth/callback`
  const url = new URL(`${BASE_URL}/api/v1/auth/google`)
  url.searchParams.set('redirect_uri', redirectUri)
  window.location.href = url.toString()
}

export function storeOAuthTokens(accessToken: string, refreshToken: string): Session {
  setTokens(accessToken, refreshToken)
  return {
    user: { id: '', email: '', createdAt: '' },
    accessToken,
    expiresAt: 0,
  }
}

export function getAccessTokenForRequest(): string | undefined {
  return getAccessToken() ?? undefined
}
