// PatternCard — shown when Xenysis locks in a business model understanding.
// DNA signals surface what has been confirmed about the startup's identity.

interface PatternCardProps {
  pattern: string
  dnaSignals: string[]
}

export function PatternCard({ pattern, dnaSignals }: PatternCardProps) {
  return (
    <div className="flex gap-3">
      <div className="w-0.5 shrink-0 rounded-full bg-primary" />
      <div className="flex-1 min-w-0 bg-card border border-border rounded-[10px] px-4 py-3.5">
        <span
          className="block font-mono uppercase mb-2"
          style={{ fontSize: 9.5, letterSpacing: '0.10em', color: 'var(--primary)' }}
        >
          Business Pattern
        </span>
        <p className="text-foreground text-[14px] font-semibold tracking-[-0.02em] leading-snug m-0 mb-3">
          {pattern}
        </p>
        {dnaSignals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dnaSignals.map((signal) => (
              <span
                key={signal}
                className="font-mono border border-border rounded-[4px] px-[7px] py-[3px]"
                style={{ fontSize: 9.5, color: 'rgba(250,250,250,0.45)', background: 'rgba(255,255,255,0.02)' }}
              >
                {signal}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
