"use client"

import Link from "next/link"
import { MonoLabel } from "@/components/ui/mono-label"
import { FOOTER_SECTIONS } from "../constants"
import { useJourneyContent } from "../use-journey-content"
import Image from "next/image";

function XenysisLogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 block"
    >
      <polygon points="14,3 22,7.5 14,12 6,7.5"   fill="#1a1a1a" />
      <polygon points="6,7.5 14,12 14,21 6,16.5"   fill="#0d0d0d" />
      <polygon points="14,12 22,7.5 22,16.5 14,21"  fill="#141414" />
      <line x1="6"  y1="7.5" x2="14" y2="3"    stroke="#2EF29E" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="3"   x2="22" y2="7.5"  stroke="#2EF29E" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6"  y1="7.5" x2="6"  y2="16.5" stroke="#2EF29E" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function Footer() {
  const content = useJourneyContent()

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "#0A0A0A", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-8 py-16">
        {/* Top row: brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
          <Image
            className="rounded-lg"
            src="/logo.svg"
            alt="Xenysis"
            width={28}
            height={28}
            priority
          />

          <span
            className="font-sans font-medium"
            style={{
              fontSize: "17px",
              letterSpacing: "-0.025em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Xenysis
          </span>
        </Link>
            <p
              className="font-sans text-sm leading-relaxed max-w-[240px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {content.footerTagline}
            </p>
            <p
              className="font-sans text-xs leading-relaxed max-w-[240px]"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              No credit card required to start.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section, sectionIndex) => (
            <div key={section.heading} className="flex flex-col gap-4">
              <MonoLabel style={{ color: "rgba(255,255,255,0.25)" }}>{section.heading}</MonoLabel>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {sectionIndex === 0 && (
                  <li>
                    <Link
                      href={content.footerCtaHref}
                      className="font-sans text-sm transition-colors duration-200"
                      style={{ color: "#4FFAB0" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#44E5A9" }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#4FFAB0" }}
                    >
                      {content.footerCtaLabel}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: copyright */}
        <div
          className="pt-8 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <MonoLabel style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Xenysis. All rights reserved.
          </MonoLabel>
          <div className="flex items-center gap-6">
            <MonoLabel style={{ color: "rgba(255,255,255,0.15)" }}>
              NO EQUITY TAKEN
            </MonoLabel>
            <MonoLabel style={{ color: "rgba(255,255,255,0.15)" }}>
              NO CREDIT CARD REQUIRED
            </MonoLabel>
          </div>
        </div>
      </div>
    </footer>
  )
}
