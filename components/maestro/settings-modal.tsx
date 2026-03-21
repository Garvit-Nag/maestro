"use client"

import { useState, useEffect } from "react"
import { X, Search, Check, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { LEAGUES } from "@/lib/content/leagues"

interface Team {
  id: number
  name: string
  shortName: string
  crestUrl: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userAvatarUrl: string | null
}

export function SettingsModal({ isOpen, onClose, userAvatarUrl }: SettingsModalProps) {
  /* ─── state ────────────────────────────────────── */
  const [screen, setScreen] = useState<"main" | "team" | "league">("main")
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [teamSearch, setTeamSearch] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [displayName, setDisplayName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  /* ─── load prefs on open ────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    setScreen("main")

    async function loadPrefs() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setDisplayName(user.user_metadata?.username || user.user_metadata?.full_name?.split(" ")[0] || "")

      const { data: prefsRows } = await supabase
        .from("user_preferences")
        .select("favourite_team, favourite_team_id, followed_leagues")
        .eq("user_id", user.id)
        .limit(1)
      const prefs = prefsRows?.[0] ?? null

      if (prefs) {
        if (prefs.favourite_team) {
          setSelectedTeam({
            id: parseInt(prefs.favourite_team_id ?? "0"),
            name: prefs.favourite_team,
            shortName: prefs.favourite_team,
            crestUrl: "",
          })
        } else {
          setSelectedTeam(null)
        }
        setSelectedLeagues(prefs.followed_leagues ?? [])
      }
      setIsLoading(false)
    }
    loadPrefs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* ─── load teams when entering team picker ──────── */
  useEffect(() => {
    if (screen !== "team" || teams.length > 0) return
    setTeamsLoading(true)
    fetch("/api/onboarding/teams")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTeams(data)
        setTeamsLoading(false)
      })
      .catch(() => setTeamsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
    t.shortName.toLowerCase().includes(teamSearch.toLowerCase())
  )



  /* ─── save ──────────────────────────────────────── */
  const handleSave = async () => {
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await Promise.all([
      supabase.from("user_preferences").upsert({
        user_id: user.id,
        favourite_team: selectedTeam?.name ?? null,
        favourite_team_id: selectedTeam?.id?.toString() ?? null,
        followed_leagues: selectedLeagues.length > 0 ? selectedLeagues : null,
      }, { onConflict: 'user_id' }),
      supabase.auth.updateUser({ data: { username: displayName.trim() } }),
    ])

    setIsSaving(false)
    onClose()
  }

  /* ─── league toggle ─────────────────────────────── */
  const toggleLeague = (id: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  /* ─── resolve league names for chips ────────────── */
  const getLeagueName = (id: string) =>
    LEAGUES.find((l) => l.id === id)?.name ?? id

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-md rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(12,12,16,0.98)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Gold top line */}
              <div
                className="h-px shrink-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-0 shrink-0">
                <h2 className="text-[16px] font-semibold text-white">
                  {screen === "main" ? "Settings" : screen === "team" ? "Pick your team" : "Follow Leagues"}
                </h2>
                <button
                  onClick={screen === "main" ? onClose : () => setScreen("main")}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/6 transition-colors"
                >
                  {screen === "main" ? <X className="w-4 h-4" /> : <span className="text-[12px]">←</span>}
                </button>
              </div>

              {isLoading ? (
                <div className="flex-1 p-6 space-y-6">
                  <div>
                    <div className="h-3 w-24 rounded bg-white/[0.05] animate-pulse mb-3" />
                    <div className="h-14 rounded-xl bg-white/[0.05] animate-pulse" />
                  </div>
                  <div>
                    <div className="h-3 w-32 rounded bg-white/[0.05] animate-pulse mb-3" />
                    <div className="h-11 rounded-xl bg-white/[0.05] animate-pulse" />
                  </div>
                  <div>
                    <div className="h-3 w-36 rounded bg-white/[0.05] animate-pulse mb-3" />
                    <div className="h-11 rounded-xl bg-white/[0.05] animate-pulse" />
                  </div>
                </div>
              ) : screen === "main" ? (
                /* ═════════════ MAIN SETTINGS SCREEN ═════════════ */
                <div className="flex-1 overflow-y-auto p-6 space-y-6 maestro-scrollbar">
                  {/* Profile Image */}
                  <div>
                    <label className="text-[11px] uppercase tracking-[2px] text-white/30 block mb-3">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div>
                        {userAvatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={userAvatarUrl}
                            alt="Avatar"
                            className="w-14 h-14 rounded-full object-cover"
                            style={{ border: "2px solid rgba(201,168,76,0.3)" }}
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background: "rgba(201,168,76,0.12)",
                              border: "2px solid rgba(201,168,76,0.3)",
                            }}
                          >
                            <User className="w-6 h-6 text-[#C9A84C]/60" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[12px] text-white/50 mb-0.5">
                          Profile Photo
                        </span>
                        <span className="text-[10px] text-white/30 max-w-[180px]">
                          Your photo syncs automatically when signing in via Google.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="text-[11px] uppercase tracking-[2px] text-white/30 block mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value.slice(0, 10))}
                      maxLength={10}
                      placeholder="Your name..."
                      className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/25 focus:outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                    <p className="text-[10px] text-white/20 mt-1.5">Max 10 characters. Shown in your profile.</p>
                  </div>

                  {/* Favourite Team — click to open team picker */}
                  <div>
                    <label className="text-[11px] uppercase tracking-[2px] text-white/30 block mb-2">
                      Favourite Team
                    </label>
                    <button
                      onClick={() => setScreen("team")}
                      className="w-full flex items-center gap-3 px-3 h-11 rounded-xl text-left transition-colors"
                      style={{
                        border: "1px solid rgba(255,255,255,0.09)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {selectedTeam ? (
                        <>
                          {selectedTeam.crestUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedTeam.crestUrl} alt="" className="w-5 h-5 object-contain" />
                          )}
                          <span className="text-[13px] text-white/80 flex-1 truncate">{selectedTeam.name}</span>
                        </>
                      ) : (
                        <span className="text-[13px] text-white/20 flex-1">Choose a team...</span>
                      )}
                      <span className="text-[11px] text-white/20">→</span>
                    </button>
                  </div>

                  {/* Followed Leagues — click to open league picker */}
                  <div>
                    <label className="text-[11px] uppercase tracking-[2px] text-white/30 block mb-2">
                      Followed Leagues
                    </label>
                    <button
                      onClick={() => setScreen("league")}
                      className="w-full flex items-center gap-2 px-3 min-h-[44px] py-2 rounded-xl text-left transition-colors flex-wrap"
                      style={{
                        border: "1px solid rgba(255,255,255,0.09)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {selectedLeagues.length > 0 ? (
                        selectedLeagues.map((id) => (
                          <span
                            key={id}
                            className="text-[11px] text-[#C9A84C]/80 px-2 py-0.5 rounded-md"
                            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                          >
                            {getLeagueName(id)}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-white/20 flex-1">Choose leagues...</span>
                      )}
                      <span className="text-[11px] text-white/20 ml-auto shrink-0">→</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="flex-1 h-10 rounded-xl text-[13px] text-white/40 hover:text-white/60 transition-colors"
                      style={{
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 h-10 rounded-xl text-[13px] font-medium transition-all duration-200"
                      style={{
                        background: isSaving ? "rgba(201,168,76,0.3)" : "#C9A84C",
                        color: "#050508",
                        boxShadow: "0 0 16px rgba(201,168,76,0.25)",
                      }}
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              ) : screen === "team" ? (
                /* ═════════════ TEAM PICKER SCREEN ═════════════ */
                <div className="flex-1 overflow-hidden flex flex-col p-6 pt-4 min-h-0">
                  {/* Search bar */}
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-4 shrink-0"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/25 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]/30 rounded"
                    />
                  </div>

                  {/* Team grid */}
                  <div className="flex-1 overflow-y-auto maestro-scrollbar">
                    {teamsLoading ? (
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
                              onClick={() => {
                                setSelectedTeam(isSelected ? null : team)
                                setScreen("main")
                              }}
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
                </div>
              ) : (
                /* ═════════════ LEAGUE PICKER SCREEN ═════════════ */
                <div className="flex-1 overflow-y-auto p-6 pt-4 maestro-scrollbar">
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
                          <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/90 rounded-full p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={league.badge}
                              alt={league.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.visibility = "hidden"
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-white/80 font-medium truncate">{league.name}</p>
                            <p className="text-[10px] text-white/30">{league.country}</p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setScreen("main")}
                    className="w-full py-3 rounded-xl text-[13px] font-medium mt-4 transition-all duration-200"
                    style={{
                      background: "#C9A84C",
                      color: "#050508",
                      boxShadow: "0 0 16px rgba(201,168,76,0.25)",
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
