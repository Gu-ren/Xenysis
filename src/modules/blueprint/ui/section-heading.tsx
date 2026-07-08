interface SectionHeadingProps {
  number: string
  title: string
  percentage?: number
}

export function SectionHeading({ number, title, percentage }: SectionHeadingProps) {
  return (
    <div className="mb-10 pt-16 first:pt-0">
      {percentage !== undefined && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500/50 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-emerald-500/80 tabular-nums shrink-0">
            {percentage}%
          </span>
        </div>
      )}
      <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-500 uppercase mb-2.5 block">
        Section {number}
      </span>
      <h2 className="text-[28px] font-bold text-white tracking-tight leading-tight">{title}</h2>
    </div>
  )
}
