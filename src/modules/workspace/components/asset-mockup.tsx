import type { NodeType } from '../types'

interface AssetMockupProps {
  nodeType: NodeType
  accentColor: string
}

export function AssetMockup({ nodeType, accentColor }: AssetMockupProps) {
  const a = accentColor

  const content = (() => {
    switch (nodeType) {
      case 'page':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Browser chrome */}
            <rect x="8" y="6" width="164" height="76" rx="5" fill={`${a}08`} />
            <rect x="8" y="6" width="164" height="14" rx="5" fill={`${a}10`} />
            <circle cx="18" cy="13" r="2.5" fill={`${a}30`} />
            <circle cx="26" cy="13" r="2.5" fill={`${a}20`} />
            <circle cx="34" cy="13" r="2.5" fill={`${a}15`} />
            <rect x="44" y="8.5" width="88" height="9" rx="4" fill={`${a}12`} />
            {/* Content blocks */}
            <rect x="20" y="27" width="90" height="7" rx="2" fill={`${a}18`} />
            <rect x="20" y="38" width="60" height="5" rx="2" fill={`${a}10`} />
            <rect x="20" y="47" width="72" height="5" rx="2" fill={`${a}08`} />
            <rect x="20" y="60" width="50" height="12" rx="4" fill={`${a}35`} />
            <rect x="110" y="27" width="52" height="46" rx="4" fill={`${a}06`} />
          </svg>
        )

      case 'database':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Table header */}
            <rect x="12" y="10" width="156" height="13" rx="3" fill={`${a}18`} />
            <line x1="12" y1="23" x2="168" y2="23" stroke={`${a}20`} strokeWidth="0.5" />
            {/* Rows */}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x="12" y={28 + i * 14} width="156" height="12" rx="2"
                  fill={i % 2 === 0 ? `${a}05` : 'transparent'} />
                <rect x="16" y={31 + i * 14} width="28" height="5" rx="1.5" fill={`${a}25`} />
                <rect x="52" y={31 + i * 14} width="52" height="5" rx="1.5" fill={`${a}12`} />
                <rect x="112" y={31 + i * 14} width="36" height="5" rx="1.5" fill={`${a}10`} />
              </g>
            ))}
          </svg>
        )

      case 'workflow':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Trigger */}
            <rect x="14" y="10" width="44" height="22" rx="4" fill={`${a}14`} stroke={`${a}25`} strokeWidth="0.75" />
            <rect x="20" y="15" width="28" height="4" rx="1.5" fill={`${a}30`} />
            <rect x="20" y="22" width="18" height="3" rx="1" fill={`${a}18`} />
            {/* Arrow */}
            <path d="M58,21 L72,21" stroke={`${a}40`} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M70,18 L73,21 L70,24" fill="none" stroke={`${a}40`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Step 2 */}
            <rect x="74" y="10" width="44" height="22" rx="4" fill={`${a}10`} stroke={`${a}20`} strokeWidth="0.75" />
            <rect x="80" y="15" width="28" height="4" rx="1.5" fill={`${a}22`} />
            {/* Arrow */}
            <path d="M118,21 L132,21" stroke={`${a}40`} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M130,18 L133,21 L130,24" fill="none" stroke={`${a}40`} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Step 3 */}
            <rect x="134" y="10" width="34" height="22" rx="4" fill={`${a}10`} stroke={`${a}20`} strokeWidth="0.75" />
            {/* Bottom branches */}
            <line x1="36" y1="32" x2="36" y2="50" stroke={`${a}20`} strokeWidth="0.75" strokeDasharray="3 2" />
            <rect x="14" y="50" width="44" height="18" rx="3" fill={`${a}07`} stroke={`${a}14`} strokeWidth="0.5" />
            <rect x="20" y="55" width="28" height="3" rx="1" fill={`${a}15`} />
            <rect x="20" y="61" width="18" height="3" rx="1" fill={`${a}10`} />
          </svg>
        )

      case 'api':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Method badges */}
            <rect x="12" y="10" width="26" height="10" rx="3" fill={`${a}30`} />
            <text x="25" y="18" fill={a} fontSize="6" fontWeight="700" textAnchor="middle" fontFamily="monospace">GET</text>
            <rect x="44" y="11.5" width="96" height="7" rx="2" fill={`${a}08`} />

            <rect x="12" y="26" width="30" height="10" rx="3" fill="rgba(245,158,11,0.25)" />
            <text x="27" y="34" fill="#f59e0b" fontSize="6" fontWeight="700" textAnchor="middle" fontFamily="monospace">POST</text>
            <rect x="48" y="27.5" width="80" height="7" rx="2" fill={`${a}08`} />

            <rect x="12" y="42" width="26" height="10" rx="3" fill="rgba(99,179,237,0.25)" />
            <text x="25" y="50" fill="#63b3ed" fontSize="6" fontWeight="700" textAnchor="middle" fontFamily="monospace">PUT</text>
            <rect x="44" y="43.5" width="72" height="7" rx="2" fill={`${a}08`} />

            {/* Response block */}
            <rect x="12" y="60" width="156" height="18" rx="3" fill={`${a}06`} stroke={`${a}12`} strokeWidth="0.5" />
            <rect x="18" y="64" width="32" height="3.5" rx="1" fill={`${a}20`} />
            <rect x="56" y="64" width="24" height="3.5" rx="1" fill={`${a}12`} />
            <rect x="18" y="70" width="48" height="3.5" rx="1" fill={`${a}12`} />
          </svg>
        )

      case 'integration':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Xenysis side */}
            <rect x="12" y="22" width="52" height="44" rx="6" fill={`${a}10`} stroke={`${a}22`} strokeWidth="0.75" />
            <rect x="20" y="32" width="36" height="5" rx="2" fill={`${a}28`} />
            <rect x="20" y="41" width="28" height="4" rx="1.5" fill={`${a}16`} />
            <rect x="20" y="49" width="32" height="4" rx="1.5" fill={`${a}12`} />
            {/* Connection line */}
            <path d="M64,44 Q90,28 116,44" fill="none" stroke={`${a}45`} strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M64,44 Q90,60 116,44" fill="none" stroke={`${a}25`} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="90" cy="37" r="3" fill={`${a}50`} />
            {/* External side */}
            <rect x="116" y="22" width="52" height="44" rx="6" fill={`${a}08`} stroke={`${a}18`} strokeWidth="0.75" />
            <rect x="124" y="32" width="36" height="5" rx="2" fill={`${a}22`} />
            <rect x="124" y="41" width="24" height="4" rx="1.5" fill={`${a}14`} />
            <rect x="124" y="49" width="30" height="4" rx="1.5" fill={`${a}10`} />
          </svg>
        )

      case 'system':
        return (
          <svg width="100%" height="100%" viewBox="0 0 180 88" fill="none">
            {/* Central service block */}
            <rect x="46" y="14" width="88" height="36" rx="6" fill={`${a}10`} stroke={`${a}22`} strokeWidth="1" />
            <rect x="58" y="23" width="48" height="6" rx="2" fill={`${a}25`} />
            <rect x="58" y="33" width="32" height="4" rx="1.5" fill={`${a}14`} />
            <rect x="58" y="40" width="40" height="4" rx="1.5" fill={`${a}10`} />
            {/* IO lines */}
            <line x1="90" y1="50" x2="90" y2="65" stroke={`${a}25`} strokeWidth="1" />
            <line x1="46" y1="32" x2="24" y2="32" stroke={`${a}20`} strokeWidth="1" strokeDasharray="3 2" />
            <line x1="134" y1="32" x2="156" y2="32" stroke={`${a}20`} strokeWidth="1" strokeDasharray="3 2" />
            {/* Port indicators */}
            <circle cx="24" cy="32" r="4" fill={`${a}12`} stroke={`${a}20`} strokeWidth="0.75" />
            <circle cx="156" cy="32" r="4" fill={`${a}12`} stroke={`${a}20`} strokeWidth="0.75" />
            {/* Output node */}
            <rect x="68" y="65" width="44" height="16" rx="4" fill={`${a}08`} stroke={`${a}16`} strokeWidth="0.5" />
          </svg>
        )
    }
  })()

  return (
    <div className="w-full h-full bg-background overflow-hidden relative">
      {/* Window chrome dots */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-danger/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/35" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/35" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pt-2">
        {content}
      </div>
    </div>
  )
}
