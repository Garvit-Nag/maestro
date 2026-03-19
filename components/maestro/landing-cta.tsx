"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ctaContent } from "@/lib/content/landing"

export function LandingCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      className="relative overflow-hidden bg-[#050508] px-8 lg:px-16 py-24 lg:py-32"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Bottom fade into footer */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div ref={ref} className="relative max-w-screen-xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(28px,5vw,60px)] font-black tracking-tight leading-tight text-white mb-10 max-w-3xl mx-auto"
        >
          {ctaContent.question.replace("?", "")}
          <span
            className="bg-clip-text text-transparent ml-3"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #C9A84C 0%, #E8CB72 50%, #C9A84C 100%)",
            }}
          >
            ?
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <Link
            href="/chat"
            className="group relative inline-flex items-center gap-3 font-bold text-[16px] text-[#050508] px-10 py-4 rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, #C9A84C 0%, #E8CB72 50%, #C9A84C 100%)",
              backgroundSize: "200% 100%",
              boxShadow:
                "0 0 40px rgba(201,168,76,0.4), 0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <span className="relative z-10">{ctaContent.cta}</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            {/* Shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
