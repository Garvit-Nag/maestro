"use client"

import { useState } from "react"

interface ChatEmptyStateProps {
  onPromptSelect: (prompt: string) => void
}

const prompts = [
  "How will Arsenal line up this weekend?",
  "Who's leading the Champions League golden boot?",
  "Show me the Premier League table",
  "Latest transfer news",
]

export function ChatEmptyState({ onPromptSelect }: ChatEmptyStateProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex-1 flex flex-col items-start justify-center px-8 lg:px-16 max-w-2xl">
      {/* Headline */}
      <h1 className="text-[clamp(32px,5vw,48px)] font-light leading-[1.15] text-white mb-12 text-balance">
        {"What's on"}<br />your mind?
      </h1>

      {/* Suggested prompts */}
      <div className="space-y-4 mb-auto">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptSelect(prompt)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="block text-left text-[15px] leading-relaxed transition-colors duration-200 group"
          >
            <span className={`inline-flex items-center ${
              hoveredIndex === index ? 'text-white' : 'text-[#4A4A58]'
            }`}>
              <span className={`mr-3 transition-all duration-200 ${
                hoveredIndex === index ? 'opacity-100 text-[#C9A84C]' : 'opacity-0'
              }`}>
                —
              </span>
              {prompt}
            </span>
          </button>
        ))}
      </div>

      {/* Stats whisper */}
      <p className="text-[11px] text-[#2A2A38]">
        150+ leagues · 2,800+ teams · 250K+ players
      </p>
    </div>
  )
}
