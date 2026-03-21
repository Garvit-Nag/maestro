"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { sidebarContent } from "@/lib/content/chat"
import { SettingsModal } from "@/components/maestro/settings-modal"

interface UserProfileButtonProps {
  userName: string
  userAvatarUrl: string | null
  onLogout?: () => void
  position?: "up" | "down"
}

export function UserProfileButton({ userName, userAvatarUrl, onLogout, position = "up" }: UserProfileButtonProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => setMounted(true), [])

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <div className="relative" ref={profileMenuRef}>
        <div
          className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-lg hover:scale-[1.02] transition-all duration-200"
          onClick={() => setShowProfileMenu((prev) => !prev)}
        >
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
          <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors flex-1 truncate font-medium">
            {userName || "User"}
          </span>
        </div>

        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: position === "up" ? 6 : -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: position === "up" ? 6 : -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-[100] rounded-xl p-1.5 min-w-[160px] shadow-2xl ${
                position === "up" ? "bottom-full mb-3 left-0" : "top-full mt-3 right-0"
              }`}
              style={{
                background: "linear-gradient(180deg, rgba(20,20,25,0.98) 0%, rgba(10,10,14,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "1.5px solid rgba(201,168,76,0.5)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.08)",
                backdropFilter: "blur(24px)",
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
                className="flex items-center gap-2.5 w-full text-left text-[12px] text-white/50 hover:text-red-400 hover:bg-red-500/6 px-3 py-2 rounded-lg transition-colors mt-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                {sidebarContent.logoutLabel}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mounted && createPortal(
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userAvatarUrl={userAvatarUrl}
        />,
        document.body
      )}
    </>
  )
}
