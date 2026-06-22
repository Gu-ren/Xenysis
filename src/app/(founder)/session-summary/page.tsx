import { AuthGuard } from '@/components/auth/auth-guard'
import { BlueprintPage } from '@/modules/blueprint/BlueprintPage'

export default function Page() {
  return (
    <AuthGuard>
      <BlueprintPage />
    </AuthGuard>
  )
}
