"use client"

import { useState } from "react"
import { Settings } from "lucide-react"

const recentChats = [
  "Arsenal vs City preview",
  "Premier League standings",
  "Haaland injury update",
]

export function ChatSidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <aside className="hidden lg:flex flex-col w-[240px] min-h-screen bg-[#0A0A0C] border-r border-[#1C1C23] px-6 py-8">
      {/* Logo */}
      <span className="text-[13px] font-light tracking-[0.2em] text-white/90 mb-6">
        maestro
      </span>

      {/* New Chat button */}
      <button className="w-full h-9 flex items-center justify-center text-xs text-[#6B6B7A] border border-[#1C1C23] rounded hover:border-[#C9A84C] hover:text-white transition-colors duration-200 mb-8">
        + New Chat
      </button>

      {/* Featured match */}
      <div className="mb-8">
        <div className="relative pl-4">
          {/* Gold border on vs line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-full bg-[#1C1C23]">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 bg-[#C9A84C]" />
          </div>
          
          <p className="text-[13px] text-white/70 mb-1">Manchester City</p>
          <p className="text-[11px] text-[#4A4A58] mb-1">vs</p>
          <p className="text-[13px] text-white/70 mb-3">Liverpool</p>
          <p className="text-[11px] text-[#3A3A48]">15:00 · Today</p>
        </div>
      </div>

      {/* Recent section */}
      <div className="flex-1">
        <span className="text-[10px] uppercase tracking-[4px] text-[#2A2A38] mb-4 block">
          Recent
        </span>
        <div className="space-y-3">
          {recentChats.map((chat, index) => (
            <button
              key={index}
              className="block w-full text-left text-[13px] text-[#3A3A48] hover:text-[#6B6B7A] transition-colors duration-200 truncate"
            >
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom profile section */}
      <div className="relative">
        {/* Separator */}
        <div className="h-px bg-[#1C1C23] mb-4" />
        
        {/* Profile row */}
        <div 
          className="flex items-center cursor-pointer group"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          {/* Avatar placeholder */}
          <div className="w-6 h-6 rounded-full bg-[#1C1C23] mr-3" />
          
          {/* Name */}
          <span className="text-[13px] text-white flex-1">User</span>
          
          {/* Settings icon */}
          <Settings className="w-3 h-3 text-[#3A3A48]" />
          
          {/* Popover menu */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#111116] rounded p-2 min-w-[120px]">
              <button className="block w-full text-left text-xs text-[#6B6B7A] hover:text-white px-2 py-1.5 transition-colors">
                Settings
              </button>
              <button className="block w-full text-left text-xs text-[#6B6B7A] hover:text-white px-2 py-1.5 transition-colors">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
