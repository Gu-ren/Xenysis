import { PAGE_CARDS, FLOW_CONNECTIONS, CARD_POS, CARD_W, CARD_H, cardCenter } from "../constants"

export function HeroBgSVG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes flowDrawPath {
          from { stroke-dashoffset: var(--flow-len); }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="hero-flow-clip">
            <rect x="0" y="0" width="1440" height="900" />
          </clipPath>
        </defs>

        <g clipPath="url(#hero-flow-clip)">
          {/* Connection paths */}
          {FLOW_CONNECTIONS.map((conn) => {
            const [x1, y1] = cardCenter(conn.fromId)
            const [x2, y2] = cardCenter(conn.toId)
            const mx = (x1 + x2) / 2 + (conn.mint ? 8 : -8)
            const my = (y1 + y2) / 2 - 10

            return (
              <g key={conn.id}>
                <path
                  d={conn.d}
                  fill="none"
                  stroke={conn.mint ? "rgba(68,229,169,0.2)" : "rgba(124,58,237,0.18)"}
                  strokeWidth={conn.mint ? 0.9 : 0.8}
                  strokeDasharray={conn.length}
                  strokeDashoffset={conn.length}
                  style={{
                    ["--flow-len" as string]: conn.length,
                    animation: `flowDrawPath 2.5s ease-in-out ${conn.delay}s forwards`,
                  }}
                />

                {conn.labelPct && (
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    fontFamily="var(--font-geist-mono)"
                    fontSize={7}
                    fill="rgba(255,255,255,0.2)"
                  >
                    {conn.labelPct}
                  </text>
                )}

                {conn.mint && (
                  <circle r="2" fill="#44E5A9" opacity="0.5">
                    <animateMotion dur="5s" repeatCount="indefinite" calcMode="linear" path={conn.d} />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Page cards */}
          {PAGE_CARDS.map((card) => {
            const pos = CARD_POS[card.id]
            if (!pos) return null
            const { x, y } = pos

            return (
              <g
                key={card.id}
                style={{
                  opacity: 0,
                  animation: `cardFadeIn 0.8s ease-out ${card.delay + 0.4}s forwards`,
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={CARD_W}
                  height={CARD_H}
                  rx={6}
                  fill="rgba(255,255,255,0.025)"
                  stroke={card.active ? "rgba(68,229,169,0.25)" : "rgba(255,255,255,0.06)"}
                  strokeWidth={1}
                />
                {card.active && (
                  <rect
                    x={x - 4}
                    y={y - 4}
                    width={CARD_W + 8}
                    height={CARD_H + 8}
                    rx={10}
                    fill="none"
                    stroke="rgba(68,229,169,0.06)"
                    strokeWidth={6}
                  />
                )}

                {/* 3-dot top bar */}
                <circle cx={x + 10} cy={y + 10} r={2} fill="rgba(255,255,255,0.15)" />
                <circle cx={x + 18} cy={y + 10} r={2} fill="rgba(255,255,255,0.1)" />
                <circle cx={x + 26} cy={y + 10} r={2} fill="rgba(255,255,255,0.08)" />

                {/* Content lines */}
                {card.lines.map((line, li) => (
                  <rect
                    key={`line-${card.id}-${li}`}
                    x={x + 8}
                    y={y + 22 + li * 9}
                    width={(parseFloat(line.width) * (CARD_W - 16)) / 100}
                    height={4}
                    rx={2}
                    fill={line.accent ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)"}
                  />
                ))}

                {/* Page name */}
                <text
                  x={x + 8}
                  y={y + CARD_H - 14}
                  fontFamily="var(--font-geist-sans)"
                  fontSize={8}
                  fontWeight="500"
                  fill="rgba(255,255,255,0.55)"
                >
                  {card.name}
                </text>

                {/* Status badge */}
                <rect
                  x={x + 8 + card.name.length * 4.8 + 4}
                  y={y + CARD_H - 20}
                  width={28}
                  height={10}
                  rx={3}
                  fill="rgba(68,229,169,0.12)"
                  stroke="rgba(68,229,169,0.2)"
                  strokeWidth={0.5}
                />
                <text
                  x={x + 8 + card.name.length * 4.8 + 18}
                  y={y + CARD_H - 12}
                  textAnchor="middle"
                  fontFamily="var(--font-geist-mono)"
                  fontSize={6}
                  fill="rgba(68,229,169,0.7)"
                >
                  Ready
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
