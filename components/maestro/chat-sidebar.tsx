"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, X, Settings, User, Plus, Trash2 } from "lucide-react"
import { GiSoccerBall } from "react-icons/gi"
import { FiEdit } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/maestro/logo"
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
  mobileOpen?: boolean
  onMobileClose?: () => void
  prefsUpdated?: number
}

export function ChatSidebar({ onNewChat, currentConversationId, mobileOpen, onMobileClose, prefsUpdated }: ChatSidebarProps) {
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
      const name = user.user_metadata?.username
        || user.user_metadata?.full_name?.split(" ")[0]
        || user.email?.split("@")[0]
        || "User"
      setUserName(name)
      setUserAvatarUrl(user.user_metadata?.avatar_url ?? "/avatar.png")
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
  function loadFixture() {
    fetch("/api/fixtures", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (data) setFixture(data) })
      .catch(() => {})
  }

  useEffect(() => { loadFixture() }, [])

  // Re-fetch fixture when preferences are updated (onboarding or settings)
  useEffect(() => {
    if (prefsUpdated) loadFixture()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsUpdated])

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
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}
      </AnimatePresence>

      <aside
        className={`flex flex-col w-full md:w-[280px] lg:w-[240px] min-h-screen px-5 py-7 fixed inset-y-0 left-0 lg:relative z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "rgba(5,5,8,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <Logo />
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat button */}
        <button
          onClick={handleNewChat}
          className="w-full h-10 flex items-center justify-center gap-2 font-medium rounded-xl mb-7 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            border: "1px solid rgba(201,168,76,0.4)",
            background: "rgba(201,168,76,0.08)",
            color: "#C9A84C",
            boxShadow: "0 0 12px rgba(201,168,76,0.1)",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.15)"
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(201,168,76,0.25)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.08)"
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(201,168,76,0.1)"
          }}
        >
          <FiEdit className="w-4 h-4 mb-px" strokeWidth={2.5} />
          <span className="tracking-wide text-[13px] font-semibold">New Chat</span>
        </button>

        {/* Featured match */}
        <div
          className="group mb-7 rounded-xl p-4 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.12)]"
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
          <div className="flex items-center gap-3 mb-4 mt-2">
            <span className="text-[10px] uppercase tracking-[3px] text-[#C9A84C]/80 font-medium">
              {sidebarContent.recentLabel}
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-[#C9A84C]/20 to-transparent" />
          </div>
          <div className="space-y-0.5 overflow-y-auto maestro-scrollbar pb-14" style={{ maxHeight: "calc(100% - 24px)" }}>
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
                    className="flex-1 text-left text-[13px] truncate px-2.5 py-2 rounded-lg transition-all duration-200 min-w-0 group-hover/item:translate-x-1"
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
                    <Trash2 className="w-3.5 h-3.5" />
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
            className="h-px mb-4 bg-linear-to-r from-transparent via-[#C9A84C]/30 to-transparent"
          />

          <div className="flex items-center gap-3 px-1 py-1">
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
            <span
              className="text-[13px] text-white/50 flex-1 truncate cursor-pointer hover:text-white/80 transition-colors hidden md:block"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              {userName || "User"}
            </span>
            <span className="text-[13px] text-white/50 flex-1 truncate md:hidden">
              {userName || "User"}
            </span>

            {/* Mobile-only inline icons */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setShowSettings(true)}
                className="text-white/35 hover:text-white/70 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="text-white/35 hover:text-white/70 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile popup menu — desktop only */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 rounded-xl p-1.5 min-w-[160px] shadow-xl hidden md:block"
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
        onClose={() => { setShowSettings(false); loadFixture() }}
        userAvatarUrl={userAvatarUrl}
      />
    </>
  )
}

