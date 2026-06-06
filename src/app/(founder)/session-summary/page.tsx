import { AuthGuard } from '@/components/auth/auth-guard'
import { SummaryStep } from '@/modules/founder-session/summary/SummaryStep'

export default function Page() {
  return (
    <AuthGuard>
      <SummaryStep />
    </AuthGuard>
  )
}
