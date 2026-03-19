"use client"

import Link from "next/link"
import { useState } from "react"

const tickerItems = [
  "Live data from 150+ leagues",
  "Player stats updated in real time",
  "Ask in plain English",
  "Powered by Gemini",
  "Transfer news as it breaks",
  "2,800+ teams tracked",
  "250K+ player profiles",
]

const knowledgeItems = [
  "Live scores & standings",
  "Player stats & injuries",
  "Transfers & team news",
]

export function LandingHero() {
  const [hoveredKnowledge, setHoveredKnowledge] = useState<number | null>(null)

  return (
    <section className="relative min-h-screen flex flex-col bg-[#0A0A0C]">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070')`,
        }}
      >
        <div className="absolute inset-0 bg-[#0A0A0C]/[0.88]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16 lg:py-8">
        <span className="text-[13px] font-light tracking-[0.2em] text-white/90">
          maestro
        </span>
        <Link 
          href="/chat" 
          className="text-[13px] text-white/70 hover:text-white transition-colors relative group"
        >
          Enter
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
        </Link>
      </header>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center px-8 lg:px-16">
        {/* Left content */}
        <div className="max-w-3xl">
          {/* Label */}
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-6">
            Football Intelligence
          </span>
          
          {/* Headline */}
          <h1 className="text-[clamp(48px,8vw,96px)] font-light leading-[1.05] text-white mb-6 text-balance">
            The game,<br />understood.
          </h1>
          
          {/* Subtext */}
          <p className="text-base text-[#6B6B7A] mb-10">
            Ask anything. Maestro knows.
          </p>
          
          {/* CTA */}
          <Link 
            href="/chat"
            className="inline-flex items-center text-[15px] text-white group relative"
          >
            <span>Begin</span>
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
          </Link>
        </div>

        {/* Gold vertical line - shifted to 60% from left */}
        <div className="hidden lg:block absolute left-[60%] top-1/2 -translate-y-1/2 w-px h-[120px] bg-[#C9A84C]" />

        {/* Right side content */}
        <div className="hidden lg:block absolute right-0 top-[45%] pr-8">
          {/* Circle outline - 40% cropped off right edge */}
          <div 
            className="absolute -right-[112px] top-0 w-[280px] h-[280px] rounded-full border border-[#C9A84C]/[0.12]"
          />
          
          {/* Content positioned relative to circle */}
          <div className="relative z-10 mr-8">
            {/* Label with extending line - gold treatment like FOOTBALL INTELLIGENCE */}
            <div className="flex items-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C]">
                What Maestro Knows
              </span>
              <div className="ml-3 w-12 h-px bg-[#C9A84C]/40" />
            </div>
            
            {/* Knowledge items - left aligned, readable */}
            <div className="space-y-4">
              {knowledgeItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center cursor-default"
                  onMouseEnter={() => setHoveredKnowledge(index)}
                  onMouseLeave={() => setHoveredKnowledge(null)}
                >
                  <span 
                    className={`mr-3 text-[#C9A84C] text-sm transition-opacity duration-200 ${
                      hoveredKnowledge === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    —
                  </span>
                  <span 
                    className={`text-[15px] font-light transition-colors duration-200 ${
                      hoveredKnowledge === index ? 'text-white' : 'text-[#8A8A9A]'
                    }`}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker - fixed to bottom, contained within viewport */}
      <div className="relative z-10 w-full bg-[#111116] border-t border-[#1C1C23] overflow-hidden shrink-0">
        <div className="flex animate-ticker whitespace-nowrap py-4">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-xs text-[#6B6B7A] px-6">
                {item}
              </span>
              <span className="text-[10px] text-[#3A3A48]">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
