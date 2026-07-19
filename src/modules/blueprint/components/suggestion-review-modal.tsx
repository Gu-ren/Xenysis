'use client'

import { Loader2 } from 'lucide-react'
import type { AnalyzeChangesResult, BlueprintContent } from '../types/blueprint-api'

interface SuggestionReviewModalProps {
  open: boolean
  loading?: boolean
  title?: string
  analysis: AnalyzeChangesResult | null
  draft: BlueprintContent
  onApplySuggestion: () => void
  onKeepEdits: () => void
  onCancel: () => void
}

export function SuggestionReviewModal({
  open,
  loading = false,
  title = 'Review changes',
  analysis,
  onApplySuggestion,
  onKeepEdits,
  onCancel,
}: SuggestionReviewModalProps) {
  if (!open) return null

  const hasSuggestion = Boolean(analysis?.previewContent)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#111] p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing your edits…
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-300 mb-2">{analysis?.summary ?? 'No analysis available.'}</p>
            {analysis?.rationale ? (
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{analysis.rationale}</p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-2">
              {hasSuggestion && (
                <button
                  type="button"
                  onClick={onApplySuggestion}
                  className="flex-1 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold"
                >
                  Apply AI suggestion
                </button>
              )}
              <button
                type="button"
                onClick={onKeepEdits}
                className="flex-1 h-10 rounded-lg border border-white/[0.12] text-zinc-200 text-sm font-medium hover:border-white/[0.2]"
              >
                {hasSuggestion ? 'Keep my edits & save' : 'Save my edits'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="h-10 px-4 rounded-lg text-zinc-500 text-sm hover:text-zinc-300"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
