'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/services/auth/use-auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signup')
    }
  }, [loading, user, router])

  if (loading || !user) return null

  return <>{children}</>
}
