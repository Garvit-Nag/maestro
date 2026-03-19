"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  placeholderStandings,
  placeholderLineup,
  placeholderStats,
} from "@/lib/content/chat"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  data?: {
    type: "standings" | "lineup" | "stats"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
  }
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto maestro-scrollbar py-8 px-4">
      {/* Centered message column — same width constraint as input */}
      <div className="max-w-2xl mx-auto space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {message.role === "user" ? (
              /* User message — right-aligned bubble */
              <div className="flex justify-end">
                <div
                  className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <p className="text-[15px] text-white/90 font-light leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              /* Assistant message — left-aligned, no bubble */
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/30 mb-2 font-medium tracking-wide">
                    Maestro
                  </p>
                  <p className="text-[15px] text-white/80 font-light leading-relaxed mb-0">
                    {message.content}
                  </p>

                  {/* Data card */}
                  {message.data && (
                    <div
                      className="mt-4 rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)",
                        }}
                      />
                      <div className="p-4">
                        <DataCard data={message.data} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="shrink-0 mt-0.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] animate-pulse" />
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-[12px] text-white/30 mb-3 font-medium tracking-wide">
                Maestro
              </p>
              {/* Thinking dots */}
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function DataCard({ data }: { data: Message["data"] }) {
  if (!data) return null
  switch (data.type) {
    case "standings": return <StandingsCard />
    case "lineup": return <LineupCard />
    case "stats": return <StatsCard />
    default: return null
  }
}

function StandingsCard() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-4">
        Premier League Standings
      </p>
      <div className="space-y-0">
        <div className="flex items-center text-[10px] text-white/20 uppercase tracking-wider px-2 pb-2">
          <span className="w-6">#</span>
          <span className="flex-1">Club</span>
          <span className="w-8 text-center">MP</span>
          <span className="w-10 text-center">GD</span>
          <span className="w-8 text-right">Pts</span>
        </div>
        {placeholderStandings.map((team) => (
          <div
            key={team.pos}
            className="flex items-center text-[13px] py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-default"
          >
            <span className="w-6 text-white/20 text-[12px]">{team.pos}</span>
            <span className="flex-1 text-white/75 font-light">{team.name}</span>
            <span className="w-8 text-center text-white/25 text-[12px]">{team.played}</span>
            <span className="w-10 text-center text-white/25 text-[12px]">{team.gd}</span>
            <span className="w-8 text-right text-white font-semibold">{team.points}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineupCard() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-4">
        {placeholderLineup.cardTitle}
      </p>
      <div className="flex gap-8">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">
            {placeholderLineup.teamLabel}
          </p>
          <div className="space-y-1.5">
            {placeholderLineup.startingXI.map((line, i) => (
              <p key={i} className="text-[13px] text-white/65 font-light leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/25 mb-3">
            {placeholderLineup.formationLabel}
          </p>
          <p className="text-[24px] font-black text-white tracking-widest">
            {placeholderLineup.formation}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatsCard() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-4">
        Player Stats
      </p>
      <div className="grid grid-cols-4 gap-2.5">
        {placeholderStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xl font-black text-white leading-none mb-1.5">{stat.value}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
