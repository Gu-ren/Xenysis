import { ConversationPane } from './components/conversation-pane'
import { NotebookPanel } from './components/notebook-panel'

export function FounderDiscoveryStep() {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="w-[44%] border-r border-border flex flex-col min-w-0 overflow-hidden">
        <ConversationPane />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <NotebookPanel />
      </div>
    </div>
  )
}
