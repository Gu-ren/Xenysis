import { StartupCard } from "./startup-card"
import { StartupGhostCard } from "./startup-ghost-card"
import type { StartupWithHealth } from "../types"

interface StartupGridProps {
  startups: StartupWithHealth[]
}

export function StartupGrid({ startups }: StartupGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
      <StartupGhostCard />
    </div>
  )
}
