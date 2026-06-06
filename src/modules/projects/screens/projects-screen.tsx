"use client"

import { useStartups } from "../hooks/use-startups"
import { ProjectsContent } from "./projects-content"

export function ProjectsScreen() {
  const { startups } = useStartups()

  return (
    <ProjectsContent
      startups={startups}
      count={startups.length}
    />
  )
}
