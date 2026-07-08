'use client'

import { useCallback, useRef, useState } from 'react'
import { apiPostSSE } from '@/lib/api'
import type { BlueprintContent } from '../types/blueprint-api'

export interface ChatMessage {
  id:         string
  role:       'user' | 'assistant'
  content:    string
  thinking?:  boolean
}

interface ChatEvent {
  type: 'chat_thinking' | 'chat_patch' | 'chat_complete' | 'chat_error'
  data: Record<string, unknown>
}

interface UseBlueprintChatOptions {
  startupId:        string
  onContentPatch:   (path: string, value: unknown) => void
  onContentReplace: (content: BlueprintContent) => void
}

interface UseBlueprintChatResult {
  messages:    ChatMessage[]
  isStreaming: boolean
  sendMessage: (text: string, currentContent: BlueprintContent) => Promise<void>
  clearMessages: () => void
}

export function useBlueprintChat({
  startupId,
  onContentPatch,
  onContentReplace,
}: UseBlueprintChatOptions): UseBlueprintChatResult {
  const [messages, setMessages]       = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming]  = useState(false)
  // Ref-based guard: synchronous, never stale unlike the state primitive.
  // Prevents concurrent sends even when setState hasn't flushed yet.
  const isStreamingRef                = useRef(false)
  const abortRef                      = useRef<AbortController | null>(null)

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setMessages((prev) => [...prev, { ...msg, id }])
    return id
  }, [])

  const updateMessage = useCallback((id: string, update: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...update } : m)),
    )
  }, [])

  const sendMessage = useCallback(
    async (text: string, currentContent: BlueprintContent) => {
      // Use the ref for the guard — synchronous, never stale unlike state.
      if (isStreamingRef.current) return

      isStreamingRef.current = true
      setIsStreaming(true)

      // Only abort after the guard passes so we never cancel a legitimate stream.
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      // Add the user message
      addMessage({ role: 'user', content: text })

      // Add a placeholder assistant message for streaming updates
      const assistantId = addMessage({ role: 'assistant', content: '', thinking: true })

      try {
        let thinkingText = 'Thinking…'

        await apiPostSSE(
          `/api/v1/startups/${startupId}/blueprints/chat`,
          { message: text, currentContent },
          (raw) => {
            const event = raw as ChatEvent
            if (!event?.type) return

            if (event.type === 'chat_thinking') {
              thinkingText = String(event.data.message ?? 'Thinking…')
              updateMessage(assistantId, { content: thinkingText, thinking: true })
            } else if (event.type === 'chat_patch') {
              const { path, value } = event.data as { path: string; value: unknown }
              onContentPatch(path, value)
              updateMessage(assistantId, {
                content: thinkingText,
                thinking: true,
              })
            } else if (event.type === 'chat_complete') {
              const content = event.data.content as BlueprintContent
              onContentReplace(content)
              updateMessage(assistantId, {
                content: 'Done! Your blueprint has been updated.',
                thinking: false,
              })
            } else if (event.type === 'chat_error') {
              updateMessage(assistantId, {
                content: String(event.data.message ?? 'Something went wrong. Please try again.'),
                thinking: false,
              })
            }
          },
          controller.signal,
        )
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          updateMessage(assistantId, {
            content: 'Connection error. Please try again.',
            thinking: false,
          })
        }
      } finally {
        isStreamingRef.current = false
        setIsStreaming(false)
      }
    },
    // isStreaming intentionally excluded — guard uses the ref, not state.
    // addMessage/updateMessage are stable (empty deps) so omitted too.
    [startupId, addMessage, updateMessage, onContentPatch, onContentReplace],
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isStreaming, sendMessage, clearMessages }
}
