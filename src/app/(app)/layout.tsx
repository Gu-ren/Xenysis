import { AuthGuard } from '@/components/auth/auth-guard'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {children}
      </div>
    </AuthGuard>
  )
}
