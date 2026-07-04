'use client'

import { useEffect, useState } from 'react'
import { getUser } from './index'
import type { User } from './types'

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    let active = true

    async function loadUser() {
      const user = await getUser()
      if (active) {
        setState({ user, loading: false })
      }
    }

    loadUser()

    const onAuthChange = () => {
      setState((prev) => ({ ...prev, loading: true }))
      loadUser()
    }

    window.addEventListener('auth-change', onAuthChange)
    return () => {
      active = false
      window.removeEventListener('auth-change', onAuthChange)
    }
  }, [])

  return state
}
