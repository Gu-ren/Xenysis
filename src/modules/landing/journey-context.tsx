"use client"

import { createContext, useContext } from "react"
import type { Journey } from "./types"

const JourneyContext = createContext<Journey>("startup")

export function JourneyProvider({ journey, children }: { journey: Journey; children: React.ReactNode }) {
  return <JourneyContext.Provider value={journey}>{children}</JourneyContext.Provider>
}

export function useJourney(): Journey {
  return useContext(JourneyContext)
}
