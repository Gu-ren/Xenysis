"use client"

import { motion, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import type { DialogueLine as DialogueLineType } from "../types"

interface DialogueLineProps {
  line: DialogueLineType
  index: number
  smooth: MotionValue<number>
  total: number
}

const WINDOW_SIZE = 0.17

export function DialogueLine({ line, index, smooth }: DialogueLineProps) {
  const start = index * 0.16
  const peak = start + WINDOW_SIZE * 0.4
  const end = start + WINDOW_SIZE * 1.8

  const lineOpacity = useTransform(smooth, [start, peak, end], [0, 1, index < 4 ? 0.15 : 1])
  const lineY = useTransform(smooth, [start, peak], [20, 0])

  return (
    <motion.div
      style={{ opacity: lineOpacity, y: lineY }}
      className={cn("mb-5 flex gap-3", line.speaker === "founder" ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[10px] font-medium"
        style={
          line.speaker === "ai"
            ? { backgroundColor: "#FFFFFF", color: "#6B6B6B", border: "1px solid rgba(0,0,0,0.08)" }
            : { backgroundColor: "#44E5A9", color: "#111111" }
        }
      >
        {line.speaker === "ai" ? "AI" : "FD"}
      </div>

      <div
        className="max-w-[320px] px-5 py-3.5 font-sans text-[15px] font-normal leading-relaxed"
        style={
          line.speaker === "ai"
            ? {
                backgroundColor: "#FFFFFF",
                color: "#444444",
                borderRadius: "0 1rem 1rem 1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
              }
            : {
                backgroundColor: "#111111",
                color: "#FFFFFF",
                borderRadius: "1rem 0 1rem 1rem",
              }
        }
      >
        {line.text}
      </div>
    </motion.div>
  )
}
