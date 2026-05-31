import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  SessionStep,
  FounderAnswer,
  StartupBlueprint,
} from '@/modules/founder-session/types'

interface FounderSessionState {
  idea: string
  currentStep: SessionStep
  answers: FounderAnswer[]
  blueprint: StartupBlueprint | null
  generationProgress: number
  generatedStartupId: string | null
  canvasPingAt: number | null
}

interface FounderSessionActions {
  setIdea: (idea: string) => void
  setStep: (step: SessionStep) => void
  addAnswer: (answer: FounderAnswer) => void
  setBlueprint: (blueprint: StartupBlueprint) => void
  setGenerationProgress: (progress: number) => void
  setGeneratedStartupId: (id: string) => void
  pingCanvas: () => void
  reset: () => void
}

type FounderSessionStore = FounderSessionState & FounderSessionActions

const initialState: FounderSessionState = {
  idea: '',
  currentStep: 'welcome',
  answers: [],
  blueprint: null,
  generationProgress: 0,
  generatedStartupId: null,
  canvasPingAt: null,
}

export const useFounderSessionStore = create<FounderSessionStore>()(
  persist(
    (set) => ({
      ...initialState,
      setIdea: (idea) => set({ idea }),
      setStep: (currentStep) => set({ currentStep }),
      addAnswer: (answer) =>
        set((state) => ({ answers: [...state.answers, answer] })),
      setBlueprint: (blueprint) => set({ blueprint }),
      setGenerationProgress: (generationProgress) => set({ generationProgress }),
      setGeneratedStartupId: (generatedStartupId) => set({ generatedStartupId }),
      pingCanvas: () => set({ canvasPingAt: Date.now() }),
      reset: () => set(initialState),
    }),
    {
      name: 'xenysis-founder-session',
      storage: createJSONStorage(() => sessionStorage),
      // canvasPingAt excluded — real-time event timestamp, meaningless after reload
      partialize: (state) => ({
        idea: state.idea,
        currentStep: state.currentStep,
        answers: state.answers,
        blueprint: state.blueprint,
        generationProgress: state.generationProgress,
        generatedStartupId: state.generatedStartupId,
      }),
    }
  )
)
