import type { User, Session, AuthError } from "./types"

export type { User, Session, AuthError }

// BACKEND: await supabase.auth.signInWithOtp({ email })
export async function signInWithEmail(
  _email: string
): Promise<{ error: AuthError | null }> {
  throw new Error("Auth not yet implemented")
}

// BACKEND: await supabase.auth.verifyOtp({ email, token, type: "email" })
export async function verifyOtp(
  _email: string,
  _token: string
): Promise<{ session: Session | null; error: AuthError | null }> {
  throw new Error("Auth not yet implemented")
}

// BACKEND: await supabase.auth.signOut()
export async function signOut(): Promise<void> {
  throw new Error("Auth not yet implemented")
}

// BACKEND: const { data } = await supabase.auth.getSession(); return data.session
export async function getSession(): Promise<Session | null> {
  return null
}

// BACKEND: const { data } = await supabase.auth.getUser(); return data.user
export async function getUser(): Promise<User | null> {
  return null
}
