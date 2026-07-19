'use client'

import { useCallback, useRef, useState } from 'react'
import { apiPostSSE } from '@/lib/api'
import type { AnalyzeChangesResult, BlueprintContent } from '../types/blueprint-api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: boolean
  clarify?: { question: string; choices: string[] }
}

export interface ChatSuggestion {
  summary: string
  rationale: string
  patch: Partial<BlueprintContent> | null
  previewContent: BlueprintContent
}

interface ChatEvent {
  type:
    | 'chat_thinking'
    | 'chat_patch'
    | 'chat_complete'
    | 'chat_error'
    | 'chat_clarify'
    | 'chat_suggestion'
  data: Record<string, unknown>
}

interface UseBlueprintChatOptions {
  startupId: string
  onContentPatch: (path: string, value: unknown) => void
  onContentReplace: (content: BlueprintContent) => void
  onSuggestion?: (suggestion: ChatSuggestion) => void
}

interface UseBlueprintChatResult {
  messages: ChatMessage[]
  isStreaming: boolean
  sendMessage: (text: string, currentContent: BlueprintContent) => Promise<void>
  clearMessages: () => void
  appendSystemNote: (text: string) => void
}

export function useBlueprintChat({
  startupId,
  onContentPatch,
  onContentReplace,
  onSuggestion,
}: UseBlueprintChatOptions): UseBlueprintChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const isStreamingRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])
  messagesRef.current = messages
  const onSuggestionRef = useRef(onSuggestion)
  onSuggestionRef.current = onSuggestion

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setMessages((prev) => [...prev, { ...msg, id }])
    return id
  }, [])

  const updateMessage = useCallback((id: string, update: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...update } : m)))
  }, [])

  const appendSystemNote = useCallback(
    (text: string) => {
      addMessage({ role: 'assistant', content: text })
    },
    [addMessage],
  )

  const sendMessage = useCallback(
    async (text: string, currentContent: BlueprintContent) => {
      if (isStreamingRef.current) return

      isStreamingRef.current = true
      setIsStreaming(true)

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const history = messagesRef.current
        .filter((m) => !m.thinking && m.content.trim() !== '')
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }))

      addMessage({ role: 'user', content: text })
      const assistantId = addMessage({ role: 'assistant', content: '', thinking: true })

      try {
        let thinkingText = 'Thinking…'

        await apiPostSSE(
          `/api/v1/startups/${startupId}/blueprints/chat`,
          { message: text, currentContent, history },
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
            } else if (event.type === 'chat_suggestion') {
              const summary = String(event.data.summary ?? 'Suggested updates ready for review.')
              const rationale = String(event.data.rationale ?? '')
              const patch = (event.data.patch as Partial<BlueprintContent> | null) ?? null
              const previewContent = event.data.previewContent as BlueprintContent
              onSuggestionRef.current?.({ summary, rationale, patch, previewContent })
              updateMessage(assistantId, {
                content: summary + (rationale ? `\n\n${rationale}` : ''),
                thinking: false,
              })
            } else if (event.type === 'chat_complete') {
              // Legacy path — treat as suggestion if content provided
              const content = event.data.content as BlueprintContent | undefined
              if (content) {
                onSuggestionRef.current?.({
                  summary: 'Suggested updates ready for review.',
                  rationale: '',
                  patch: null,
                  previewContent: content,
                })
                updateMessage(assistantId, {
                  content: 'Suggested updates are ready — review to apply.',
                  thinking: false,
                })
              } else {
                updateMessage(assistantId, {
                  content: 'Done.',
                  thinking: false,
                })
              }
            } else if (event.type === 'chat_error') {
              updateMessage(assistantId, {
                content: String(event.data.message ?? 'Something went wrong. Please try again.'),
                thinking: false,
              })
            } else if (event.type === 'chat_clarify') {
              const { question, choices } = event.data as {
                question: string
                choices: string[]
              }
              updateMessage(assistantId, {
                content: question,
                thinking: false,
                clarify: { question, choices },
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
    [startupId, addMessage, updateMessage, onContentPatch, onContentReplace],
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isStreaming, sendMessage, clearMessages, appendSystemNote }
}

export type { AnalyzeChangesResult }
