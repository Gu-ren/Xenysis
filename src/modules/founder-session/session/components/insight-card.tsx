// InsightCard — a confirmed strategic truth worth surfacing, subordinate to
// OpportunityCard. No background fill — just a left accent rule.

interface InsightCardProps {
  children: React.ReactNode
}

export function InsightCard({ children }: InsightCardProps) {
  return (
    <div className="flex gap-3">
      <div
        className="w-px shrink-0 rounded-full"
        style={{ background: 'rgba(79,250,176,0.32)' }}
      />
      <div className="flex-1 min-w-0 py-px">
        <span
          className="block font-mono uppercase mb-1.5"
          style={{ fontSize: 9.5, letterSpacing: '0.10em', color: 'rgba(79,250,176,0.52)' }}
        >
          Insight
        </span>
        <p className="text-muted text-[13px] leading-relaxed m-0">
          {children}
        </p>
      </div>
    </div>
  )
}
