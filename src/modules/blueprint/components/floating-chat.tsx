'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { AIChatPanel } from './ai-chat-panel'
import type { BlueprintContent } from '../types/blueprint-api'
import type { ChatSuggestion } from '../hooks/use-blueprint-chat'

interface FloatingChatProps {
  startupId: string
  content: BlueprintContent
  disabled?: boolean
  disabledReason?: string
  onContentPatch: (path: string, value: unknown) => void
  onContentReplace: (content: BlueprintContent) => void
  onSuggestion?: (suggestion: ChatSuggestion) => void
  onReady?: (api: { appendSystemNote: (text: string) => void }) => void
}

export function FloatingChat({
  startupId,
  content,
  disabled = false,
  disabledReason,
  onContentPatch,
  onContentReplace,
  onSuggestion,
  onReady,
}: FloatingChatProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[360px] h-[min(70vh,560px)] rounded-2xl border border-white/[0.1] bg-[#0f0f0f] shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div>
              <p className="text-sm font-medium text-white">AI Blueprint Editor</p>
              {disabled && disabledReason ? (
                <p className="text-[11px] text-amber-400/90 mt-0.5">{disabledReason}</p>
              ) : (
                <p className="text-[11px] text-zinc-500 mt-0.5">Suggestions require your approval</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <AIChatPanel
              startupId={startupId}
              content={content}
              compact
              disabled={disabled}
              onContentPatch={onContentPatch}
              onContentReplace={onContentReplace}
              onSuggestion={onSuggestion}
              onReady={onReady}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 flex items-center justify-center transition-colors"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  )
}
