// football-data.org API tools — free tier: 10 req/min
const BASE = "https://api.football-data.org/v4"
const cache = new Map<string, { data: unknown; expires: number }>()

async function apiFetch(path: string, ttl = 60): Promise<unknown> {
  const url = `${BASE}${path}`
  const now = Date.now()
  const cached = cache.get(url)
  if (cached && cached.expires > now) return cached.data

  const res = await fetch(url, {
    headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY! },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`football-data.org ${res.status}: ${text.slice(0, 100)}`)
  }

  const data = await res.json()
  cache.set(url, { data, expires: now + ttl * 1000 })
  return data
}

export async function get_standings(competitionCode: string) {
  try {
    const data = await apiFetch(`/competitions/${competitionCode}/standings`, 120) as { standings: unknown[] }
    return data.standings
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_fixtures(params: {
  teamId?: string
  competitionId?: string
  dateFrom?: string
  dateTo?: string
  status?: string
}) {
  try {
    const qs = new URLSearchParams()
    if (params.competitionId) qs.set("competitions", params.competitionId)
    if (params.dateFrom) qs.set("dateFrom", params.dateFrom)
    if (params.dateTo) qs.set("dateTo", params.dateTo)
    if (params.status) qs.set("status", params.status)

    const base = params.teamId
      ? `/teams/${params.teamId}/matches`
      : "/matches"
    const path = `${base}?${qs.toString()}`
    const data = await apiFetch(path, 30) as { matches: unknown[] }
    return data.matches
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_match_result(matchId: string) {
  try {
    return await apiFetch(`/matches/${matchId}`, 300)
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_squad(teamId: string) {
  try {
    const data = await apiFetch(`/teams/${teamId}`, 3600) as { squad: unknown[] }
    return data.squad
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_top_scorers(competitionCode: string) {
  try {
    const data = await apiFetch(`/competitions/${competitionCode}/scorers?limit=15`, 120) as { scorers: unknown[] }
    return data.scorers
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_head_to_head(matchId: string) {
  try {
    const data = await apiFetch(`/matches/${matchId}/head2head?limit=10`, 3600) as { matches: unknown[] }
    return data.matches
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

export async function get_league_teams(competitionCode: string) {
  try {
    const data = await apiFetch(`/competitions/${competitionCode}/teams`, 3600) as { teams: unknown[] }
    return data.teams
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}
