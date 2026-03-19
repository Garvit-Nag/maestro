"use client"

import { useState, useCallback } from "react"
import { ChatSidebar } from "@/components/maestro/chat-sidebar"
import { ChatEmptyState } from "@/components/maestro/chat-empty-state"
import { ChatMessages, Message } from "@/components/maestro/chat-messages"
import { ChatInput } from "@/components/maestro/chat-input"

// Simulate AI responses with placeholder data
function generateResponse(query: string): { content: string; data?: Message["data"] } {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes("table") || lowerQuery.includes("standings")) {
    return {
      content: "Here are the current Premier League standings. Arsenal continue to lead the table with a strong goal difference.",
      data: { type: "standings" }
    }
  }
  
  if (lowerQuery.includes("lineup") || lowerQuery.includes("line up")) {
    return {
      content: "Based on recent form and availability, here's the predicted lineup for Arsenal this weekend.",
      data: { type: "lineup" }
    }
  }
  
  if (lowerQuery.includes("golden boot") || lowerQuery.includes("goals")) {
    return {
      content: "The Champions League golden boot race is heating up. Here are the current top scorers.",
      data: { type: "stats" }
    }
  }
  
  if (lowerQuery.includes("transfer")) {
    return {
      content: "The latest transfer news: Manchester United are reportedly in talks with a high-profile midfielder, while Chelsea continue their rebuild under the new manager. Arsenal are looking to strengthen their defensive options before the deadline."
    }
  }
  
  return {
    content: "I understand you're asking about football. While I don't have real-time data in this demo, Maestro can provide insights on match analysis, player statistics, tactical breakdowns, and transfer news from 150+ leagues worldwide."
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        data: response.data,
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1200)
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex min-h-screen bg-[#0A0A0C]">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#1C1C23]">
          <span className="text-[13px] font-light tracking-[0.2em] text-white/90">
            maestro
          </span>
        </header>

        {hasMessages ? (
          <ChatMessages messages={messages} isLoading={isLoading} />
        ) : (
          <ChatEmptyState onPromptSelect={handleSendMessage} />
        )}

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </main>
    </div>
  )
}
