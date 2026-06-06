'use client'

import { useEffect, useState } from 'react'
import { supabase } from './client'
import type { User } from './types'

interface AuthState {
  user: User | null
  loading: boolean
}

function toAppUser(supabaseUser: { id: string; email?: string; created_at: string }): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    createdAt: supabaseUser.created_at,
  }
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    // getUser() verifies the session against the server (catches deleted accounts)
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({
        user: user ? toAppUser(user) : null,
        loading: false,
      })
    })

    // Subscribe to all future auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ? toAppUser(session.user) : null,
        loading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
