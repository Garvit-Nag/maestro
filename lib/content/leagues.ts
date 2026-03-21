/** League definitions used by onboarding and settings */
export interface LeagueOption {
  id: string
  name: string
  country: string
  badge: string
}

export const LEAGUES: readonly LeagueOption[] = [
  {
    id: "4328",
    name: "Premier League",
    country: "England",
    badge: "https://crests.football-data.org/PL.png",
  },
  {
    id: "4335",
    name: "La Liga",
    country: "Spain",
    badge: "https://crests.football-data.org/PD.png",
  },
  {
    id: "4331",
    name: "Bundesliga",
    country: "Germany",
    badge: "https://crests.football-data.org/BL1.png",
  },
  {
    id: "4332",
    name: "Serie A",
    country: "Italy",
    badge: "https://crests.football-data.org/SA.png",
  },
  {
    id: "4334",
    name: "Ligue 1",
    country: "France",
    badge: "https://crests.football-data.org/FL1.png",
  },
  {
    id: "4480",
    name: "UEFA Champions League",
    country: "Europe",
    badge: "https://crests.football-data.org/CL.png",
  },
  {
    id: "4337",
    name: "Eredivisie",
    country: "Netherlands",
    badge: "https://crests.football-data.org/ED.png",
  },
  {
    id: "4344",
    name: "Primeira Liga",
    country: "Portugal",
    badge: "https://crests.football-data.org/PPL.png",
  },
]
