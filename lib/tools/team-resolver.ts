// Dynamic team ID resolver — maps team names to football-data.org IDs
// Fetches all teams from the 6 free-tier competitions once, caches for 24h

const COMPETITIONS = ["PL", "PD", "BL1", "SA", "FL1", "CL"]

// Normalize: lowercase + strip diacritics (ü→u, é→e etc.) for fuzzy matching
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
let teamIdCache: Map<string, number> | null = null
let cacheExpiry = 0

export async function resolveFootballDataId(teamName: string): Promise<number | null> {
  const now = Date.now()
  if (!teamIdCache || now > cacheExpiry) {
    teamIdCache = await buildTeamCache()
    cacheExpiry = now + 24 * 60 * 60 * 1000
  }
  const lower = normalize(teamName)
  // 1. Exact match
  if (teamIdCache.has(lower)) return teamIdCache.get(lower)!
  // 2. Partial match — only against names ≥5 chars to avoid TLA false positives
  //    e.g. "Man City" → "Manchester City FC", but "NIC" must not match "Bayern Munich"
  for (const [name, id] of teamIdCache) {
    if (name.length >= 5 && lower.length >= 5 && (name.includes(lower) || lower.includes(name))) return id
  }
  return null
}

async function buildTeamCache(): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  await Promise.all(
    COMPETITIONS.map(async (code) => {
      try {
        const res = await fetch(
          `https://api.football-data.org/v4/competitions/${code}/teams`,
          { headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY! } }
        )
        if (!res.ok) return
        const data = await res.json()
        for (const team of data.teams ?? []) {
          if (team.id) {
            if (team.name) map.set(normalize(team.name), team.id)
            if (team.shortName) map.set(normalize(team.shortName), team.id)
            if (team.tla) map.set(normalize(team.tla), team.id)
          }
        }
      } catch {}
    })
  )
  return map
}
