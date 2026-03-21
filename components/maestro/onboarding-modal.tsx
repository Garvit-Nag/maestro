"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { Check, Search } from "lucide-react"
import { LEAGUES } from "@/lib/content/leagues"

interface Team {
  id: number
  name: string
  shortName: string
  crestUrl: string
}

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [screen, setScreen] = useState(1)
  const [teams, setTeams] = useState<Team[]>([])
  const [search, setSearch] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/onboarding/teams")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTeams(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.shortName.toLowerCase().includes(search.toLowerCase())
  )

  const toggleLeague = (id: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const handleComplete = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("user_preferences").upsert({
      user_id: user.id,
      favourite_team: selectedTeam?.name ?? null,
      favourite_team_id: selectedTeam?.id?.toString() ?? null,
      followed_leagues: selectedLeagues,
      has_completed_onboarding: true,
    })

    setSaving(false)
    onComplete()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "rgba(10,10,14,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Gold top accent */}
        <div
          className="h-px shrink-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)",
          }}
        />

        {/* Header */}
        <div className="px-7 pt-6 pb-5 shrink-0">
          <div className="flex items-center gap-2 mb-5">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300"
                  style={{
                    background: screen === s ? "#C9A84C" : screen > s ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)",
                    color: screen === s ? "#050508" : screen > s ? "#C9A84C" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {screen > s ? <Check className="w-3 h-3" /> : s}
                </div>
                {s < 2 && <div className="w-8 h-px" style={{ background: screen > s ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)" }} />}
              </div>
            ))}
          </div>

          <h2 className="text-[20px] font-bold text-white mb-1">
            {screen === 1 ? "Pick your favourite team" : "Follow your leagues"}
          </h2>
          <p className="text-[13px] text-white/40 font-light">
            {screen === 1
              ? "We'll personalise your experience around them."
              : "Choose the competitions you care about most."}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-7 pb-7 min-h-0">
          <AnimatePresence mode="wait">
            {screen === 1 ? (
              <motion.div
                key="screen1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 min-h-0"
              >
                {/* Search */}
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-4 shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]/30 rounded"
                  />
                </div>

                {/* Teams grid */}
                <div className="flex-1 overflow-y-auto maestro-scrollbar">
                  {loading ? (
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl animate-pulse"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {filteredTeams.slice(0, 80).map((team) => {
                        const isSelected = selectedTeam?.id === team.id
                        return (
                          <button
                            key={team.id}
                            onClick={() => setSelectedTeam(isSelected ? null : team)}
                            className="relative flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all duration-200"
                            style={{
                              background: isSelected ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
                              border: isSelected ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            {isSelected && (
                              <div
                                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: "#C9A84C" }}
                              >
                                <Check className="w-2.5 h-2.5 text-[#050508]" />
                              </div>
                            )}
                            {team.crestUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={team.crestUrl}
                                alt={team.shortName}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none"
                                }}
                              />
                            ) : (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white/50"
                                style={{ background: "rgba(255,255,255,0.08)" }}
                              >
                                {team.shortName.slice(0, 2)}
                              </div>
                            )}
                            <span className="text-[9px] text-white/50 text-center leading-tight truncate w-full">
                              {team.shortName}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setScreen(2)}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold mt-4 shrink-0 transition-all duration-200"
                  style={{
                    background: selectedTeam ? "#C9A84C" : "rgba(255,255,255,0.07)",
                    color: selectedTeam ? "#050508" : "rgba(255,255,255,0.3)",
                    boxShadow: selectedTeam ? "0 0 20px rgba(201,168,76,0.25)" : "none",
                  }}
                >
                  {selectedTeam ? `Continue with ${selectedTeam.shortName} →` : "Skip →"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="screen2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1 min-h-0"
              >
                <div className="flex-1 overflow-y-auto maestro-scrollbar">
                  <div className="grid grid-cols-2 gap-2.5">
                    {LEAGUES.map((league) => {
                      const isSelected = selectedLeagues.includes(league.id)
                      return (
                        <button
                          key={league.id}
                          onClick={() => toggleLeague(league.id)}
                          className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 text-left"
                          style={{
                            background: isSelected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                            border: isSelected ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={league.badge}
                            alt={league.name}
                            className="w-8 h-8 object-contain shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.visibility = "hidden"
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-white/80 font-medium truncate">{league.name}</p>
                            <p className="text-[10px] text-white/30">{league.country}</p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-3 mt-4 shrink-0">
                  <button
                    onClick={() => setScreen(1)}
                    className="px-5 py-3 rounded-xl text-[13px] text-white/40 hover:text-white/70 transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200"
                    style={{
                      background: "#C9A84C",
                      color: "#050508",
                      boxShadow: "0 0 20px rgba(201,168,76,0.25)",
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "Enter Maestro →"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
