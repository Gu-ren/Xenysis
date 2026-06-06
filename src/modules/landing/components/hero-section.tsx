"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { HeroBgSVG } from "./hero-bg-svg"

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-8"
      style={{ backgroundColor: "#111111" }}
    >
      <HeroBgSVG />

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-[1]" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

      {/* Hero content */}
      <motion.div
        style={{ y, opacity, position: "relative", zIndex: 10 }}
        className="max-w-[800px] w-full mx-auto text-center"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-medium tracking-[-0.04em] leading-[1.05] mb-5"
          style={{
            fontSize: "clamp(48px, 6vw, 88px)",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Your AI technical cofounder.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-normal tracking-[-0.025em] leading-[1.2] mb-8"
          style={{
            fontSize: "clamp(22px, 2.8vw, 36px)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Build companies, not just software.
        </motion.p>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base font-normal leading-relaxed mx-auto mb-14"
          style={{ color: "rgba(255,255,255,0.38)", maxWidth: "460px" }}
        >
          Turn startup ideas into validation-ready startup systems through AI-guided founder sessions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/signup?intent=founder-session"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#4ffab0", color: "#111111" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#44E5A9"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4ffab0"
            }}
          >
            Start Founder Session
            <ArrowRight size={15} />
          </Link>

          
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="font-mono text-xs tracking-[0.05em] mt-10"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          NO EQUITY TAKEN — NO TECHNICAL TEAM REQUIRED — LAUNCH IN HOURS
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 opacity-60"
          style={{ backgroundColor: "#44E5A9" }}
        />
      </motion.div>
    </section>
  )
}
