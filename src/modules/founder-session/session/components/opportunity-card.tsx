// OpportunityCard — surfaces a revenue or product opportunity Xenysis detected.
// Appears in the conversation AFTER the corresponding node is already visible
// on the canvas, so the canvas leads and the conversation confirms.

interface OpportunityCardProps {
  title: string
  description: string
  type?: 'revenue' | 'product'
}

export function OpportunityCard({ title, description, type = 'revenue' }: OpportunityCardProps) {
  return (
    <div
      className="flex gap-3 rounded-[10px] px-4 py-3.5 border"
      style={{
        background: 'rgba(79,250,176,0.04)',
        borderColor: 'rgba(79,250,176,0.20)',
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(79,250,176,0.55)',
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-primary font-bold" style={{ fontSize: 10 }}>★</span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9.5, letterSpacing: '0.10em', color: 'rgba(79,250,176,0.75)' }}
          >
            {type === 'revenue' ? 'Revenue Opportunity' : 'Product Opportunity'}
          </span>
        </div>
        <p className="text-foreground text-[14px] font-semibold tracking-[-0.02em] leading-snug m-0 mb-2">
          {title}
        </p>
        <p className="text-muted text-[13px] leading-relaxed m-0">
          {description}
        </p>
      </div>
    </div>
  )
}
