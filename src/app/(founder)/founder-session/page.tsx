import { Suspense } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { FounderSessionScreen } from '@/modules/founder-session/screens/founder-session-screen'

export default function Page() {
  return (
    <AuthGuard>
      <Suspense>
        <FounderSessionScreen />
      </Suspense>
    </AuthGuard>
  )
}
