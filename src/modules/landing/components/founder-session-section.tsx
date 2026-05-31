"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { MonoLabel } from "@/components/ui/mono-label"
import { DialogueLine } from "./dialogue-line"
import { DIALOGUE } from "../constants"

export function FounderSessionSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 })

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div
        className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />

        <div className="w-full max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: heading */}
          <div>
            <MonoLabel className="block mb-8">01 / FOUNDER SESSION</MonoLabel>
            <h2
              className="mb-8 font-sans font-medium tracking-[-0.025em] leading-[1.1]"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "#111111" }}
            >
              Describe the
              <br />
              <span style={{ color: "#a0a0a0" }}>problem.</span>
            </h2>
            <p
              className="font-sans text-base font-normal leading-[1.7] max-w-[360px]"
              style={{ color: "#6B6B6B" }}
            >
              AI-guided sessions transform raw ideas into validated startup systems — challenging your assumptions before you build.
            </p>
          </div>

          {/* Right: dialogue */}
          <div className="relative h-[420px] flex flex-col justify-center gap-0">
            {DIALOGUE.map((line, i) => (
              <DialogueLine
                key={line.id}
                line={line}
                index={i}
                smooth={smooth}
                total={DIALOGUE.length}
              />
            ))}

            {/* Pulse indicator */}
            <div className="flex items-center gap-2 mt-4 pl-10">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#44E5A9" }}
              />
              <MonoLabel className="text-[10px]">SYSTEM MAP GENERATING</MonoLabel>
            </div>
          </div>
        </div>

        {/* Section progress line */}
        <motion.div
          style={{ scaleX: smooth, transformOrigin: "left", backgroundColor: "#44E5A9" }}
          className="absolute bottom-0 left-0 right-0 h-[2px]"
        />
      </div>
    </div>
  )
}
