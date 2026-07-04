"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { MonoLabel } from "@/components/ui/mono-label"
import { DEPLOY_STEPS } from "../constants"
import { useJourneyContent } from "../use-journey-content"

export function DeploySection() {
  const { deploy } = useJourneyContent()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 20 })
  const panelOpacity = useTransform(smooth, [0, 0.3], [0, 1])
  const panelY = useTransform(smooth, [0, 0.4], [30, 0])

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
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

        <div className="w-full max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: heading */}
          <div>
            <MonoLabel className="block mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
              {deploy.eyebrow}
            </MonoLabel>
            <h2
              className="mb-6 font-sans font-medium tracking-[-0.025em] leading-[1.1]"
              style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "#FFFFFF" }}
            >
              {deploy.headingLine1}
              <br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{deploy.headingLine2}</span>
            </h2>
            <p
              className="font-sans text-base font-normal leading-[1.7] max-w-[360px]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {deploy.body}
            </p>
          </div>

          {/* Right: Deploy pipeline */}
          <motion.div style={{ opacity: panelOpacity, y: panelY }} className="rounded-2xl overflow-hidden">
            {/* Terminal header */}
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ backgroundColor: "#161616", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
              <MonoLabel className="ml-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                {deploy.panelLabel}
              </MonoLabel>
            </div>

            {/* Steps */}
            <div
              className="p-6 flex flex-col"
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {DEPLOY_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4 py-3.5 relative">
                  {i < DEPLOY_STEPS.length - 1 && (
                    <div
                      className="absolute left-[10px] top-[calc(50%+10px)] w-px"
                      style={{ height: "calc(100% - 4px)", backgroundColor: "rgba(255,255,255,0.06)" }}
                    />
                  )}

                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center z-10"
                    style={{
                      backgroundColor: step.active ? "rgba(46,242,158,0.15)" : "rgba(255,255,255,0.05)",
                      border: step.active ? "1px solid rgba(46,242,158,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {step.active ? (
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#2EF29E" }}
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                    )}
                  </div>

                  <span
                    className="font-sans text-sm font-medium flex-1"
                    style={{ color: step.active ? "#FFFFFF" : "rgba(255,255,255,0.4)" }}
                  >
                    {step.label}
                  </span>

                  <MonoLabel style={{ color: step.active ? "rgba(46,242,158,0.7)" : "rgba(255,255,255,0.2)" }}>
                    {step.time}
                  </MonoLabel>

                  {step.active && (
                    <div
                      className="px-2 py-0.5 rounded-full font-mono text-[10px] font-medium"
                      style={{
                        backgroundColor: "rgba(46,242,158,0.12)",
                        border: "1px solid rgba(46,242,158,0.25)",
                        color: "#2EF29E",
                      }}
                    >
                      LIVE
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ scaleX: smooth, transformOrigin: "left", backgroundColor: "#44E5A9" }}
          className="absolute bottom-0 left-0 right-0 h-[2px]"
        />
      </div>
    </div>
  )
}
