import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface StartupState {
  startupId: string | null
}

interface StartupActions {
  setStartupId: (startupId: string) => void
  clear: () => void
}

type StartupStore = StartupState & StartupActions

export const useStartupStore = create<StartupStore>()(
  persist(
    (set) => ({
      startupId: null,
      setStartupId: (startupId) => set({ startupId }),
      clear: () => set({ startupId: null }),
    }),
    {
      name: 'xenysis-startup',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ startupId: state.startupId }),
    }
  )
)
