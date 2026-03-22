"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { GiSoccerBall } from "react-icons/gi"
import { Menu } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components/maestro/logo"
import { ChatSidebar } from "@/components/maestro/chat-sidebar"
import { ChatEmptyState } from "@/components/maestro/chat-empty-state"
import { ChatMessages, Message } from "@/components/maestro/chat-messages"
import { ChatInput } from "@/components/maestro/chat-input"
import { OnboardingModal } from "@/components/maestro/onboarding-modal"
import { createClient } from "@/lib/supabase"

function ChatPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationIdParam = searchParams.get("id")

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(conversationIdParam)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [prefsUpdated, setPrefsUpdated] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        .select("has_completed_onboarding")
        .eq("user_id", user.id)
        .single()

      if (!prefs || !prefs.has_completed_onboarding) setShowOnboarding(true)

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
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
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
      const errMsg = err instanceof Error ? err.message : "VAR is reviewing this one. Something went wrong."
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errMsg,
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
    setPrefsUpdated((n) => n + 1)
  }, [])

  const hasMessages = messages.length > 0

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full bg-[#050508] overflow-hidden">
        {/* Skeleton Sidebar (hidden on mobile) */}
        <div className="hidden lg:flex flex-col w-[240px] px-5 py-7 border-r border-[#C9A84C]/5">
           <div className="w-32 h-6 bg-white/5 rounded animate-pulse mb-8" />
           <div className="w-full h-10 bg-white/5 rounded-xl animate-pulse mb-7" />
           <div className="w-full h-28 bg-white/5 rounded-xl animate-pulse mb-7" style={{ animationDelay: "0.15s" }} />
           <div className="space-y-3 flex-1 mt-4 opacity-50">
              <div className="w-3/4 h-6 bg-white/5 rounded animate-pulse" />
              <div className="w-5/6 h-6 bg-white/5 rounded animate-pulse" style={{ animationDelay: "0.15s" }} />
              <div className="w-2/3 h-6 bg-white/5 rounded animate-pulse" style={{ animationDelay: "0.3s" }} />
           </div>
           <div className="w-full h-10 bg-white/5 rounded-xl animate-pulse mt-4" />
        </div>
        
        {/* Skeleton Main Area */}
        <div className="flex-1 flex flex-col p-4 md:p-8 justify-center items-center relative">
           <div className="w-16 h-16 bg-white/5 rounded-2xl animate-pulse mb-8" />
           <div className="w-64 h-8 bg-white/5 rounded-lg animate-pulse mb-5" />
           <div className="w-96 h-4 bg-white/5 rounded animate-pulse max-w-[80%]" style={{ animationDelay: "0.15s" }} />
           
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
              <div className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl animate-pulse" style={{ animationDelay: "0.3s" }} />
           </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <div className="flex h-screen bg-[#050508] overflow-hidden">
        <ChatSidebar
          onNewChat={() => {
            handleNewChat()
            setIsMobileMenuOpen(false)
          }}
          currentConversationId={conversationId}
          mobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          prefsUpdated={prefsUpdated}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Top bar */}
          <div
            className="shrink-0 lg:hidden flex items-center justify-between px-5 py-3.5 relative z-30"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#050508" }}
          >
            <div className="-ml-1 transform scale-90">
              <Logo onClick={() => setIsMobileMenuOpen(false)} />
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -mr-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            {hasMessages ? (
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                onNewChat={handleNewChat}
              />
            ) : (
              <ChatEmptyState onPromptSelect={handleSendMessage} />
            )}

            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
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

