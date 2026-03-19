"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { recentChats, featuredMatch, sidebarContent } from "@/lib/content/chat"

export function ChatSidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
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
        className="w-full h-9 flex items-center justify-center text-[12px] text-white/40 rounded-xl mb-7 transition-all duration-200 hover:text-white/70"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(201,168,76,0.35)"
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 16px rgba(201,168,76,0.06)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(255,255,255,0.07)"
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
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
          }}
        />
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] block" />
          <span className="text-[9px] uppercase tracking-[3px] text-white/30">
            Featured
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-[13px] text-white/80 font-medium">{featuredMatch.home}</p>
          <p className="text-[10px] text-white/20 pl-0.5">vs</p>
          <p className="text-[13px] text-white/80 font-medium">{featuredMatch.away}</p>
        </div>
        <p className="text-[11px] text-[#C9A84C]/50 mt-3">
          {featuredMatch.time} · {featuredMatch.date}
        </p>
      </div>

      {/* Recent section */}
      <div className="flex-1 min-h-0">
        <span className="text-[9px] uppercase tracking-[3px] text-white/20 mb-3 block">
          {sidebarContent.recentLabel}
        </span>
        <div className="space-y-0.5">
          {recentChats.map((chat, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="block w-full text-left text-[13px] text-white/35 hover:text-white/75 transition-all duration-200 truncate px-2.5 py-2 rounded-lg hover:bg-white/[0.04]"
            >
              {chat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom profile section */}
      <div className="relative">
        <div
          className="h-px mb-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        <div
          className="flex items-center gap-3 cursor-pointer group px-1 py-1 rounded-lg hover:bg-white/[0.04] transition-colors duration-200"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <div
            className="w-6 h-6 rounded-full shrink-0"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          <span className="text-[13px] text-white/50 group-hover:text-white/80 transition-colors flex-1">
            {sidebarContent.userPlaceholder}
          </span>
          <Settings className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 rounded-xl p-1.5 min-w-[140px] shadow-xl"
                style={{
                  background: "rgba(10,10,14,0.95)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <button className="block w-full text-left text-[12px] text-white/50 hover:text-white hover:bg-white/[0.06] px-3 py-2 rounded-lg transition-colors">
                  {sidebarContent.settingsLabel}
                </button>
                <button className="block w-full text-left text-[12px] text-white/50 hover:text-white hover:bg-white/[0.06] px-3 py-2 rounded-lg transition-colors">
                  {sidebarContent.logoutLabel}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  )
}
