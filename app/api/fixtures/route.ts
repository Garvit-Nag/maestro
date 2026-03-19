import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json(null, { status: 200 })
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const dateTo = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]

    // Try to read user's favourite team from preferences
    let favouriteTeamId: string | null = null
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("favourite_team_id")
          .eq("user_id", user.id)
          .single()
        favouriteTeamId = prefs?.favourite_team_id ?? null
      }
    } catch {}

    // If user has a favourite team, fetch their next match first
    if (favouriteTeamId) {
      const teamRes = await fetch(
        `https://api.football-data.org/v4/teams/${favouriteTeamId}/matches?status=SCHEDULED&dateFrom=${today}&dateTo=${dateTo}&limit=1`,
        { headers: { "X-Auth-Token": apiKey } }
      )
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        const match = teamData.matches?.[0]
        if (match) return NextResponse.json(formatMatch(match, today), { headers: { "Cache-Control": "public, max-age=300" } })
      }
    }

    // Fallback: next prominent match across top competitions
    const competitions = ["CL", "PL", "PD", "BL1", "SA", "FL1"]
    const res = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${dateTo}&competitions=${competitions.join(",")}`,
      { headers: { "X-Auth-Token": apiKey } }
    )

    if (!res.ok) return NextResponse.json(null)

    const data = await res.json()
    const matches: Match[] = data.matches ?? []
    const live = matches.find((m) => m.status === "IN_PLAY" || m.status === "PAUSED")
    const next = matches.find((m) => m.status === "SCHEDULED" || m.status === "TIMED")
    const match = live ?? next
    if (!match) return NextResponse.json(null)

    return NextResponse.json(formatMatch(match, today), { headers: { "Cache-Control": "public, max-age=300" } })
  } catch {
    return NextResponse.json(null)
  }
}

interface Match {
  id: number
  homeTeam: { name: string; crest: string }
  awayTeam: { name: string; crest: string }
  competition: { name: string; code: string }
  utcDate: string
  status: string
}

function formatMatch(match: Match, today: string) {
  const kickoff = new Date(match.utcDate)
  const timeStr = kickoff.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  const isToday = kickoff.toISOString().split("T")[0] === today
  const dateStr = isToday
    ? "Today"
    : kickoff.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
  return {
    home: match.homeTeam.name,
    homeCrest: match.homeTeam.crest,
    away: match.awayTeam.name,
    awayCrest: match.awayTeam.crest,
    competition: match.competition.name,
    time: timeStr,
    date: dateStr,
    status: match.status,
    matchId: match.id,
  }
}
