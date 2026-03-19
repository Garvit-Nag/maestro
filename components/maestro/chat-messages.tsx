"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ComponentRenderer } from "@/components/football/component-renderer"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  components?: Array<{ type: string; data: unknown }>
  suggest_new_chat?: boolean
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
  onNewChat?: () => void
}

function normalizeMessage(message: Message): Message {
  if (message.role !== "assistant") return message
  const c = message.content.trim()
  if (!c.startsWith("{")) return message
  try {
    const parsed = JSON.parse(c)
    if (typeof parsed.text === "string") {
      return {
        ...message,
        content: parsed.text,
        components: message.components?.length
          ? message.components
          : parsed.components ?? [],
      }
    }
  } catch {}
  return message
}

export function ChatMessages({ messages, isLoading, onNewChat }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Check if any message suggests new chat
  const lastMessage = messages[messages.length - 1]
  const showNewChatBanner = lastMessage?.suggest_new_chat

  return (
    <div className="flex-1 overflow-y-auto maestro-scrollbar py-8 px-4">
      {/* Centered message column — same width constraint as input */}
      <div className="max-w-2xl mx-auto space-y-6">
        {messages.map((rawMessage) => {
          const message = normalizeMessage(rawMessage)
          return (
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
              /* Assistant message — left-aligned */
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
                  <p className="text-[15px] text-white/80 font-light leading-relaxed">
                    {message.content}
                  </p>

                  {/* Data components */}
                  {message.components?.map((component, idx) => (
                    <ComponentRenderer
                      key={idx}
                      type={component.type}
                      data={component.data}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          )
        })}

        {/* Long conversation nudge */}
        {showNewChatBanner && onNewChat && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px]"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <span className="text-white/50">Long conversation — start fresh for best results</span>
              <button
                onClick={onNewChat}
                className="text-[#C9A84C] font-medium hover:text-[#D4B85C] transition-colors"
              >
                New chat →
              </button>
            </div>
          </motion.div>
        )}

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
