"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { LogOut, X, Settings, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { sidebarContent } from "@/lib/content/chat"
import { SettingsModal } from "@/components/maestro/settings-modal"

interface Conversation {
  id: string
  title: string | null
  created_at: string
}

interface FixtureData {
  home: string
  away: string
  time: string
  date: string
  competition?: string
  status?: string
}

interface ChatSidebarProps {
  onNewChat?: () => void
  currentConversationId?: string | null
}

export function ChatSidebar({ onNewChat, currentConversationId }: ChatSidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [fixture, setFixture] = useState<FixtureData | null>(null)
  const [userName, setUserName] = useState("")
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Load user info (name + avatar)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.full_name || user.email || "User"
      setUserName(name.split(" ")[0])
      setUserAvatarUrl(user.user_metadata?.avatar_url ?? null)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load conversations
  useEffect(() => {
    loadConversations()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId])

  async function loadConversations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setConversations(data)
  }

  // Load featured fixture
  useEffect(() => {
    fetch("/api/fixtures")
      .then((r) => r.json())
      .then((data) => { if (data) setFixture(data) })
      .catch(() => {})
  }, [])

  // Click-outside handler for profile menu
  useEffect(() => {
    if (!showProfileMenu) return
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showProfileMenu])

  const handleNewChat = async () => {
    onNewChat?.()
    loadConversations()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleConversationClick = (id: string) => {
    router.push(`/chat?id=${id}`)
  }

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await supabase.from("messages").delete().eq("conversation_id", id)
    await supabase.from("conversations").delete().eq("id", id)
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentConversationId === id) router.push("/chat")
  }



  return (
    <>
      <aside
        className="hidden lg:flex flex-col w-[240px] min-h-screen px-5 py-7"
        style={{
          background: "rgba(5,5,8,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <span className="text-[13px] font-semibold tracking-[0.25em] text-white mb-8">
          maestro
        </span>

        {/* New Chat button */}
        <button
          onClick={handleNewChat}
          className="w-full h-9 flex items-center justify-center text-[12px] text-white/40 rounded-xl mb-7 transition-all duration-200 hover:text-white/70"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.35)"
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(201,168,76,0.06)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "none"
          }}
        >
          {sidebarContent.newChat}
        </button>

        {/* Featured match */}
        <div
          className="mb-7 rounded-xl p-4 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderLeft: "2px solid rgba(201,168,76,0.35)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-1.5 h-1.5 rounded-full block ${fixture?.status === "IN_PLAY" ? "bg-green-400 animate-pulse" : "bg-[#C9A84C]"}`} />
            <span className="text-[9px] uppercase tracking-[3px] text-white/30">
              {fixture?.status === "IN_PLAY" ? "Live" : "Featured"}
            </span>
          </div>
          {fixture ? (
            <>
              <div className="space-y-1">
                <p className="text-[13px] text-white/80 font-medium">{fixture.home}</p>
                <p className="text-[10px] text-white/20 pl-0.5">vs</p>
                <p className="text-[13px] text-white/80 font-medium">{fixture.away}</p>
              </div>
              <p className="text-[11px] text-[#C9A84C]/50 mt-3">
                {fixture.time} · {fixture.date}
              </p>
            </>
          ) : (
            <div className="space-y-1">
              <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
              <div className="h-2 w-4 rounded bg-white/3" />
              <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
            </div>
          )}
        </div>

        {/* Recent conversations */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <span className="text-[9px] uppercase tracking-[3px] text-white/20 mb-3 block">
            {sidebarContent.recentLabel}
          </span>
          <div className="space-y-0.5 overflow-y-auto maestro-scrollbar" style={{ maxHeight: "calc(100% - 24px)" }}>
            {conversations.length > 0 ? (
              conversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="group/item flex items-center gap-1 rounded-lg"
                >
                  <button
                    onClick={() => handleConversationClick(conv.id)}
                    className="flex-1 text-left text-[13px] truncate px-2.5 py-2 rounded-lg transition-all duration-200 min-w-0"
                    style={{
                      color: currentConversationId === conv.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                      background: currentConversationId === conv.id ? "rgba(255,255,255,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (currentConversationId !== conv.id) {
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)"
                        ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentConversationId !== conv.id) {
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"
                        ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                      }
                    }}
                  >
                    {conv.title ?? "New conversation"}
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover/item:opacity-100 shrink-0 p-1 rounded transition-all duration-150 hover:text-red-400"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-[12px] text-white/20 px-2.5 py-2 font-light italic">No conversations yet</p>
            )}
          </div>
        </div>

        {/* Bottom profile section */}
        <div className="relative" ref={profileMenuRef}>
          <div
            className="h-px mb-4"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          <div
            className="flex items-center gap-3 cursor-pointer group px-1 py-1 rounded-lg hover:bg-white/4 transition-colors duration-200"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            {/* Avatar */}
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={userName}
                className="w-7 h-7 rounded-full object-cover shrink-0"
                style={{ border: "1.5px solid rgba(201,168,76,0.3)" }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.15)", border: "1.5px solid rgba(201,168,76,0.3)" }}
              >
                <User className="w-3.5 h-3.5 text-[#C9A84C]/70" />
              </div>
            )}
            <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors flex-1 truncate">
              {userName || "User"}
            </span>
          </div>

          {/* Profile popup menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 rounded-xl p-1.5 min-w-[160px] shadow-xl"
                style={{
                  background: "rgba(10,10,14,0.95)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    setShowSettings(true)
                  }}
                  className="flex items-center gap-2.5 w-full text-left text-[12px] text-white/50 hover:text-white/80 hover:bg-white/6 px-3 py-2 rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {sidebarContent.settingsLabel}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left text-[12px] text-white/50 hover:text-red-400 hover:bg-red-500/6 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {sidebarContent.logoutLabel}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userAvatarUrl={userAvatarUrl}
      />
    </>
  )
}

