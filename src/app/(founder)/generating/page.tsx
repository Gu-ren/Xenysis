import { AuthGuard } from '@/components/auth/auth-guard'
import { GenerationScreen } from '@/modules/startup-generation/screens/generation-screen'

export default function Page() {
  return (
    <AuthGuard>
      <GenerationScreen />
    </AuthGuard>
  )
}
