'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFounderSessionStore } from '@/store/founder-session'
import { WelcomeStep } from '../welcome/WelcomeStep'
import { FounderDiscoveryStep } from '../session/FounderDiscoveryStep'

export function FounderSessionScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = useFounderSessionStore((s) => s.currentStep)
  const reset = useFounderSessionStore((s) => s.reset)

  useEffect(() => {
    if (searchParams.get('fresh') === 'true') {
      reset()
      const params = new URLSearchParams(searchParams.toString())
      params.delete('fresh')
      const qs = params.toString()
      router.replace(`/founder-session${qs ? `?${qs}` : ''}`)
    }
  }, [searchParams, reset, router])

  if (currentStep === 'welcome') {
    return <WelcomeStep />
  }

  return <FounderDiscoveryStep />
}
