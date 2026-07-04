"use client"

import { MonoLabel } from "@/components/ui/mono-label"
import { useJourneyContent } from "../use-journey-content"

export function TestimonialsSection() {
  const { testimonials } = useJourneyContent()

  return (
    <section className="py-32 px-8" style={{ backgroundColor: "#F5F5F3" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />

      <div className="w-full max-w-[1280px] mx-auto">
        <MonoLabel className="block mb-16 text-center">WHAT PEOPLE SAY</MonoLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="flex flex-col justify-between p-8 rounded-2xl"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <p
                className="font-sans text-base font-normal leading-[1.7] mb-8"
                style={{ color: "#333333" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-semibold shrink-0"
                  style={{ backgroundColor: "rgba(46,242,158,0.12)", color: "#2EF29E" }}
                >
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-sans text-sm font-medium" style={{ color: "#111111" }}>
                    {t.author}
                  </p>
                  <MonoLabel className="text-[10px]">{t.role}</MonoLabel>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
