import { CardSkeleton } from "./card-shell"
import { StandingsTable } from "./StandingsTable"
import { PlayerCard } from "./PlayerCard"
import { SideBySidePlayerCard } from "./SideBySidePlayerCard"
import { ManagerCard } from "./ManagerCard"
import { StadiumCard } from "./StadiumCard"
import { TeamCard } from "./TeamCard"
import { FixtureList } from "./FixtureList"
import { MatchResultCard } from "./MatchResultCard"
import { ScorerLeaderboard } from "./ScorerLeaderboard"
import { AssistLeaderboard } from "./AssistLeaderboard"
import { H2HTimeline } from "./H2HTimeline"
import { InjuryGrid } from "./InjuryGrid"
import { SquadGrid } from "./SquadGrid"
import { FormSplitCard } from "./FormSplitCard"
import { PredictionCard } from "./PredictionCard"
import { HonoursCard } from "./HonoursCard"
import { ClubGrid } from "./ClubGrid"
import { NewsCard } from "./NewsCard"
import { WeekendFixtureBoard } from "./WeekendFixtureBoard"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, React.ComponentType<{ data: any }>> = {
  standings_table: StandingsTable,
  player_card: PlayerCard,
  side_by_side_player: SideBySidePlayerCard,
  manager_card: ManagerCard,
  stadium_card: StadiumCard,
  team_card: TeamCard,
  fixture_list: FixtureList,
  match_result: MatchResultCard,
  scorer_leaderboard: ScorerLeaderboard,
  assist_leaderboard: AssistLeaderboard,
  h2h_timeline: H2HTimeline,
  injury_grid: InjuryGrid,
  squad_grid: SquadGrid,
  form_split: FormSplitCard,
  prediction_card: PredictionCard,
  honours_card: HonoursCard,
  club_grid: ClubGrid,
  news_card: NewsCard,
  weekend_fixture_board: WeekendFixtureBoard,
}

interface ComponentRendererProps {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  isLoading?: boolean
}

export function ComponentRenderer({ type, data, isLoading }: ComponentRendererProps) {
  if (isLoading) {
    return <CardSkeleton rows={4} />
  }

  const Component = COMPONENT_MAP[type]
  if (!Component) {
    // Unknown component type — render nothing silently
    return null
  }

  // Unwrap { result: ... } wrapper added by tool executor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unwrapped = (data && typeof data === "object" && !Array.isArray(data) && "result" in (data as any))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (data as any).result
    : data

  return <Component data={unwrapped} />
}
