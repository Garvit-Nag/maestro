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
    badge: "https://www.thesportsdb.com/images/media/league/badge/i6o0kh1549879062.png",
  },
  {
    id: "4335",
    name: "La Liga",
    country: "Spain",
    badge: "https://www.thesportsdb.com/images/media/league/badge/7onmyv1534768460.png",
  },
  {
    id: "4331",
    name: "Bundesliga",
    country: "Germany",
    badge: "https://www.thesportsdb.com/images/media/league/badge/0j55yv1534764799.png",
  },
  {
    id: "4332",
    name: "Serie A",
    country: "Italy",
    badge: "https://www.thesportsdb.com/images/media/league/badge/cjqj3j1473944978.png",
  },
  {
    id: "4334",
    name: "Ligue 1",
    country: "France",
    badge: "https://www.thesportsdb.com/images/media/league/badge/rutpay1473943721.png",
  },
  {
    id: "4480",
    name: "UEFA Champions League",
    country: "Europe",
    badge: "https://www.thesportsdb.com/images/media/league/badge/qywjqy1534768460.png",
  },
  {
    id: "4337",
    name: "Eredivisie",
    country: "Netherlands",
    badge: "https://www.thesportsdb.com/images/media/league/badge/uyyuxn1534768460.png",
  },
  {
    id: "4344",
    name: "Primeira Liga",
    country: "Portugal",
    badge: "https://www.thesportsdb.com/images/media/league/badge/7p1eld1534768795.png",
  },
]
