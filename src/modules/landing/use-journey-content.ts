import { useJourney } from "./journey-context"
import { getJourneyContent } from "./content"

export function useJourneyContent() {
  const journey = useJourney()
  return getJourneyContent(journey)
}
