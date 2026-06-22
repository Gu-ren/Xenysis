import { Download, ArrowRight } from 'lucide-react'

interface BlueprintHeaderProps {
  onOpenWaitlist: () => void
  onExport: () => void
}

export function BlueprintHeader({ onOpenWaitlist, onExport }: BlueprintHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] px-8 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className="text-[17px] font-semibold tracking-tight text-white">
              Startup Blueprint
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Blueprint Ready
            </span>
          </div>
          <p className="text-zinc-600 text-[13px]">
            Your startup concept has been transformed into a build-ready foundation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="h-8 px-3.5 text-[13px] font-medium text-zinc-400 border border-white/[0.08] hover:border-white/[0.14] hover:text-zinc-200 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Blueprint
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
