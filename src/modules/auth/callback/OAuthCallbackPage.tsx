'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { storeOAuthTokens, getUser } from '@/services/auth'

export function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const error = searchParams.get('error')

    async function finish() {
      if (error || !accessToken || !refreshToken) {
        router.replace('/login')
        return
      }

      storeOAuthTokens(accessToken, refreshToken)
      const user = await getUser()
      if (!user) {
        router.replace('/login')
        return
      }

      router.replace('/dashboard')
    }

    finish()
  }, [router, searchParams])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0A0A' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
        />
        <p className="text-[12px] text-foreground/30 font-mono">Signing you in…</p>
      </div>
    </div>
  )
}
