"use client"

import { motion, useTransform, type MotionValue } from "framer-motion"
import type { FeatureItem } from "../types"

interface FeatureCardProps {
  feature: FeatureItem
  index: number
  smooth: MotionValue<number>
}

export function FeatureCard({ feature, index, smooth }: FeatureCardProps) {
  const start = index * 0.09 + 0.1
  const featureOpacity = useTransform(smooth, [start, start + 0.14], [0, 1])
  const featureY = useTransform(smooth, [start, start + 0.14], [20, 0])

  return (
    <motion.div
      style={{ opacity: featureOpacity, y: featureY }}
      className="group rounded-xl cursor-default"
      onMouseEnter={(e) => {
        const inner = e.currentTarget.querySelector(".card-inner") as HTMLDivElement | null
        if (inner) {
          inner.style.borderColor = "rgba(46,242,158,0.25)"
          inner.style.backgroundColor = "rgba(255,255,255,0.05)"
        }
      }}
      onMouseLeave={(e) => {
        const inner = e.currentTarget.querySelector(".card-inner") as HTMLDivElement | null
        if (inner) {
          inner.style.borderColor = "rgba(255,255,255,0.07)"
          inner.style.backgroundColor = "rgba(255,255,255,0.03)"
        }
      }}
    >
      <div
        className="card-inner h-full rounded-xl p-5 transition-colors duration-200"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center justify-center mb-5 rounded-xl shrink-0"
          style={{ width: "40px", height: "40px", backgroundColor: "rgba(46,242,158,0.1)" }}
        >
          <feature.icon size={18} style={{ color: "#2EF29E" }} />
        </div>
        <h3
          className="mb-2 font-sans font-semibold leading-[1.2]"
          style={{ fontSize: "15px", letterSpacing: "-0.02em", color: "#FFFFFF" }}
        >
          {feature.title}
        </h3>
        <p
          className="font-sans font-normal leading-[1.65]"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
