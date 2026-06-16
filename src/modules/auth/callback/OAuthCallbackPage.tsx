'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/services/auth/client'

export function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const exchanged = useRef(false)

  useEffect(() => {
    if (exchanged.current) return
    exchanged.current = true

    const code = searchParams.get('code')

    async function finish() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            router.replace('/login')
            return
          }
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/login')
          return
        }
      }

      router.replace('/founder-session')
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
