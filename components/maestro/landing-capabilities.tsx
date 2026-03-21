"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { capabilitiesContent } from "@/lib/content/landing"

const features = [
  {
    number: "01",
    title: "Live Standings & Results",
    description:
      "Real-time league tables and match results from 150+ competitions. Ask and get structured data back — not a web page.",
    preview: (
      <div className="space-y-1.5">
        {[
          { pos: 1, name: "Liverpool", pts: 67, gd: "+42" },
          { pos: 2, name: "Arsenal", pts: 61, gd: "+32" },
          { pos: 3, name: "Man City", pts: 58, gd: "+28" },
          { pos: 4, name: "Chelsea", pts: 55, gd: "+18" },
        ].map((team) => (
          <div key={team.pos} className="flex items-center gap-3 py-1 px-2 rounded-lg">
            <span className="text-[11px] text-white/20 w-4 shrink-0">{team.pos}</span>
            <span className="text-[13px] text-white/75 flex-1 font-light">{team.name}</span>
            <span className="text-[11px] text-white/25 w-8 text-center">{team.gd}</span>
            <span className="text-[13px] text-white font-semibold w-6 text-right">{team.pts}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "02",
    title: "Player Intelligence",
    description:
      "From goals and assists to form streaks — Maestro surfaces the stats that matter for any player across any league.",
    preview: (
      <div>
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <span className="text-[17px] font-black text-[#C9A84C]">9</span>
          </div>
          <div>
            <p className="text-[13px] text-white/90 font-medium">Erling Haaland</p>
            <p className="text-[11px] text-white/30">Manchester City · FW</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: "24", l: "Goals" }, { v: "5", l: "Assists" }, { v: "28", l: "Apps" }].map((s) => (
            <div key={s.l} className="rounded-lg p-2.5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[17px] font-black text-white leading-none mb-0.5">{s.v}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Match Analysis",
    description:
      "Head-to-heads, lineups, tactical breakdowns, and detailed match stats — everything you'd want from a football expert.",
    preview: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-center flex-1">
            <p className="text-[13px] text-white/90 font-medium">Arsenal</p>
            <p className="text-[10px] text-white/25 mt-0.5">Home</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl mx-2" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <p className="text-[18px] font-black text-white tracking-wider text-center leading-none">2 — 1</p>
            <p className="text-[9px] text-[#C9A84C]/60 text-center mt-0.5 uppercase tracking-widest">FT</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[13px] text-white/90 font-medium">Chelsea</p>
            <p className="text-[10px] text-white/25 mt-0.5">Away</p>
          </div>
        </div>
        <div className="space-y-2">
          {[{ label: "Possession", home: 58, away: 42 }, { label: "Shots on target", home: 6, away: 3 }].map((row) => (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/25">
                <span>{row.home}{row.label === "Possession" ? "%" : ""}</span>
                <span className="text-white/15">{row.label}</span>
                <span>{row.away}{row.label === "Possession" ? "%" : ""}</span>
              </div>
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${(row.home / (row.home + row.away)) * 100}%`, background: "linear-gradient(90deg, rgba(201,168,76,0.7), rgba(201,168,76,0.3))" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

export function LandingCapabilities() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="capabilities"
      className="relative px-8 lg:px-16 py-24 lg:py-32 scroll-mt-16"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="relative max-w-screen-xl">
        {/* Section header */}
        <div className="mb-16 max-w-2xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-5"
          >
            {capabilitiesContent.label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tight text-white mb-5"
          >
            {capabilitiesContent.heading[0]}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #C9A84C 0%, #E8CB72 50%, #C9A84C 100%)" }}
            >
              {capabilitiesContent.heading[1]}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-[15px] text-white/40 leading-relaxed"
          >
            {capabilitiesContent.body}
          </motion.p>
        </div>

        {/* Feature cards — plain glassmorphic, no TiltedCard */}
        <div ref={ref} className="grid lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 + index * 0.1 }}
              className="group relative rounded-2xl p-6 flex flex-col cursor-default overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(201,168,76,0.2)"
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.08)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)"
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"
              }}
            >
              {/* Number */}
              <span className="text-[10px] font-mono tracking-[0.3em] mb-5 block" style={{ color: "rgba(201,168,76,0.45)" }}>
                {feature.number}
              </span>

              <h3 className="text-[17px] font-bold text-white mb-2.5 leading-snug">{feature.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed mb-6 font-light">{feature.description}</p>

              <div className="mt-auto rounded-xl p-4" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.04)" }}>
                {feature.preview}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
