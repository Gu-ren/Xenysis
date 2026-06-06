import type { User } from './types'

interface AuthState {
  user: User | null
  loading: boolean
}

// BACKEND: replace stub with real session subscription
// e.g. supabase.auth.onAuthStateChange or useSession() from next-auth
export function useAuth(): AuthState {
  return { user: null, loading: false }
}
