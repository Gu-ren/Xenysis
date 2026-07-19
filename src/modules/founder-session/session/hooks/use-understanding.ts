'use client'

import { useState, useEffect, useRef } from 'react'
import { useFounderSessionStore } from '@/store/founder-session'
import { fetchUnderstanding } from '../../services/sessions'
import { EMPTY_UNDERSTANDING, type FounderUnderstanding } from '../../types/understanding'

// Polls the understanding endpoint:
//   - Once on mount when a session is present (initial load)
//   - After each exchange (lastExchangeAt changes): immediate fetch, then every 1s up to 8 times,
//     stopping early if isComplete becomes true
//
// Writes isComplete back to the founder session store so ConversationPane
// can read it without a second polling instance.
export function useUnderstanding(): FounderUnderstanding {
  const startupId = useFounderSessionStore((s) => s.startupId)
  const sessionId = useFounderSessionStore((s) => s.sessionId)
  const lastExchangeAt = useFounderSessionStore((s) => s.lastExchangeAt)
  const setIsSessionComplete = useFounderSessionStore((s) => s.setIsSessionComplete)

  const [understanding, setUnderstanding] = useState<FounderUnderstanding>(EMPTY_UNDERSTANDING)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCountRef = useRef(0)
  const isCompleteRef = useRef(false)

  const applyUpdate = (data: FounderUnderstanding) => {
    setUnderstanding(data)
    if (data.isComplete && !isCompleteRef.current) {
      isCompleteRef.current = true
      setIsSessionComplete(true)
    }
  }

  // Initial fetch when session IDs become available
  useEffect(() => {
    if (!startupId || !sessionId) return
    fetchUnderstanding(startupId, sessionId)
      .then(applyUpdate)
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId, sessionId])

  // After each exchange: immediate poll, then burst-poll to catch fire-and-forget updates
  useEffect(() => {
    if (!lastExchangeAt || !startupId || !sessionId) return
    if (isCompleteRef.current) return

    if (pollingRef.current) clearInterval(pollingRef.current)
    pollCountRef.current = 0

    const tick = async () => {
      pollCountRef.current += 1
      try {
        const data = await fetchUnderstanding(startupId, sessionId)
        applyUpdate(data)
        if (data.isComplete || pollCountRef.current >= 8) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
          }
        }
      } catch {
        /* ignore transient errors */
      }
    }

    void tick()
    pollingRef.current = setInterval(() => {
      void tick()
    }, 1000)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastExchangeAt, startupId, sessionId])

  return understanding
}
