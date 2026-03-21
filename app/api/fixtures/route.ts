import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { LEAGUES } from "@/lib/content/leagues"

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json(null, { status: 200 })
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const dateTo = new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0]

    // Try to read user's favourite team and followed leagues from preferences
    let favouriteTeamId: string | null = null
    let followedLeagues: string[] = []
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prefsRows } = await supabase
          .from("user_preferences")
          .select("favourite_team_id, followed_leagues")
          .eq("user_id", user.id)
          .limit(1)
        favouriteTeamId = prefsRows?.[0]?.favourite_team_id ?? null
        followedLeagues = prefsRows?.[0]?.followed_leagues ?? []
      }
    } catch {}

    // Tier 1: If user has a favourite team, fetch their next match first
    if (favouriteTeamId) {
      const teamRes = await fetch(
        `https://api.football-data.org/v4/teams/${favouriteTeamId}/matches?status=SCHEDULED&dateFrom=${today}&dateTo=${dateTo}&limit=1`,
        { headers: { "X-Auth-Token": apiKey } }
      )
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        const match = teamData.matches?.[0]
        if (match) return NextResponse.json(formatMatch(match, today), { headers: { "Cache-Control": "private, max-age=60" } })
      }
    }

    // Tier 2: Pick a random followed league and fetch an upcoming match from it
    if (followedLeagues.length > 0) {
      const randomLeagueId = pickRandom(followedLeagues)
      const leagueEntry = LEAGUES.find((l) => l.id === randomLeagueId)
      if (leagueEntry) {
        const leagueRes = await fetch(
          `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${dateTo}&competitions=${leagueEntry.code}`,
          { headers: { "X-Auth-Token": apiKey } }
        )
        if (leagueRes.ok) {
          const leagueData = await leagueRes.json()
          const scheduledMatches: Match[] = (leagueData.matches ?? []).filter(
            (m: Match) => m.status === "SCHEDULED" || m.status === "TIMED"
          )
          if (scheduledMatches.length > 0) {
            const match = pickRandom(scheduledMatches)
            return NextResponse.json(formatMatch(match, today), { headers: { "Cache-Control": "private, max-age=60" } })
          }
        }
      }
    }

    // Tier 3: Fallback — random match from top competitions
    const competitions = ["CL", "PL", "PD", "BL1", "SA", "FL1"]
    const res = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${dateTo}&competitions=${competitions.join(",")}`,
      { headers: { "X-Auth-Token": apiKey } }
    )

    if (!res.ok) return NextResponse.json(null)

    const data = await res.json()
    const matches: Match[] = data.matches ?? []
    const live = matches.filter((m) => m.status === "IN_PLAY" || m.status === "PAUSED")
    const scheduled = matches.filter((m) => m.status === "SCHEDULED" || m.status === "TIMED")
    const pool = live.length > 0 ? live : scheduled
    if (pool.length === 0) return NextResponse.json(null)

    return NextResponse.json(formatMatch(pickRandom(pool), today), { headers: { "Cache-Control": "private, max-age=60" } })
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
