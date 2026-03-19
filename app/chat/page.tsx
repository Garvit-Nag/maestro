"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatSidebar } from "@/components/maestro/chat-sidebar"
import { ChatEmptyState } from "@/components/maestro/chat-empty-state"
import { ChatMessages, Message } from "@/components/maestro/chat-messages"
import { ChatInput } from "@/components/maestro/chat-input"
import { OnboardingModal } from "@/components/maestro/onboarding-modal"
import { createClient } from "@/lib/supabase"

// Ghost intro exchange shown on first visit
const INTRO_MESSAGES: Message[] = [
  {
    id: "intro-user",
    role: "user",
    content: "Who's leading the Premier League golden boot this season?",
  },
  {
    id: "intro-bot",
    role: "assistant",
    content: "Erling Haaland is the benchmark. Ask me anything — live standings, player stats, fixtures, transfers.",
    components: [],
  },
]

function ChatPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationIdParam = searchParams.get("id")

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(conversationIdParam)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(true)
  const [isInitializing, setIsInitializing] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  // Initialize: check auth + user preferences (once on mount)
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/?auth=required")
        return
      }
      setUserId(user.id)

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("has_completed_onboarding, has_seen_intro")
        .eq("user_id", user.id)
        .single()

      if (!prefs || !prefs.has_completed_onboarding) setShowOnboarding(true)
      if (prefs && !prefs.has_seen_intro) setHasSeenIntro(false)

      setIsInitializing(false)
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load conversation messages whenever the URL ?id param changes
  useEffect(() => {
    if (!conversationIdParam) {
      setMessages([])
      setConversationId(null)
      return
    }
    setConversationId(conversationIdParam)
    supabase
      .from("messages")
      .select("id, role, content, components")
      .eq("conversation_id", conversationIdParam)
      .order("created_at", { ascending: true })
      .then(({ data: msgs }) => {
        if (msgs) {
          setMessages(
            msgs.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              components: m.components ?? undefined,
            }))
          )
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationIdParam])

  const handleSendMessage = useCallback(async (content: string) => {
    // If showing intro, clear it
    setHasSeenIntro(true)
    if (userId) {
      supabase
        .from("user_preferences")
        .upsert({ user_id: userId, has_seen_intro: true })
        .then(() => {})
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => {
      // Remove intro messages if present
      const filtered = prev.filter((m) => !m.id.startsWith("intro-"))
      return [...filtered, userMessage]
    })
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error ?? "Request failed")
      }

      const data = await res.json()

      // Update conversationId if new
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
        router.replace(`/chat?id=${data.conversationId}`)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text ?? "I couldn't process that. Please try again.",
        components: data.components ?? [],
        suggest_new_chat: data.suggest_new_chat ?? false,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong."
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `VAR is reviewing this one. ${errMsg} Try again.`,
          components: [],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, userId])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setConversationId(null)
    router.push("/chat")
  }, [router])

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false)
  }, [])

  const displayMessages = hasSeenIntro ? messages : [...INTRO_MESSAGES, ...messages]
  const hasMessages = displayMessages.length > 0

  if (isInitializing) {
    return (
      <div className="flex h-screen bg-[#050508] items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <div className="flex h-screen bg-[#050508] overflow-hidden">
        <ChatSidebar onNewChat={handleNewChat} currentConversationId={conversationId} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <div
            className="shrink-0 flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
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

            <span className="lg:hidden text-[13px] font-semibold tracking-[0.25em] text-white">
              maestro
            </span>

            <div className="w-24" />
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            {hasMessages ? (
              <ChatMessages
                messages={displayMessages}
                isLoading={isLoading}
                onNewChat={handleNewChat}
              />
            ) : (
              <ChatEmptyState onPromptSelect={handleSendMessage} />
            )}

            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
              hint={!hasSeenIntro && !hasMessages ? "Maestro pulls live data from 18+ football sources" : undefined}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-[#050508] items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    }>
      <ChatPageInner />
    </Suspense>
  )
}
