import { GlobalRail } from "@/components/layout/global-rail"
import { AppHeader } from "@/components/layout/app-header"

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <GlobalRail />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
