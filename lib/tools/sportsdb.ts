// TheSportsDB — free tier, no key required for v1
import { resolveFootballDataId } from "./team-resolver"

const BASE = "https://www.thesportsdb.com/api/v1/json/3"
const cache = new Map<string, { data: unknown; expires: number }>()

async function apiFetch(path: string, ttl = 300): Promise<unknown> {
  const url = `${BASE}${path}`
  const now = Date.now()
  const cached = cache.get(url)
  if (cached && cached.expires > now) return cached.data

  const res = await fetch(url)
  if (!res.ok) throw new Error(`TheSportsDB ${res.status}`)

  const data = await res.json()
  cache.set(url, { data, expires: now + ttl * 1000 })
  return data
}

export async function get_team_profile(teamName: string) {
  try {
    const data = await apiFetch(`/searchteams.php?t=${encodeURIComponent(teamName)}`) as { teams: Array<Record<string, unknown>> | null }
    const team = data.teams?.[0]
    if (!team) return { error: "Team not found" }
    const fdId = await resolveFootballDataId((team.strTeam as string) ?? teamName)
    return { ...team, footballDataId: fdId ?? undefined }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_player_profile(playerName: string) {
  try {
    const data = await apiFetch(`/searchplayers.php?p=${encodeURIComponent(playerName)}`) as { player: unknown[] | null }
    return data.player?.[0] ?? { error: "Player not found" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_manager_profile(managerName: string) {
  try {
    // TheSportsDB doesn't have a manager search endpoint — search as player (managers are sometimes listed)
    const data = await apiFetch(`/searchplayers.php?p=${encodeURIComponent(managerName)}`) as { player: unknown[] | null }
    return data.player?.[0] ?? { error: "Manager not found" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_stadium_info(stadiumName: string) {
  try {
    // Search for team by stadium — TheSportsDB returns stadium info on team lookup
    const data = await apiFetch(`/searchteams.php?t=${encodeURIComponent(stadiumName)}`) as { teams: unknown[] | null }
    if (data.teams?.[0]) return data.teams[0]
    return { error: "Stadium info not found" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_team_next_events(teamId: string) {
  try {
    const data = await apiFetch(`/eventsnext.php?id=${encodeURIComponent(teamId)}`, 300) as { events: unknown[] | null }
    return data.events ?? []
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_team_honours(teamName: string) {
  try {
    // First get team id, then honours
    const teamData = await apiFetch(`/searchteams.php?t=${encodeURIComponent(teamName)}`) as { teams: Array<{ idTeam: string }> | null }
    const teamId = teamData.teams?.[0]?.idTeam
    if (!teamId) return { error: "Team not found" }

    const honourData = await apiFetch(`/lookuphonours.php?id=${teamId}`, 3600) as { honours: unknown[] | null }
    return honourData.honours ?? []
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}
