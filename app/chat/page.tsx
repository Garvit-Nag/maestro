"use client"

import { useState, useCallback } from "react"
import { ChatSidebar } from "@/components/maestro/chat-sidebar"
import { ChatEmptyState } from "@/components/maestro/chat-empty-state"
import { ChatMessages, Message } from "@/components/maestro/chat-messages"
import { ChatInput } from "@/components/maestro/chat-input"
import { demoResponses } from "@/lib/content/chat"

function generateResponse(query: string): { content: string; data?: Message["data"] } {
  const q = query.toLowerCase()

  if (q.includes("table") || q.includes("standings")) {
    return { content: demoResponses.standings, data: { type: "standings" } }
  }
  if (q.includes("lineup") || q.includes("line up")) {
    return { content: demoResponses.lineup, data: { type: "lineup" } }
  }
  if (q.includes("golden boot") || q.includes("goals")) {
    return { content: demoResponses.goldenBoot, data: { type: "stats" } }
  }
  if (q.includes("transfer")) {
    return { content: demoResponses.transfer }
  }
  return { content: demoResponses.default }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const response = generateResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        data: response.data,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1200)
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-screen bg-[#050508] overflow-hidden">
      <ChatSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Model indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
            </div>
            <span className="text-[13px] text-white/50 font-light">Maestro</span>
            <span
              className="text-[10px] text-white/20 px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Football Intelligence
            </span>
          </div>

          {/* Mobile logo */}
          <span className="lg:hidden text-[13px] font-semibold tracking-[0.25em] text-white">
            maestro
          </span>

          {/* Right side placeholder */}
          <div className="w-24" />
        </div>

        {/* Chat area — scrollable, input pinned at bottom */}
        <div className="flex-1 flex flex-col min-h-0">
          {hasMessages ? (
            <ChatMessages messages={messages} isLoading={isLoading} />
          ) : (
            <ChatEmptyState onPromptSelect={handleSendMessage} />
          )}

          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  )
}
