"use client"

import { useEffect, useRef } from "react"

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
    <div className="flex-1 overflow-y-auto maestro-scrollbar px-8 lg:px-16 py-8">
      <div className="max-w-3xl space-y-8">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.role === "user" 
                ? "ml-auto text-right max-w-[60%]" 
                : "mr-auto max-w-[80%]"
            }`}
          >
            <p className={`text-[15px] leading-relaxed ${
              message.role === "user" ? "text-white" : "text-white/90"
            }`}>
              {message.content}
            </p>
            
            {/* Data card if present */}
            {message.data && (
              <div className="mt-4 bg-[#111116] border border-[#1C1C23] rounded-lg p-4 text-left">
                <DataCard data={message.data} />
              </div>
            )}
          </div>
        ))}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mr-auto max-w-[80%]">
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-[#1C1C23] rounded animate-shimmer" />
              <div className="h-4 w-1/2 bg-[#1C1C23] rounded animate-shimmer" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function DataCard({ data }: { data: Message["data"] }) {
  if (!data) return null

  switch (data.type) {
    case "standings":
      return <StandingsCard />
    case "lineup":
      return <LineupCard />
    case "stats":
      return <StatsCard />
    default:
      return null
  }
}

function StandingsCard() {
  const teams = [
    { pos: 1, name: "Arsenal", played: 28, gd: "+42", points: 67 },
    { pos: 2, name: "Liverpool", played: 28, gd: "+38", points: 65 },
    { pos: 3, name: "Man City", played: 28, gd: "+35", points: 62 },
    { pos: 4, name: "Aston Villa", played: 28, gd: "+18", points: 55 },
    { pos: 5, name: "Tottenham", played: 28, gd: "+12", points: 50 },
  ]

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
        Premier League Standings
      </p>
      <div className="space-y-2">
        {teams.map((team) => (
          <div 
            key={team.pos} 
            className="flex items-center text-[13px] py-2 border-l-2 border-transparent hover:border-[#C9A84C] hover:bg-[#1C1C23]/50 px-3 -mx-3 transition-colors"
          >
            <span className="w-6 text-[#4A4A58]">{team.pos}</span>
            <span className="flex-1 text-white">{team.name}</span>
            <span className="w-8 text-center text-[#4A4A58]">{team.played}</span>
            <span className="w-12 text-center text-[#4A4A58]">{team.gd}</span>
            <span className="w-8 text-right text-white font-medium">{team.points}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LineupCard() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
        Predicted Lineup
      </p>
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <p className="text-[#4A4A58] mb-2">Starting XI</p>
          <div className="space-y-1">
            <p className="text-white/90">Raya</p>
            <p className="text-white/90">White, Saliba, Gabriel, Zinchenko</p>
            <p className="text-white/90">Rice, Odegaard, Havertz</p>
            <p className="text-white/90">Saka, Jesus, Martinelli</p>
          </div>
        </div>
        <div>
          <p className="text-[#4A4A58] mb-2">Formation</p>
          <p className="text-white/90">4-3-3</p>
        </div>
      </div>
    </div>
  )
}

function StatsCard() {
  const stats = [
    { label: "Goals", value: "18" },
    { label: "Assists", value: "6" },
    { label: "Matches", value: "24" },
    { label: "Minutes", value: "2,160" },
  ]

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-4">
        Player Stats
      </p>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-light text-white mb-1">{stat.value}</p>
            <p className="text-[11px] text-[#4A4A58]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
