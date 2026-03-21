"use client"

import { motion } from "framer-motion"
import { LayoutList, Trophy, BarChart2, ArrowLeftRight } from "lucide-react"
import { GiSoccerBall } from "react-icons/gi"
import { suggestedPrompts } from "@/lib/content/chat"

interface ChatEmptyStateProps {
  onPromptSelect: (prompt: string) => void
}

const promptIcons = [LayoutList, Trophy, BarChart2, ArrowLeftRight]

export function ChatEmptyState({ onPromptSelect }: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-7 relative"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 0 32px rgba(201,168,76,0.1)",
            }}
          >
            <GiSoccerBall className="w-7 h-7 text-[#C9A84C]" />
          </div>
          {/* Ping ring */}
          <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ border: "1px solid rgba(201,168,76,0.5)" }}
          />
        </motion.div>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 }}
          className="text-[28px] font-bold text-white text-center mb-2 tracking-tight"
        >
          What do you want to know?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-[14px] text-white/35 text-center mb-10 font-light"
        >
          Ask about any team, player, match or league — across 150+ competitions worldwide.
        </motion.p>

        {/* Suggestion grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {suggestedPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              onClick={() => onPromptSelect(prompt)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 + index * 0.05 }}
              className="group text-left p-4 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"
                ;(e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.13)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"
                ;(e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.07)"
              }}
            >
              {(() => { const Icon = promptIcons[index]; return <Icon className="w-4 h-4 text-white/25 mb-2.5" strokeWidth={1.5} /> })()}
              <p className="text-[13px] text-white/55 group-hover:text-white/85 transition-colors duration-200 leading-snug font-light">
                {prompt}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
