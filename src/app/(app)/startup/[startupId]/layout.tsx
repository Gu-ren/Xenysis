import { StartupHeader } from "@/components/layout/startup-header"
import { StartupDock } from "@/components/layout/startup-dock"

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <StartupHeader />
      <StartupDock />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
