import { CardShell, CardSkeleton } from "./card-shell"

interface Fixture {
  id?: number
  utcDate?: string
  status?: string
  homeTeam?: { name: string; shortName?: string; crest?: string }
  awayTeam?: { name: string; shortName?: string; crest?: string }
  competition?: { name: string; emblem?: string }
  score?: { fullTime?: { home?: number | null; away?: number | null } }
}

function TeamBadge({ team }: { team?: { name: string; crest?: string } }) {
  if (!team) return null
  return (
    <div className="flex items-center gap-2">
      {team.crest ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={team.crest} alt="" className="w-5 h-5 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
      ) : (
        <div className="w-5 h-5 rounded-full bg-white/10" />
      )}
      <span className="text-[13px] text-white/80 font-light">{(team as { shortName?: string; name: string }).shortName ?? team.name}</span>
    </div>
  )
}

export function FixtureList({ data }: { data: Fixture[] | unknown }) {
  const fixtures = (Array.isArray(data) ? data : []) as Fixture[]

  if (!fixtures.length) return <div className="text-white/30 text-[13px]">No fixtures found.</div>

  return (
    <CardShell label="Fixtures">
      <div className="space-y-2">
        {fixtures.slice(0, 8).map((fixture, idx) => {
          const date = fixture.utcDate ? new Date(fixture.utcDate) : null
          const dateStr = date?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) ?? ""
          const timeStr = date?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? ""
          const isFinished = fixture.status === "FINISHED"
          const score = fixture.score?.fullTime
          const hasScore = score?.home != null && score?.away != null

          return (
            <div
              key={fixture.id ?? idx}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Date/Time */}
              <div className="shrink-0 w-14 text-right">
                <p className="text-[10px] text-white/40">{dateStr}</p>
                <p className="text-[11px] text-[#C9A84C]/70">{timeStr}</p>
              </div>

              {/* Teams */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="flex-1 flex justify-end">
                  <TeamBadge team={fixture.homeTeam} />
                </div>

                <div className="shrink-0 w-14 text-center">
                  {isFinished && hasScore ? (
                    <span className="text-[14px] font-black text-white">{score!.home} — {score!.away}</span>
                  ) : (
                    <span className="text-[11px] text-white/25">vs</span>
                  )}
                </div>

                <div className="flex-1">
                  <TeamBadge team={fixture.awayTeam} />
                </div>
              </div>

              {/* Competition */}
              {fixture.competition && (
                <div className="shrink-0">
                  <span className="text-[9px] text-white/20 uppercase tracking-wide">{fixture.competition.name}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </CardShell>
  )
}

export function FixtureListSkeleton() {
  return <CardSkeleton rows={5} />
}
