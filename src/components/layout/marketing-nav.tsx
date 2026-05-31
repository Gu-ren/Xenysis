"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Products", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Blog", href: "#" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function XenysisLogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 block"
    >
      <polygon points="14,3 22,7.5 14,12 6,7.5" fill="#1a1a1a" />
      <polygon points="6,7.5 14,12 14,21 6,16.5" fill="#0d0d0d" />
      <polygon points="14,12 22,7.5 22,16.5 14,21" fill="#141414" />
      <line
        x1="6"
        y1="7.5"
        x2="14"
        y2="3"
        stroke="#2EF29E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="3"
        x2="22"
        y2="7.5"
        stroke="#2EF29E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="7.5"
        x2="6"
        y2="16.5"
        stroke="#2EF29E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* ── Default: full-width transparent bar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -16 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="absolute inset-x-0 top-0 flex items-center justify-between px-12 h-[72px]"
        style={{ pointerEvents: scrolled ? "none" : "auto" }}
      >
        {/* Logo */}
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

        {/* Center links */}
        <div className="flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans font-medium text-[13px] transition-colors duration-200"
              style={{
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.75)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="font-sans font-medium text-[13px] rounded-full px-4 py-1.5 transition-colors duration-200"
            style={{
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.65)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
            }}
          >
            Sign In
          </Link>
          <Link
            href="/signup?intent=founder-session"
            className="font-sans font-medium text-[13px] rounded-full px-4 py-1.5 transition-colors duration-200"
            style={{
              letterSpacing: "-0.01em",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Start Building
          </Link>
        </div>
      </motion.nav>

      {/* ── Scrolled: floating frosted-glass pill ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{
          opacity: scrolled ? 1 : 0,
          y: scrolled ? 0 : -20,
          scale: scrolled ? 1 : 0.97,
        }}
        transition={{ duration: 0.3, ease: EASE }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between gap-6 px-5 py-1.5 rounded-full"
        style={{
          width: "calc(100% - 32px)",
          maxWidth: "900px",
          pointerEvents: scrolled ? "auto" : "none",
          backgroundColor: "rgba(11,12,14,0.55)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
           className="rounded-lg"
            src="/logo.svg"
            alt="Xenysis"
            width={28}
            height={28}
            priority
          />
          <span
            className="font-sans font-medium shrink-0"
            style={{
              fontSize: "15px",
              letterSpacing: "-0.025em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Xenysis
          </span>
        </Link>

        {/* Center links */}
        <div className="flex items-center justify-center gap-6 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans font-medium text-[13px] whitespace-nowrap transition-colors duration-200"
              style={{
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.65)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.65)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="font-sans font-medium text-[13px] rounded-full px-4 py-1.5 transition-colors duration-200"
            style={{
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.65)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
            }}
          >
            Sign In
          </Link>
          <Link
            href="/signup?intent=founder-session"
            className="font-sans font-medium text-[13px] rounded-full px-4 py-1.5 transition-colors duration-200"
            style={{
              letterSpacing: "-0.01em",
              backgroundColor: "#4ffab0",
              color: "#111111",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#44E5A9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4ffab0";
            }}
          >
            Start Building
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}
