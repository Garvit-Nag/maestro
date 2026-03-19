export const LEAGUE_MAP: Record<string, { fdCode: string; afId: string; name: string }> = {
  PL: { fdCode: "PL", afId: "39", name: "Premier League" },
  PD: { fdCode: "PD", afId: "140", name: "La Liga" },
  BL1: { fdCode: "BL1", afId: "78", name: "Bundesliga" },
  SA: { fdCode: "SA", afId: "135", name: "Serie A" },
  FL1: { fdCode: "FL1", afId: "61", name: "Ligue 1" },
  CL: { fdCode: "CL", afId: "2", name: "Champions League" },
  DED: { fdCode: "DED", afId: "88", name: "Eredivisie" },
  PPL: { fdCode: "PPL", afId: "94", name: "Primeira Liga" },
}

export function getLeagueByName(name: string) {
  const lower = name.toLowerCase()
  return Object.values(LEAGUE_MAP).find(
    (l) => l.name.toLowerCase().includes(lower) || lower.includes(l.name.toLowerCase().split(" ")[0])
  )
}
