import { fetchStartups } from "../services/startups"
import { ProjectsContent } from "./projects-content"

export async function ProjectsScreen() {
  const startups = await fetchStartups()
  const count = startups.length

  return (
    <ProjectsContent
      startups={startups}
      count={count}
    />
  )
}
