import { CardShell, CardSkeleton, FormPill } from "./card-shell"

interface TeamStanding {
  position: number
  team: { name: string; shortName?: string; crest?: string; id?: number }
  playedGames: number
  won: number
  draw: number
  lost: number
  goalDifference: number
  points: number
  form?: string
}

interface StandingsData {
  standings?: Array<{ type: string; table: TeamStanding[] }>
  type?: string
  table?: TeamStanding[]
}

export function StandingsTable({ data }: { data: StandingsData | TeamStanding[] | unknown }) {
  let table: TeamStanding[] = []

  if (Array.isArray(data)) {
    // Direct array of standings items
    const first = (data as Array<{ type?: string; table?: TeamStanding[] }>)[0]
    if (first?.table) {
      table = first.table
    } else {
      table = data as TeamStanding[]
    }
  } else {
    const d = data as StandingsData
    const total = d.standings?.find((s) => s.type === "TOTAL") ?? d.standings?.[0]
    table = total?.table ?? d.table ?? []
  }

  if (!table.length) return <div className="text-white/30 text-[13px]">No standings data available.</div>

  const topTeams = table.slice(0, 20)

  return (
    <CardShell label="League Standings">
      {/* Header */}
      <div className="flex items-center text-[9px] uppercase tracking-wider text-white/25 px-2 pb-2 border-b border-white/[0.05]">
        <span className="w-6">#</span>
        <span className="flex-1">Club</span>
        <span className="w-7 text-center">P</span>
        <span className="w-7 text-center hidden sm:block">W</span>
        <span className="w-7 text-center hidden sm:block">D</span>
        <span className="w-7 text-center hidden sm:block">L</span>
        <span className="w-9 text-center">GD</span>
        <span className="w-9 text-right font-bold">Pts</span>
      </div>

      <div className="space-y-0">
        {topTeams.map((team, idx) => {
          // CL zone: top 4, Europa: 5, Relegation: bottom 3
          const isCL = idx < 4
          const isEuropa = idx === 4
          const isRelegation = idx >= topTeams.length - 3
          const leftBorder = isCL
            ? "border-l-2 border-l-blue-500/50"
            : isEuropa
            ? "border-l-2 border-l-amber-500/50"
            : isRelegation
            ? "border-l-2 border-l-red-500/50"
            : ""

          const form = team.form?.split(",").slice(-5) ?? []

          return (
            <div
              key={team.team.id ?? idx}
              className={`flex items-center text-[12px] py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-default ${leftBorder}`}
            >
              <span className="w-6 text-white/30 text-[11px]">{team.position}</span>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                {team.team.crest ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team.team.crest} alt="" className="w-4 h-4 object-contain shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-white/10 shrink-0" />
                )}
                <span className="text-white/80 font-light truncate">
                  {team.team.shortName ?? team.team.name}
                </span>
              </div>

              <span className="w-7 text-center text-white/30 text-[11px]">{team.playedGames}</span>
              <span className="w-7 text-center text-white/30 text-[11px] hidden sm:block">{team.won}</span>
              <span className="w-7 text-center text-white/30 text-[11px] hidden sm:block">{team.draw}</span>
              <span className="w-7 text-center text-white/30 text-[11px] hidden sm:block">{team.lost}</span>
              <span className={`w-9 text-center text-[11px] ${team.goalDifference > 0 ? "text-green-400/70" : team.goalDifference < 0 ? "text-red-400/70" : "text-white/30"}`}>
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </span>
              <span className="w-9 text-right text-white font-bold">{team.points}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.05]">
        {[
          { color: "bg-blue-500/50", label: "Champions League" },
          { color: "bg-amber-500/50", label: "Europa League" },
          { color: "bg-red-500/50", label: "Relegation" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-sm ${item.color}`} />
            <span className="text-[9px] text-white/25">{item.label}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function StandingsTableSkeleton() {
  return <CardSkeleton rows={10} />
}

// Also export FormPill for use in other components
export { FormPill }
