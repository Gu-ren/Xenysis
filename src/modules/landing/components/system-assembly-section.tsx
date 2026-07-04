"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { MonoLabel } from "@/components/ui/mono-label"
import { FeatureCard } from "./feature-card"
import { FEATURES, SYSTEM_NODES, SYSTEM_EDGES } from "../constants"
import { useJourneyContent } from "../use-journey-content"

function SystemEdgeItem({
  x1, y1, x2, y2, index, smooth,
}: {
  x1: number; y1: number; x2: number; y2: number; index: number
  smooth: ReturnType<typeof useSpring>
}) {
  const edgeOpacity = useTransform(smooth, [index * 0.05, index * 0.05 + 0.1], [0, 1])
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="rgba(255,255,255,0.12)"
      strokeWidth="1.5"
      style={{ opacity: edgeOpacity }}
    />
  )
}

function SystemNodeItem({
  node, index, smooth, label,
}: {
  node: (typeof SYSTEM_NODES)[number]; index: number
  smooth: ReturnType<typeof useSpring>
  label: string
}) {
  const nodeOpacity = useTransform(smooth, [index * 0.06 + 0.02, index * 0.06 + 0.14], [0, 1])
  const nodeY = useTransform(smooth, [index * 0.06 + 0.02, index * 0.06 + 0.14], [10, 0])

  const isAccent = node.accent
  const isDark = node.dark
  const isFounder = node.id === "founder"
  const isBranch = !isAccent && !isDark && !isFounder

  const nodeW = isAccent || isDark || isFounder ? 74 : 62
  const nodeH = isAccent || isDark || isFounder ? 30 : 24

  const rectFill = isDark ? "#1A1A1A" : isAccent ? "#2EF29E" : isFounder ? "transparent" : "rgba(255,255,255,0.05)"
  const rectStroke = isDark ? "rgba(255,255,255,0.15)" : isAccent ? "#2EF29E" : isFounder ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)"
  const textFill = isDark ? "#FFFFFF" : isAccent ? "#080808" : "#FFFFFF"
  const fontSize = isBranch ? "7" : "8.5"

  return (
    <motion.g style={{ opacity: nodeOpacity, y: nodeY }}>
      {isAccent && (
        <rect
          x={node.x - nodeW / 2 - 5} y={node.y - nodeH / 2 - 5}
          width={nodeW + 10} height={nodeH + 10}
          rx={10} fill="rgba(46,242,158,0.12)"
        />
      )}
      <rect
        x={node.x - nodeW / 2} y={node.y - nodeH / 2}
        width={nodeW} height={nodeH}
        rx={6} fill={rectFill} stroke={rectStroke} strokeWidth={isAccent ? 1.5 : 1}
      />
      <text
        x={node.x} y={node.y + 3}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily="var(--font-geist-mono)"
        fill={textFill}
        fontWeight={isAccent ? "600" : "500"}
        letterSpacing="0.06em"
      >
        {label}
      </text>
    </motion.g>
  )
}

export function SystemAssemblySection() {
  const { blueprint } = useJourneyContent()
  const nodeLabels: Record<string, string> = {
    founder: blueprint.nodeFounderLabel,
    system: blueprint.nodeSystemLabel,
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 18, mass: 0.5 })

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundColor: "#0F0F0F",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

        <div className="w-full max-w-[1280px] mx-auto px-8">
          <div className="mb-14">
            <MonoLabel className="block mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              {blueprint.eyebrow}
            </MonoLabel>
            <h2
              className="mb-4 font-sans font-medium tracking-[-0.025em] leading-[1.1]"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "#FFFFFF" }}
            >
              {blueprint.headingLine1}
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{blueprint.headingLine2}</span>
            </h2>
            <p
              className="font-sans text-base font-normal leading-[1.7] max-w-[480px]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {blueprint.body}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* SVG System Map */}
            <div
              className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                aspectRatio: "5/3",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 520 320">
                {SYSTEM_EDGES.map((edge, i) => (
                  <SystemEdgeItem key={edge.id} {...edge} index={i} smooth={smooth} />
                ))}
                {SYSTEM_NODES.map((node, i) => (
                  <SystemNodeItem
                    key={node.id}
                    node={node}
                    index={i}
                    smooth={smooth}
                    label={nodeLabels[node.id] ?? node.label}
                  />
                ))}
              </svg>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((feature, i) => (
                <FeatureCard key={feature.title} feature={feature} index={i} smooth={smooth} />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          style={{ scaleX: smooth, transformOrigin: "left", backgroundColor: "#2EF29E" }}
          className="absolute bottom-0 left-0 right-0 h-[2px]"
        />
      </div>
    </div>
  )
}
