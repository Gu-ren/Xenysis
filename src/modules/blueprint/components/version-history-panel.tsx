'use client'

import { useEffect, useState } from 'react'
import { History, Loader2, X } from 'lucide-react'
import {
  fetchBlueprintVersion,
  listBlueprintVersions,
} from '../services/blueprint'
import type { BlueprintContent, BlueprintVersionHeader } from '../types/blueprint-api'

interface VersionHistoryPanelProps {
  open: boolean
  startupId: string
  currentVersionNumber?: number
  onClose: () => void
  onRestore: (content: BlueprintContent) => void
  onCompare: (content: BlueprintContent, meta: BlueprintVersionHeader) => void
}

export function VersionHistoryPanel({
  open,
  startupId,
  currentVersionNumber,
  onClose,
  onRestore,
  onCompare,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<BlueprintVersionHeader[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setError(null)
    listBlueprintVersions(startupId)
      .then((list) => {
        if (!cancelled) setVersions(list)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load versions')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, startupId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/50">
      <div className="w-full max-w-md h-full bg-[#111] border-l border-white/[0.08] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Version history</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-zinc-500 text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading &&
            versions.map((v) => {
              const isCurrent = v.versionNumber === currentVersionNumber || v.isCurrent
              return (
                <div
                  key={v.versionId}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 space-y-2"
                >
                  <div>
                    <p className="text-sm text-white font-medium">
                      v{v.versionNumber}
                      {isCurrent ? (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-emerald-400">
                          current
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {new Date(v.generatedAt).toLocaleString()}
                      {v.source ? ` · ${v.source}` : ''}
                    </p>
                    {v.note ? <p className="text-xs text-zinc-400 mt-1">{v.note}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === v.versionId}
                      onClick={async () => {
                        setBusyId(v.versionId)
                        try {
                          const res = await fetchBlueprintVersion(startupId, v.versionId)
                          onCompare(res.content, v)
                        } finally {
                          setBusyId(null)
                        }
                      }}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-white/[0.1] text-zinc-300 hover:border-white/[0.2]"
                    >
                      Compare
                    </button>
                    {!isCurrent && (
                      <button
                        type="button"
                        disabled={busyId === v.versionId}
                        onClick={async () => {
                          setBusyId(v.versionId)
                          try {
                            const res = await fetchBlueprintVersion(startupId, v.versionId)
                            onRestore(res.content)
                          } finally {
                            setBusyId(null)
                          }
                        }}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
