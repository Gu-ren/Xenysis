'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBlueprintChat } from '../hooks/use-blueprint-chat'
import type { ChatMessage } from '../hooks/use-blueprint-chat'
import type { BlueprintContent } from '../types/blueprint-api'

interface AIChatPanelProps {
  startupId:        string
  content:          BlueprintContent
  onContentPatch:   (path: string, value: unknown) => void
  onContentReplace: (content: BlueprintContent) => void
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-emerald-500 inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}

function MessageBubble({
  message,
  onChoiceClick,
  isStreaming,
}: {
  message:       ChatMessage
  onChoiceClick: (choice: string) => void
  isStreaming:   boolean
}) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed',
          isUser
            ? 'bg-emerald-600/20 border border-emerald-500/20 text-zinc-200 rounded-br-sm'
            : 'bg-white/[0.04] border border-white/[0.06] text-zinc-400 rounded-bl-sm',
        )}
      >
        {message.content || (message.thinking ? <ThinkingDots /> : null)}
        {message.thinking && message.content && <ThinkingDots />}

        {/* Clarify choice chips — only on assistant messages */}
        {!isUser && message.clarify && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.clarify.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => onChoiceClick(choice)}
                disabled={isStreaming}
                className={cn(
                  'text-[11px] px-2.5 py-1.5 rounded-lg border',
                  'border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-400',
                  'hover:bg-emerald-500/[0.16] hover:border-emerald-500/40 transition-colors',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                )}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  'Make the tagline more compelling',
  'Add a risk for technical debt',
  'Expand the MVP scope features',
  'Rewrite the problem statement',
]

export function AIChatPanel({
  startupId,
  content,
  onContentPatch,
  onContentReplace,
}: AIChatPanelProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef               = useRef<HTMLDivElement>(null)
  const inputRef                     = useRef<HTMLTextAreaElement>(null)

  const { messages, isStreaming, sendMessage, clearMessages } = useBlueprintChat({
    startupId,
    onContentPatch,
    onContentReplace,
  })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || isStreaming) return
    setInputValue('')
    await sendMessage(text, content)
  }

  const handleChoiceClick = async (choice: string) => {
    if (isStreaming) return
    await sendMessage(choice, content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <aside className="relative">
      <div className="sticky top-[73px] h-[calc(100vh-89px)] flex flex-col bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-emerald-500" />
            </div>
            <span className="text-[12px] font-semibold text-white/80 tracking-tight">
              AI Blueprint Editor
            </span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-emerald-500/60" />
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed mb-4">
                Ask me to edit any part of your blueprint in plain English.
              </p>
              <div className="space-y-1.5 w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInputValue(s)}
                    className="w-full text-left text-[11px] px-3 py-2 rounded-lg border border-white/[0.05] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.1] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onChoiceClick={handleChoiceClick}
                  isStreaming={isStreaming}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-white/[0.05] px-3 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Change the tagline to…"
              disabled={isStreaming}
              rows={2}
              className={cn(
                'flex-1 resize-none bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2',
                'text-[12px] text-zinc-300 placeholder:text-zinc-600',
                'focus:outline-none focus:border-emerald-500/40 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all',
                inputValue.trim() && !isStreaming
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-white/[0.04] text-zinc-600 cursor-not-allowed',
              )}
            >
              {isStreaming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-zinc-700 mt-1.5">
            ↵ send · shift+↵ newline
          </p>
        </div>
      </div>
    </aside>
  )
}
