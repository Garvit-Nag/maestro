import {
  GoogleGenerativeAI,
  type FunctionDeclaration,
  SchemaType,
} from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const MODEL_NAME = "gemini-2.5-flash";

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "get_standings",
    description: "Get league standings/table for a competition",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        competitionCode: {
          type: SchemaType.STRING,
          description:
            "Competition code: PL (Premier League), PD (La Liga), BL1 (Bundesliga), SA (Serie A), FL1 (Ligue 1), CL (Champions League)",
        },
      },
      required: ["competitionCode"],
    },
  },
  {
    name: "get_fixtures",
    description:
      "Get upcoming or past fixtures/matches for a team or competition",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamId: {
          type: SchemaType.STRING,
          description: "Team ID from football-data.org",
        },
        competitionId: {
          type: SchemaType.STRING,
          description: "Competition code e.g. PL",
        },
        dateFrom: {
          type: SchemaType.STRING,
          description: "Start date YYYY-MM-DD",
        },
        dateTo: { type: SchemaType.STRING, description: "End date YYYY-MM-DD" },
        status: {
          type: SchemaType.STRING,
          description: "SCHEDULED, FINISHED, LIVE",
        },
      },
      required: [],
    },
  },
  {
    name: "get_match_result",
    description: "Get result and stats for a specific match",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        matchId: {
          type: SchemaType.STRING,
          description: "Match ID from football-data.org",
        },
      },
      required: ["matchId"],
    },
  },
  {
    name: "get_squad",
    description: "Get full squad list for a team",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamId: {
          type: SchemaType.STRING,
          description: "Team ID from football-data.org",
        },
      },
      required: ["teamId"],
    },
  },
  {
    name: "get_top_scorers",
    description: "Get top scorers/golden boot leaderboard for a competition",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        competitionCode: {
          type: SchemaType.STRING,
          description: "Competition code: PL, PD, BL1, SA, FL1, CL",
        },
      },
      required: ["competitionCode"],
    },
  },
  {
    name: "get_head_to_head",
    description: "Get head-to-head history between two teams via a match ID",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        matchId: {
          type: SchemaType.STRING,
          description: "Match ID to get H2H for",
        },
      },
      required: ["matchId"],
    },
  },
  {
    name: "get_league_teams",
    description: "Get all teams/clubs in a competition",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        competitionCode: {
          type: SchemaType.STRING,
          description: "Competition code: PL, PD, BL1, SA, FL1, CL",
        },
      },
      required: ["competitionCode"],
    },
  },
  {
    name: "get_player_stats",
    description: "Get detailed player statistics for a season",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        playerId: {
          type: SchemaType.STRING,
          description: "Player ID from API-Football",
        },
        season: {
          type: SchemaType.STRING,
          description: "Season year e.g. 2024",
        },
      },
      required: ["playerId"],
    },
  },
  {
    name: "get_top_assists",
    description: "Get top assists leaderboard for a league",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        leagueId: {
          type: SchemaType.STRING,
          description:
            "League ID: 39 (PL), 140 (La Liga), 78 (Bundesliga), 135 (Serie A), 61 (Ligue 1)",
        },
        season: {
          type: SchemaType.STRING,
          description: "Season year e.g. 2024",
        },
      },
      required: ["leagueId"],
    },
  },
  {
    name: "get_injuries",
    description: "Get injury and suspension report for a team",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamId: {
          type: SchemaType.STRING,
          description: "Team ID from API-Football",
        },
      },
      required: ["teamId"],
    },
  },
  {
    name: "get_home_away_form",
    description: "Get home vs away form and statistics for a team",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamId: {
          type: SchemaType.STRING,
          description: "Team ID from API-Football",
        },
        leagueId: {
          type: SchemaType.STRING,
          description: "League ID from API-Football",
        },
        season: {
          type: SchemaType.STRING,
          description: "Season year e.g. 2024",
        },
      },
      required: ["teamId", "leagueId"],
    },
  },
  {
    name: "get_predictions",
    description:
      "Get win probability and match prediction for an upcoming fixture",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        fixtureId: {
          type: SchemaType.STRING,
          description: "Fixture ID from API-Football",
        },
      },
      required: ["fixtureId"],
    },
  },
  {
    name: "get_team_next_events",
    description:
      "Get the next upcoming fixtures/matches for a team using TheSportsDB team ID (idTeam from get_team_profile)",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamId: {
          type: SchemaType.STRING,
          description:
            "TheSportsDB team ID (idTeam field from get_team_profile result)",
        },
      },
      required: ["teamId"],
    },
  },
  {
    name: "get_team_profile",
    description:
      "Get team profile including crest, stadium, founding year, description from TheSportsDB",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamName: {
          type: SchemaType.STRING,
          description: "Team name e.g. Arsenal, Barcelona",
        },
      },
      required: ["teamName"],
    },
  },
  {
    name: "get_player_profile",
    description:
      "Get player profile including photo, nationality, position, bio from TheSportsDB",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        playerName: {
          type: SchemaType.STRING,
          description: "Player name e.g. Mohamed Salah",
        },
      },
      required: ["playerName"],
    },
  },
  {
    name: "get_manager_profile",
    description:
      "Get manager/coach profile including photo, nationality, career from TheSportsDB",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        managerName: {
          type: SchemaType.STRING,
          description: "Manager name e.g. Pep Guardiola",
        },
      },
      required: ["managerName"],
    },
  },
  {
    name: "get_stadium_info",
    description: "Get stadium information including image, capacity, location",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        stadiumName: {
          type: SchemaType.STRING,
          description: "Stadium or team name e.g. Anfield, Liverpool",
        },
      },
      required: ["stadiumName"],
    },
  },
  {
    name: "get_team_honours",
    description: "Get list of trophies and honours won by a team",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        teamName: {
          type: SchemaType.STRING,
          description: "Team name e.g. Liverpool, Real Madrid",
        },
      },
      required: ["teamName"],
    },
  },
  {
    name: "get_news",
    description:
      "Get latest football news articles about a topic, team, or player",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: "Search query e.g. Arsenal transfer, Haaland injury",
        },
        pageSize: {
          type: SchemaType.NUMBER,
          description: "Number of articles to return, default 5",
        },
      },
      required: ["query"],
    },
  },
];
