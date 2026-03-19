import { CardShell, CardSkeleton } from "./card-shell"

interface H2HMatch {
  id?: number
  utcDate?: string
  homeTeam?: { name: string; shortName?: string }
  awayTeam?: { name: string; shortName?: string }
  score?: { fullTime?: { home: number | null; away: number | null }; winner?: string }
  competition?: { name: string }
}

export function H2HTimeline({ data }: { data: H2HMatch[] | unknown }) {
  const matches = (Array.isArray(data) ? data : []) as H2HMatch[]

  if (!matches.length) return <div className="text-white/30 text-[13px]">No head-to-head data.</div>

  return (
    <CardShell label="Head to Head">
      <div className="space-y-2">
        {matches.slice(0, 8).map((match, idx) => {
          const score = match.score?.fullTime
          const winner = match.score?.winner
          const date = match.utcDate ? new Date(match.utcDate) : null

          return (
            <div
              key={match.id ?? idx}
              className="flex items-center gap-3 py-2 px-3 rounded-xl text-[12px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-[10px] text-white/25 w-20 shrink-0">
                {date?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
              </span>

              <div className="flex-1 flex items-center gap-2">
                <span className={`flex-1 text-right text-[12px] ${winner === "HOME_TEAM" ? "text-white/90 font-semibold" : "text-white/45 font-light"}`}>
                  {(match.homeTeam as { shortName?: string; name?: string })?.shortName ?? match.homeTeam?.name}
                </span>
                <span className="text-[13px] font-black text-white shrink-0 w-14 text-center">
                  {score?.home ?? "?"} — {score?.away ?? "?"}
                </span>
                <span className={`flex-1 text-[12px] ${winner === "AWAY_TEAM" ? "text-white/90 font-semibold" : "text-white/45 font-light"}`}>
                  {(match.awayTeam as { shortName?: string; name?: string })?.shortName ?? match.awayTeam?.name}
                </span>
              </div>

              <span className="text-[9px] text-white/20 w-16 shrink-0 text-right truncate">
                {match.competition?.name}
              </span>
            </div>
          )
        })}
      </div>
    </CardShell>
  )
}

export function H2HTimelineSkeleton() {
  return <CardSkeleton rows={6} />
}
