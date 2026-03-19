"use client"

import { useState } from "react"

const cards = [
  { id: 1, label: "Standings Response" },
  { id: 2, label: "Player Stats Response" },
  { id: 3, label: "Match Result Response" },
]

export function LandingCapabilities() {
  const [activeCard, setActiveCard] = useState(0)

  return (
    <section className="bg-[#0A0A0C] px-8 lg:px-16 py-24 lg:py-32">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-8">
        {/* Left column - 45% */}
        <div className="lg:w-[45%]">
          {/* Gold label */}
          <span className="inline-block text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-6">
            Built for the Game
          </span>
          
          {/* Heading */}
          <h2 className="text-[32px] font-light leading-[1.2] text-white mb-6">
            Everything you'd ask<br />a football expert.
          </h2>
          
          {/* Body text */}
          <p className="text-sm text-[#4A4A58] max-w-[360px] leading-relaxed">
            Maestro understands your question, pulls live data, and shows you the answer — not just text.
          </p>
        </div>

        {/* Right column - 55% */}
        <div className="lg:w-[55%]">
          {/* Card container */}
          <div className="relative h-[280px] lg:h-[320px]">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`absolute inset-0 bg-[#111116] border border-[#1C1C23] rounded-lg transition-opacity duration-300 ${
                  activeCard === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Placeholder card content */}
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-full max-w-sm space-y-3">
                    {/* Mock chat response header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[#1C1C23]" />
                      <span className="text-xs text-[#4A4A58]">Maestro</span>
                    </div>
                    
                    {/* Mock response lines */}
                    <div className="space-y-2">
                      <div className="h-3 bg-[#1C1C23] rounded w-full" />
                      <div className="h-3 bg-[#1C1C23] rounded w-4/5" />
                      <div className="h-3 bg-[#1C1C23] rounded w-3/4" />
                    </div>
                    
                    {/* Mock data card */}
                    <div className="mt-4 p-4 bg-[#0A0A0C] border border-[#1C1C23] rounded">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-2 bg-[#1C1C23] rounded w-20" />
                          <div className="h-2 bg-[#1C1C23] rounded w-8" />
                        </div>
                        <div className="flex justify-between">
                          <div className="h-2 bg-[#1C1C23] rounded w-24" />
                          <div className="h-2 bg-[#1C1C23] rounded w-8" />
                        </div>
                        <div className="flex justify-between">
                          <div className="h-2 bg-[#1C1C23] rounded w-16" />
                          <div className="h-2 bg-[#1C1C23] rounded w-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card label */}
                  <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[2px] text-[#3A3A48]">
                    {card.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCard(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  activeCard === index ? 'bg-[#C9A84C]' : 'bg-[#1C1C23] hover:bg-[#2A2A38]'
                }`}
                aria-label={`View card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
