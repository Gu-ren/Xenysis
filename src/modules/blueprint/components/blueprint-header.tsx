import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  History,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Undo2,
  Users,
} from 'lucide-react'
import type { PresencePeer } from '../types/blueprint-api'

interface BlueprintHeaderProps {
  onOpenWaitlist: () => void
  onExport: () => void
  isExporting?: boolean
  dirty?: boolean
  saving?: boolean
  analyzing?: boolean
  regeneratingOa?: boolean
  versionNumber?: number
  peers?: PresencePeer[]
  onSave?: () => void
  onDiscard?: () => void
  onReviewWithAi?: () => void
  onOpenHistory?: () => void
  onRerunOa?: () => void
}

export function BlueprintHeader({
  onOpenWaitlist,
  onExport,
  isExporting = false,
  dirty = false,
  saving = false,
  analyzing = false,
  regeneratingOa = false,
  versionNumber,
  peers = [],
  onSave,
  onDiscard,
  onReviewWithAi,
  onOpenHistory,
  onRerunOa,
}: BlueprintHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] px-8 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="h-8 px-3 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.14] hover:text-zinc-200 rounded-lg transition-all flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-0.5 flex-wrap">
              <h1 className="text-[17px] font-semibold tracking-tight text-white">
                Startup Blueprint
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {dirty ? 'Unsaved edits' : 'Blueprint Ready'}
              </span>
              {versionNumber != null && (
                <span className="text-[11px] text-zinc-600">v{versionNumber}</span>
              )}
              {peers.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                  <Users className="w-3 h-3" />
                  {peers.length} editing
                  <span className="hidden sm:inline text-zinc-600">
                    ({peers.map((p) => p.displayName).join(', ')})
                  </span>
                </span>
              )}
            </div>
            <p className="text-zinc-600 text-[13px] truncate">
              Edit inline, review with AI, then save a new version.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
          {dirty && (
            <>
              <button
                type="button"
                onClick={onDiscard}
                disabled={saving}
                className="h-8 px-3 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:text-zinc-200 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Discard
              </button>
              <button
                type="button"
                onClick={onReviewWithAi}
                disabled={saving || analyzing}
                className="h-8 px-3 text-[13px] font-medium text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {analyzing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Review with AI
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="h-8 px-3 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onOpenHistory}
            className="h-8 px-3 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.14] hover:text-zinc-200 rounded-lg flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            type="button"
            onClick={onRerunOa}
            disabled={regeneratingOa || dirty}
            title={dirty ? 'Save edits before re-running OA' : 'Re-run Opportunity Assessment'}
            className="h-8 px-3 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.14] hover:text-zinc-200 rounded-lg flex items-center gap-1.5 disabled:opacity-40"
          >
            {regeneratingOa ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Re-run OA
          </button>
          <button
            onClick={onExport}
            disabled={isExporting}
            className="h-8 px-3.5 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.14] hover:text-zinc-200 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button
            onClick={onOpenWaitlist}
            className="h-8 px-3.5 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            Continue to Workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
