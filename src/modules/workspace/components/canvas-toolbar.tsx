import { Plus, Minus, Expand, RotateCcw } from 'lucide-react'

interface CanvasToolbarProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onReset: () => void
}

export function CanvasToolbar({ zoom, onZoomIn, onZoomOut, onFitView, onReset }: CanvasToolbarProps) {
  return (
    <div
      className="absolute bottom-[132px] right-4 flex flex-col items-center gap-px z-20 rounded-xl border border-border overflow-hidden"
      style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)' }}
    >
      <ToolbarBtn onClick={onZoomIn} title="Zoom in (⌘ +)">
        <Plus size={13} strokeWidth={2} />
      </ToolbarBtn>
      <div className="px-3 py-1.5 text-[9px] font-mono text-muted border-y border-border select-none text-center w-full tabular-nums">
        {Math.round(zoom * 100)}%
      </div>
      <ToolbarBtn onClick={onZoomOut} title="Zoom out (⌘ -)">
        <Minus size={13} strokeWidth={2} />
      </ToolbarBtn>
      <div className="w-full h-px bg-border" />
      <ToolbarBtn onClick={onFitView} title="Fit to screen">
        <Expand size={12} strokeWidth={1.75} />
      </ToolbarBtn>
      <ToolbarBtn onClick={onReset} title="Reset view (⌘ 0)">
        <RotateCcw size={11} strokeWidth={1.75} />
      </ToolbarBtn>
    </div>
  )
}

function ToolbarBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-card transition-colors"
    >
      {children}
    </button>
  )
}
