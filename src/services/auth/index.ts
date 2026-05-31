import type { User, Session, AuthError } from "./types"

export type { User, Session, AuthError }

export async function signInWithEmail(
  _email: string
): Promise<{ error: AuthError | null }> {
  // TODO: supabase.auth.signInWithOtp({ email })
  throw new Error("Auth not yet implemented")
}

export async function verifyOtp(
  _email: string,
  _token: string
): Promise<{ session: Session | null; error: AuthError | null }> {
  // TODO: supabase.auth.verifyOtp({ email, token, type: "email" })
  throw new Error("Auth not yet implemented")
}

export async function signOut(): Promise<void> {
  // TODO: supabase.auth.signOut()
  throw new Error("Auth not yet implemented")
}

export async function getSession(): Promise<Session | null> {
  // TODO: supabase.auth.getSession()
  return null
}

export async function getUser(): Promise<User | null> {
  // TODO: supabase.auth.getUser()
  return null
}
