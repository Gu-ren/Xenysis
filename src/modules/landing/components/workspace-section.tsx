"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { MonoLabel } from "@/components/ui/mono-label"
import { SIDEBAR_MODULES, WORKSPACE_TILES } from "../constants"

export function WorkspaceSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 20 })
  const canvasScale = useTransform(smooth, [0, 0.5], [0.94, 1])
  const canvasOpacity = useTransform(smooth, [0, 0.35], [0, 1])

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />

        <div className="w-full max-w-[1280px] mx-auto px-8">
          <div className="mb-12">
            <MonoLabel className="block mb-8">03 / WORKSPACE</MonoLabel>
            <h2
              className="font-sans font-medium tracking-[-0.025em] leading-[1.1]"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "#111111" }}
            >
              See how your startup works.
              <br />
              <span style={{ color: "#a0a0a0" }}>Refine systems before you ship.</span>
            </h2>
          </div>

          {/* Workspace preview */}
          <motion.div
            style={{
              scale: canvasScale,
              opacity: canvasOpacity,
              backgroundColor: "#111111",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
            className="w-full rounded-2xl overflow-hidden"
          >
            {/* Top bar */}
            <div
              className="h-12 flex items-center justify-between px-6"
              style={{ backgroundColor: "#161616", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-2 items-center">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
                <div className="w-px h-3.5 mx-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
                <MonoLabel style={{ color: "rgba(255,255,255,0.3)" }}>XENYSIS PROJECT_04</MonoLabel>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[11px] font-sans font-medium px-3 py-1 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                >
                  New Page
                </button>
                <button
                  className="text-[11px] font-sans font-medium px-3 py-1 rounded"
                  style={{ backgroundColor: "#44E5A9", color: "#111111" }}
                >
                  Deploy
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex" style={{ aspectRatio: "16/8", maxHeight: "440px" }}>
              {/* Sidebar */}
              <div
                className="w-44 shrink-0 flex flex-col pt-4 gap-1"
                style={{ backgroundColor: "#141414", borderRight: "1px solid rgba(255,255,255,0.05)" }}
              >
                {SIDEBAR_MODULES.map((mod) => (
                  <div
                    key={mod}
                    className="mx-2 px-3 py-2 rounded-lg text-[12px] font-sans font-medium"
                    style={{
                      backgroundColor: mod === "Pages" ? "rgba(46,242,158,0.08)" : "transparent",
                      color: mod === "Pages" ? "#2EF29E" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {mod}
                  </div>
                ))}
              </div>

              {/* Main canvas */}
              <div className="flex-1 p-5 grid grid-cols-2 gap-3 content-start">
                {WORKSPACE_TILES.map((t) => (
                  <div
                    key={t}
                    className="rounded-xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      height: "80px",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
