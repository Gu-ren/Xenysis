import { SessionHeader } from './SessionHeader'
import { StartupCanvas } from './components/startup-canvas'
import { ConversationPane } from './components/conversation-pane'
import { CLARITY_SEGMENTS } from './constants'

export function FounderDiscoveryStep() {
  return (
    <div className="flex flex-col h-full bg-background">
      <SessionHeader claritySegments={CLARITY_SEGMENTS} />
      <div className="flex flex-1 min-h-0">
        <div className="w-[54%] border-r border-border min-w-0">
          <StartupCanvas />
        </div>
        <div className="flex-1 min-w-0">
          <ConversationPane />
        </div>
      </div>
    </div>
  )
}
