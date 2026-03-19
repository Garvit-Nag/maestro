import { NextResponse } from "next/server"

// Fetch teams from multiple major leagues for onboarding team picker
const LEAGUES = ["PL", "PD", "BL1", "SA", "FL1", "CL"]

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const results = await Promise.allSettled(
      LEAGUES.map((league) =>
        fetch(`https://api.football-data.org/v4/competitions/${league}/teams`, {
          headers: { "X-Auth-Token": apiKey },
          next: { revalidate: 86400 },
        }).then((r) => r.json())
      )
    )

    const allTeams: { id: number; name: string; shortName: string; crestUrl: string; competition: string }[] = []
    const seen = new Set<number>()

    for (const result of results) {
      if (result.status === "fulfilled" && result.value?.teams) {
        for (const team of result.value.teams) {
          if (!seen.has(team.id)) {
            seen.add(team.id)
            allTeams.push({
              id: team.id,
              name: team.name,
              shortName: team.shortName || team.name,
              crestUrl: team.crest || "",
            } as typeof allTeams[number])
          }
        }
      }
    }

    allTeams.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(allTeams, {
      headers: { "Cache-Control": "public, max-age=86400" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}
