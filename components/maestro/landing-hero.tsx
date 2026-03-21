"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GiSoccerBall } from "react-icons/gi"
import { FaArrowRight } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { tickerItems, heroContent } from "@/lib/content/landing"
import { useAuthModal } from "@/lib/auth-modal-context"
import { Logo } from "@/components/maestro/logo"
import { UserProfileButton } from "@/components/maestro/user-profile-button"
import TiltedCard from "@/components/ui/tilted-card"

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
})

const mockScorers = [
  { name: "E. Haaland", club: "Man City", goals: 24 },
  { name: "M. Salah", club: "Liverpool", goals: 21 },
  { name: "C. Palmer", club: "Chelsea", goals: 18 },
]

const stats = [
  { value: "150+", label: "Leagues" },
  { value: "250K+", label: "Players" },
  { value: "Live", label: "Match data" },
]

export function LandingHero() {
  const { openAuthModal, sessionUser, setSessionUser } = useAuthModal()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const userName = sessionUser?.user_metadata?.username
    || sessionUser?.user_metadata?.full_name?.split(" ")[0]
    || sessionUser?.email?.split("@")[0]
    || "User"
  const userAvatarUrl = sessionUser?.user_metadata?.avatar_url ?? "/avatar.png"

  return (
    <>
      {/* Fixed Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 py-3 lg:px-16 lg:py-3.5 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-[#050508]/75 border-b border-white/[0.05]" : ""}`}>
        {/* Logo */}
        <motion.div {...fadeUp(0)}>
          <Logo />
        </motion.div>

        {/* Right: nav links + divider + CTA */}
        <motion.div {...fadeUp(0.05)} className="hidden md:flex items-center gap-6">
          {[
            { label: "Features", href: "#capabilities" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] text-white/40 hover:text-white transition-all duration-300 relative group"
            >
              <div className="group-hover:-translate-y-0.5 transition-transform duration-300">
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]">{link.label}</span>
              </div>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C]/60 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <button
            onClick={sessionUser ? () => router.push("/chat") : openAuthModal}
            className="text-[14px] text-white/40 hover:text-white transition-all duration-300 relative group"
          >
            <div className="group-hover:-translate-y-0.5 transition-transform duration-300">
              <span className="group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]">
                {sessionUser ? "Go to Chat" : "Try it"}
              </span>
            </div>
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C]/60 group-hover:w-full transition-all duration-300" />
          </button>
          {/* Divider */}
          <div className="w-px h-4 bg-white/[0.10]" />
          {sessionUser ? (
            <UserProfileButton userName={userName} userAvatarUrl={userAvatarUrl} position="down" onLogout={() => setSessionUser(null)} />
          ) : (
            <button
              onClick={openAuthModal}
              className="group flex items-center gap-2 text-[14px] text-white/60 hover:text-white transition-colors duration-300 border border-white/[0.08] hover:border-[#C9A84C]/40 rounded-full px-5 py-2 bg-white/[0.03]"
            >
              Get started
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 flex items-center">
                <FaArrowRight />
              </span>
            </button>
          )}
        </motion.div>
      </header>

      <section className="relative h-screen overflow-hidden flex flex-col">
        {/* Radial glow behind hero text */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(201,168,76,0.18) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Hero body */}
        <div className="relative z-10 w-full flex-1 flex items-center px-8 lg:px-16 gap-10 xl:gap-16 pt-[72px]">
          {/* Left column */}
          <div className="flex-1 max-w-2xl translate-y-4 lg:translate-y-6">
            {/* Headline */}
            <div className="mb-7 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
                className="text-[clamp(44px,6vw,84px)] font-black leading-none tracking-tight text-white"
              >
                The game,
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #C9A84C 0%, #E8CB72 40%, #C9A84C 80%, #A87828 100%)",
                  }}
                >
                  understood.
                </span>
              </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              {...fadeUp(0.35)}
              className="text-[17px] text-white/60 mb-10 leading-relaxed max-w-md font-light"
            >
              Ask anything about football. Live data, instant answers — no filters, no
              dropdowns, just intelligence.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.42)} className="flex items-center gap-4 mb-12">
              <button
                onClick={sessionUser ? () => router.push("/chat") : openAuthModal}
                className="group relative inline-flex items-center gap-3 bg-[#C9A84C] hover:bg-[#D4B85C] text-[#050508] font-semibold text-[15px] px-7 py-3.5 rounded-xl transition-all duration-300 overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 32px rgba(201,168,76,0.35), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <span className="relative z-10">{sessionUser ? "Go to Chat" : "Begin talking"}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 flex items-center">
                  <FaArrowRight />
                </span>
                {/* Shimmer sweep on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </button>

              <Link
                href="#capabilities"
                className="inline-flex items-center gap-2 text-[15px] text-white/50 hover:text-white/80 transition-colors duration-300 border border-white/[0.08] hover:border-white/20 rounded-xl px-6 py-3.5 backdrop-blur-sm bg-white/[0.03]"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Stat chips */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-3 flex-wrap">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/[0.03]"
                >
                  <span className="text-[13px] font-semibold text-[#C9A84C]">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-white/40">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — floating chat preview */}
          <motion.div
            initial={{ opacity: 0, y: 32, rotateY: -4 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="hidden xl:flex xl:flex-1 items-center justify-center translate-y-4 lg:translate-y-6"
            style={{ perspective: "1200px" }}
          >
            <div className="relative w-full max-w-[500px]">
              <TiltedCard
                altText="Maestro Chat"
                captionText=""
                containerHeight="auto"
                containerWidth="100%"
                imageHeight="auto"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    backdropFilter: "blur(24px)",
                    boxShadow:
                      "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Gold top accent */}
                  <div
                    className="h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
                    }}
                  />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                        <GiSoccerBall className="w-3 h-3 text-[#C9A84C]" />
                      </div>
                      <span className="text-[12px] text-white/50 tracking-wide">Maestro</span>
                    </div>

                    {/* User message */}
                    <div className="flex justify-end mb-4">
                      <div
                        className="rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <p className="text-[13px] text-white/90 leading-snug">
                          Who&apos;s the top scorer in the Premier League this season?
                        </p>
                      </div>
                    </div>

                    {/* Maestro text response */}
                    <p className="text-[13px] text-white/70 leading-relaxed mb-4 font-light">
                      Erling Haaland leads the Golden Boot race with{" "}
                      <span className="text-white/90 font-medium">24 goals</span> in 28
                      appearances — 0.86 per game.
                    </p>

                    {/* Mini data card */}
                    <div
                      className="rounded-xl mb-4 overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
                        }}
                      />
                      <div className="p-3">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2.5">
                          Top Scorers · PL 24/25
                        </p>
                        <div className="space-y-1.5">
                          {mockScorers.map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-[10px] text-white/25 w-3">{i + 1}</span>
                              <span className="text-[11px] text-white/80 flex-1 font-light">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-white/30">{p.club}</span>
                              <span className="text-[12px] text-white font-semibold ml-1">
                                {p.goals}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mock input */}
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-[12px] text-white/20 flex-1">
                        Ask about football...
                      </span>
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "#C9A84C" }}
                      >
                        <FaArrowRight className="w-[10px] h-[10px] text-[#050508]" />
                      </div>
                    </div>
                  </div>
                </div>
              </TiltedCard>

              {/* Glow beneath card */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full blur-2xl"
                style={{ background: "rgba(201,168,76,0.12)" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 flex justify-center pb-8"
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Ticker — below the fold */}
      <div className="w-full bg-[#0D0D10] border-t border-white/[0.05] overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-3.5">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-[11px] text-white/25 px-6 tracking-wide">{item}</span>
              <span className="text-[10px] text-white/10">·</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
