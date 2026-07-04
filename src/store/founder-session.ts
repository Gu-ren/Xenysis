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
  startupId: string | null
  sessionId: string | null
  lastExchangeAt: number | null
  isSessionComplete: boolean
  isTyping: boolean
  isStreaming: boolean
  continueDiscoveryPingAt: number | null
}

interface FounderSessionActions {
  setIdea: (idea: string) => void
  setStep: (step: SessionStep) => void
  addAnswer: (answer: FounderAnswer) => void
  setBlueprint: (blueprint: StartupBlueprint) => void
  setGenerationProgress: (progress: number) => void
  setGeneratedStartupId: (id: string) => void
  setStartupId: (id: string) => void
  setSessionId: (id: string) => void
  pingCanvas: () => void
  pingExchange: () => void
  setIsSessionComplete: (v: boolean) => void
  setIsTyping: (v: boolean) => void
  setIsStreaming: (v: boolean) => void
  requestContinueDiscovery: () => void
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
  startupId: null,
  sessionId: null,
  lastExchangeAt: null,
  isSessionComplete: false,
  isTyping: false,
  isStreaming: false,
  continueDiscoveryPingAt: null,
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
      setStartupId: (startupId) => set({ startupId }),
      setSessionId: (sessionId) => set({ sessionId }),
      pingCanvas: () => set({ canvasPingAt: Date.now() }),
      pingExchange: () => set({ lastExchangeAt: Date.now() }),
      setIsSessionComplete: (isSessionComplete) => set({ isSessionComplete }),
      setIsTyping: (isTyping) => set({ isTyping }),
      setIsStreaming: (isStreaming) => set({ isStreaming }),
      requestContinueDiscovery: () => set({ continueDiscoveryPingAt: Date.now() }),
      reset: () => set(initialState),
    }),
    {
      name: 'xenysis-founder-session',
      storage: createJSONStorage(() => localStorage),
      // canvasPingAt and lastExchangeAt excluded — real-time timestamps, meaningless after reload
      partialize: (state) => ({
        idea: state.idea,
        currentStep: state.currentStep,
        answers: state.answers,
        blueprint: state.blueprint,
        generationProgress: state.generationProgress,
        generatedStartupId: state.generatedStartupId,
        startupId: state.startupId,
        sessionId: state.sessionId,
      }),
    }
  )
)
