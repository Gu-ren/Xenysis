"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Journey } from "@/modules/landing/types"

interface FloatingCardProps {
  label: string
  title: string
  className?: string
  delay?: number
}

function MonoLabel({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("font-mono text-[11px] tracking-[0.08em] uppercase text-[#44E5A9] block mb-4", className)}
    >
      {children}
    </motion.span>
  )
}

function FloatingCard({ label, title, className, delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
      }}
      className={cn(
        "absolute rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3 w-40 z-0 backdrop-blur-sm pointer-events-none",
        className
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
        <div className="w-1 h-1 rounded-full bg-[#44E5A9]" />
      </div>
      <h4 className="text-[13px] text-white font-medium">{title}</h4>
    </motion.div>
  )
}

function HeroBgSVG() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="rgba(255,255,255,0.035)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />

        <path
          d="M120,160 C300,190 430,320 610,410 C700,455 780,470 860,450"
          fill="none"
          stroke="#44E5A9"
          strokeWidth="0.8"
          strokeDasharray="6 12"
          opacity="0.25"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-180" dur="14s" repeatCount="indefinite" />
        </path>
        <path
          d="M1420,190 C1210,210 1080,330 930,415 C850,460 775,470 690,450"
          fill="none"
          stroke="#44E5A9"
          strokeWidth="0.8"
          strokeDasharray="6 12"
          opacity="0.25"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-180" dur="12s" repeatCount="indefinite" />
        </path>
        <path
          d="M760,455 C700,590 500,665 310,790 C245,835 210,900 185,990 M785,455 C875,595 1055,660 1230,790 C1300,842 1345,900 1370,990"
          fill="none"
          stroke="#44E5A9"
          strokeWidth="0.8"
          strokeDasharray="6 12"
          opacity="0.25"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-180" dur="16s" repeatCount="indefinite" />
        </path>

        <path d="M1540,200 C1100,400 500,200 -100,500" fill="none" stroke="rgba(124,58,237,0.4)" strokeWidth="0.6" opacity="0.2" />
        <path d="M300,-100 C800,400 200,900 600,1100" fill="none" stroke="rgba(124,58,237,0.4)" strokeWidth="0.6" opacity="0.2" />

        {[0, 2, 4, 6, 8, 10].map((delay) => (
          <circle key={`p1-${delay}`} r="2" fill="#44E5A9" opacity="0.7">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              begin={`${delay}s`}
              path="M120,160 C300,190 430,320 610,410 C700,455 780,470 860,450"
            />
          </circle>
        ))}
        {[1, 3, 5, 7, 9, 11].map((delay) => (
          <circle key={`p2-${delay}`} r="2" fill="#44E5A9" opacity="0.7">
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              begin={`${delay}s`}
              path="M1420,190 C1210,210 1080,330 930,415 C850,460 775,470 690,450"
            />
          </circle>
        ))}
      </svg>

      <FloatingCard label="STARTUP" title="Startup Discovery" className="top-[15%] left-[10%]" delay={0.2} />
      <FloatingCard label="ENTERPRISE" title="Business Discovery" className="top-[18%] right-[12%]" delay={0.4} />
      <FloatingCard label="BLUEPRINT" title="Startup Blueprint" className="top-[45%] left-[8%]" delay={0.6} />
      <FloatingCard label="BLUEPRINT" title="Business Blueprint" className="top-[42%] right-[10%]" delay={0.8} />
      <FloatingCard label="PLATFORM" title="AI Workspace" className="bottom-[20%] left-[15%]" delay={1.0} />
      <FloatingCard label="PLATFORM" title="Deployment" className="bottom-[18%] right-[15%]" delay={1.2} />
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function HomePage() {
  const router = useRouter()

  const handleSelect = (journey: Exclude<Journey, null>) => {
    router.push(`/${journey}`)
  }

  return (
    <main className="relative w-full min-h-screen bg-[#111111] overflow-hidden selection:bg-[#44E5A9]/30 selection:text-white">
      <HeroBgSVG />

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1440px] w-full flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <MonoLabel delay={0.1}>AI CTO PLATFORM</MonoLabel>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-sans text-[48px] md:text-[80px] font-medium leading-[1.05] tracking-tight text-white mb-8 max-w-[820px]"
          >
            Meet Your AI CTO.
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, rgba(255, 255, 255, 0.7) 17.33%, #4f4f4f 57.9%, #ffffff 83.71%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Build Startups.
            </span>
            <br />
            <span className="text-white/70">Transform Businesses.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-sans text-[14px] text-white/50 max-w-[760px] leading-[1.7] mb-12">
            Whether you&rsquo;re building your first startup or leading an established business, Xenysis understands
            your goals, architects intelligent systems, generates implementation-ready blueprints, and guides
            execution from idea to deployment.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center relative mb-16">
            <button
              onClick={() => handleSelect("startup")}
              className="flex items-center justify-center gap-2 bg-[#44E5A9] text-[#0a0a0a] font-mono font-semibold text-[13px] h-13 px-8 rounded-full hover:bg-[#2EF29E] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
            >
              <span>Start as Startup Founder</span>
            </button>

            <button
              onClick={() => handleSelect("business")}
              className="flex items-center justify-center gap-2 bg-transparent border border-[#44E5A9]/45 text-[#44E5A9] font-sans font-semibold text-[13px] h-13 px-8 rounded-full hover:bg-[#44E5A9]/10 hover:border-[#44E5A9] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
            >
              <span>Start as Business Owner</span>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-[120px] h-px bg-white/[0.08] mb-4" />
            <span className="font-mono text-[11px] text-white/[0.22] tracking-[0.18em] uppercase">
              ONE PLATFORM — TWO JOURNEYS — SAME AI CTO
            </span>
          </motion.div>
        </motion.div>

        
      </section>
    </main>
  )
}
