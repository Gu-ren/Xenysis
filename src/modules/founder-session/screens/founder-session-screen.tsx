'use client'

import { useFounderSessionStore } from '@/store/founder-session'
import { WelcomeStep } from '../welcome/WelcomeStep'
import { FounderDiscoveryStep } from '../session/FounderDiscoveryStep'

export function FounderSessionScreen() {
  const currentStep = useFounderSessionStore((s) => s.currentStep)

  if (currentStep === 'welcome') {
    return <WelcomeStep />
  }

  return <FounderDiscoveryStep />
}
