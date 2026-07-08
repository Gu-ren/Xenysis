import { AuthGuard } from '@/components/auth/auth-guard'
import { ProjectsDashboard } from '@/modules/projects/screens/ProjectsDashboard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <ProjectsDashboard />
    </AuthGuard>
  )
}
