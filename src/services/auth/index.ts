import { supabase } from './client'
import type { User, Session, AuthError } from './types'

export type { User, Session, AuthError }

export async function signInWithEmail(
  email: string,
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOtp({ email })
  return { error: error ? { message: error.message, code: error.code } : null }
}

export async function verifyOtp(
  email: string,
  token: string,
): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) return { session: null, error: { message: error.message, code: error.code } }

  const s = data.session
  if (!s) return { session: null, error: null }

  return {
    session: {
      user: {
        id: s.user.id,
        email: s.user.email ?? '',
        createdAt: s.user.created_at,
      },
      accessToken: s.access_token,
      expiresAt: s.expires_at ?? 0,
    },
    error: null,
  }
}

export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  return { error: error ? { message: error.message, code: error.code } : null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      createdAt: session.user.created_at,
    },
    accessToken: session.access_token,
    expiresAt: session.expires_at ?? 0,
  }
}

export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? '',
    createdAt: user.created_at,
  }
}
