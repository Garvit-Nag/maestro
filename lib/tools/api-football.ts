// API-Football tools — uses API-Football if key present, falls back to football-data.org
const AF_BASE = "https://v3.football.api-sports.io"
const FD_BASE = "https://api.football-data.org/v4"
const cache = new Map<string, { data: unknown; expires: number }>()

async function afFetch(path: string, ttl = 600): Promise<unknown> {
  const url = `${AF_BASE}${path}`
  const now = Date.now()
  const cached = cache.get(url)
  if (cached && cached.expires > now) return cached.data

  const res = await fetch(url, {
    headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY! },
  })
  if (!res.ok) throw new Error(`API-Football ${res.status}`)
  const json = await res.json()
  cache.set(url, { data: json.response ?? json, expires: now + ttl * 1000 })
  return json.response ?? json
}

async function fdFetch(path: string, ttl = 600): Promise<unknown> {
  const url = `${FD_BASE}${path}`
  const now = Date.now()
  const cached = cache.get(url)
  if (cached && cached.expires > now) return cached.data

  const res = await fetch(url, {
    headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY! },
  })
  if (!res.ok) throw new Error(`football-data.org ${res.status}`)
  const data = await res.json()
  cache.set(url, { data, expires: now + ttl * 1000 })
  return data
}

const hasAfKey = () => !!process.env.API_FOOTBALL_KEY

// Player stats — requires API-Football key (no reliable free fallback)
export async function get_player_stats(playerId: string, season = "2024") {
  try {
    if (hasAfKey()) {
      return await afFetch(`/players?id=${playerId}&season=${season}`, 600)
    }
    return { error: "Player statistics require API-Football key" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

// Top assists — fallback to top scorers sorted by assists from football-data.org
export async function get_top_assists(leagueId: string, season = "2024") {
  try {
    if (hasAfKey()) {
      return await afFetch(`/players/topassists?league=${leagueId}&season=${season}`, 600)
    }
    // Map API-Football leagueId back to fd competition code
    const codeMap: Record<string, string> = { "39": "PL", "140": "PD", "78": "BL1", "135": "SA", "61": "FL1", "2": "CL" }
    const code = codeMap[leagueId] ?? "PL"
    const data = await fdFetch(`/competitions/${code}/scorers?limit=20`, 600) as { scorers?: unknown[] }
    // Return sorted by assists desc
    const scorers = (data.scorers ?? []) as Array<{ assists?: number }>
    return scorers
      .filter((s) => s.assists)
      .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

// Injuries — no free alternative, return empty (handled gracefully)
export async function get_injuries(teamId: string) {
  try {
    if (hasAfKey()) {
      return await afFetch(`/injuries?team=${teamId}&season=2024`, 300)
    }
    return []  // No injury data available without API-Football key
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

// Home/away form — requires API-Football key (fallback would need correct football-data.org teamId)
export async function get_home_away_form(teamId: string, leagueId: string, season = "2024") {
  try {
    if (hasAfKey()) {
      return await afFetch(`/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`, 3600)
    }
    return { error: "Home/away form requires API-Football key" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}

// Predictions — no reliable free alternative
export async function get_predictions(fixtureId: string) {
  try {
    if (hasAfKey()) {
      return await afFetch(`/predictions?fixture=${fixtureId}`, 3600)
    }
    return { error: "Predictions require API-Football key" }
  } catch (e: unknown) {
    return { error: (e as Error).message }
  }
}
