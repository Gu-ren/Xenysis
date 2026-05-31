'use client'

interface AssetTallyProps {
  count: number
  isDone: boolean
}

export function AssetTally({ count, isDone }: AssetTallyProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span
        className="w-1.5 h-1.5 rounded-full bg-primary block shrink-0"
        style={isDone ? undefined : { animation: 'fs-pulse-dot 1s ease-in-out infinite' }}
      />
      <span className="text-xs font-mono text-muted">
        {count} {count === 1 ? 'asset' : 'assets'} assembled
      </span>
    </div>
  )
}
