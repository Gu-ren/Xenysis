import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { WorkspaceGraph } from '@/modules/workspace/types'

interface StartupState {
  startupId: string | null
  graph: WorkspaceGraph | null
}

interface StartupActions {
  setStartup: (startupId: string, graph: WorkspaceGraph) => void
  clear: () => void
}

type StartupStore = StartupState & StartupActions

export const useStartupStore = create<StartupStore>()(
  persist(
    (set) => ({
      startupId: null,
      graph: null,
      setStartup: (startupId, graph) => set({ startupId, graph }),
      clear: () => set({ startupId: null, graph: null }),
    }),
    {
      name: 'xenysis-startup',
      storage: createJSONStorage(() => sessionStorage),
      // graph excluded: WorkspaceAsset.icon is an ElementType (function ref) — not
      // JSON-serializable. WorkspaceScreen re-fetches via getWorkspaceGraph(startupId).
      partialize: (state) => ({ startupId: state.startupId }),
    }
  )
)
