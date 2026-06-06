"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const JOURNEY_STEPS = [
  { step: "01", label: "Session", href: "#session" },
  { step: "02", label: "Blueprint", href: "#blueprint" },
  { step: "03", label: "Workspace", href: "#workspace" },
  { step: "04", label: "Launch", href: "#launch" },
];

const PRIMARY = "#4FFAB0";
const PRIMARY_HOVER = "#44E5A9";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLink({
  label,
  href,
  isActive,
  labelSize = 14,
}: {
  label: string;
  href: string;
  isActive: boolean;
  labelSize?: number;
}) {
  return (
    <button
      onClick={() => scrollToSection(href)}
      className="relative outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-sm"
      style={{ paddingBottom: "4px" }}
      aria-label={`Navigate to ${label} section`}
    >
      <span
        style={{
          fontSize: `${labelSize}px`,
          fontWeight: 500,
          letterSpacing: "-0.015em",
          color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
          transition: "color 200ms ease",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      {/* Active underline indicator */}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1.5px",
          backgroundColor: PRIMARY,
          borderRadius: "999px",
          transformOrigin: "center",
          transform: `scaleX(${isActive ? 1 : 0})`,
          opacity: isActive ? 1 : 0,
          transition: "transform 200ms ease, opacity 200ms ease",
        }}
      />
    </button>
  );
}

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll state
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scrollspy — debounced, marks active section as user scrolls
  useEffect(() => {
    const detectActive = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        let current: string | null = null;
        for (const { href } of JOURNEY_STEPS) {
          const el = document.getElementById(href.replace("#", ""));
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
            current = href.replace("#", "");
          }
        }
        setActiveSection(current);
      }, 50);
    };

    window.addEventListener("scroll", detectActive, { passive: true });
    detectActive();
    return () => {
      window.removeEventListener("scroll", detectActive);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">

        {/* ── Desktop: full-width transparent bar (hero) ── */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -16 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute inset-x-0 top-0 hidden md:flex items-center justify-between px-12 h-[72px]"
          style={{ pointerEvents: scrolled ? "none" : "auto" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={28} height={28} priority />
            <span
              style={{
                fontSize: "17px",
                letterSpacing: "-0.025em",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
              }}
            >
              Xenysis
            </span>
          </Link>

          {/* Journey steps — center */}
          <div className="flex items-center gap-9">
            {JOURNEY_STEPS.map((s) => (
              <NavLink
                key={s.href}
                label={s.label}
                href={s.href}
                isActive={activeSection === s.href.replace("#", "")}
                labelSize={14}
              />
            ))}
          </div>

          {/* Utility + CTA — right */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/login"
              className="font-sans font-medium text-[13px] transition-colors duration-200"
              style={{ letterSpacing: "-0.01em", color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
            >
              Sign In
            </Link>
          </div>
        </motion.nav>

        {/* ── Desktop: frosted glass pill (scrolled) ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{
            opacity: scrolled ? 1 : 0,
            y: scrolled ? 0 : -20,
            scale: scrolled ? 1 : 0.97,
          }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed top-4 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-between gap-6 px-5 py-2 rounded-full"
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
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={26} height={26} priority />
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "-0.025em",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 500,
              }}
            >
              Xenysis
            </span>
          </Link>

          {/* Journey steps — center */}
          <div className="flex items-center gap-6 flex-1 justify-center">
            {JOURNEY_STEPS.map((s) => (
              <NavLink
                key={s.href}
                label={s.label}
                href={s.href}
                isActive={activeSection === s.href.replace("#", "")}
                labelSize={13}
              />
            ))}
          </div>

          {/* Utility + CTA — right */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="font-sans font-medium text-[12px] rounded-full px-4 py-1.5 transition-colors duration-150"
              style={{
                letterSpacing: "-0.01em",
                backgroundColor: PRIMARY,
                color: "#0a0a0a",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}
            >
              Sign In
            </Link>
          </div>
        </motion.nav>

        {/* ── Mobile: sticky top bar ── */}
        <div
          className="md:hidden fixed inset-x-0 top-0 flex items-center justify-between px-4 h-14 transition-all duration-300"
          style={{
            pointerEvents: "auto",
            backgroundColor: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled
              ? "1px solid rgba(255,255,255,0.07)"
              : "1px solid transparent",
          }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image className="rounded-lg" src="/logo.svg" alt="Xenysis" width={24} height={24} priority />
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "-0.025em",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 500,
              }}
            >
              Xenysis
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-sans font-medium text-[12px] rounded-full px-3 py-1.5"
              style={{
                letterSpacing: "-0.01em",
                backgroundColor: PRIMARY,
                color: "#0a0a0a",
              }}
            >
              Begin →
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="flex flex-col justify-center gap-[5px] p-1"
            >
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 1.5,
                  backgroundColor: "rgba(255,255,255,0.75)",
                  borderRadius: 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 13,
                  height: 1.5,
                  backgroundColor: "rgba(255,255,255,0.75)",
                  borderRadius: 1,
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile: full-screen slide-in menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60]"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed right-0 top-0 bottom-0 z-[70] flex flex-col"
              style={{
                width: "min(340px, 90vw)",
                backgroundColor: "#0d0d0d",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between px-6 h-14 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    letterSpacing: "-0.025em",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Xenysis
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: "4px",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Journey steps — large */}
              <div className="flex-1 flex flex-col justify-center px-8 gap-0">
                {JOURNEY_STEPS.map((s, i) => (
                  <motion.button
                    key={s.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.08, duration: 0.25, ease: EASE }}
                    onClick={() => handleNavClick(s.href)}
                    className="flex flex-col items-start gap-1 py-5 text-left"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-geist-mono, monospace)",
                        letterSpacing: "0.06em",
                        color:
                          activeSection === s.href.replace("#", "")
                            ? PRIMARY
                            : "rgba(255,255,255,0.2)",
                        transition: "color 200ms ease",
                      }}
                    >
                      {s.step}
                    </span>
                    <span
                      style={{
                        fontSize: "26px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color:
                          activeSection === s.href.replace("#", "")
                            ? "#ffffff"
                            : "rgba(255,255,255,0.6)",
                        lineHeight: 1.1,
                        transition: "color 200ms ease",
                      }}
                    >
                      {s.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Panel footer */}
              <div
                className="px-6 pb-8 pt-5 flex flex-col gap-4 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleNavClick("#pricing")}
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 500,
                    }}
                  >
                    Pricing
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 500,
                    }}
                  >
                    Sign In
                  </Link>
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-lg py-3 font-sans font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: PRIMARY,
                    color: "#0a0a0a",
                    fontSize: "14px",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = PRIMARY_HOVER; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PRIMARY; }}
                >
                  Start Building →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
