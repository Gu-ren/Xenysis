import type { Startup, StartupHealth } from "@/types"

export interface StartupWithHealth extends Startup {
  health: StartupHealth
}
