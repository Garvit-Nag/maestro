import { CardShell, CardSkeleton } from "./card-shell"

interface Fixture {
  id?: number
  homeTeam?: { name: string; shortName?: string; crest?: string }
  awayTeam?: { name: string; shortName?: string; crest?: string }
  utcDate?: string
  status?: string
  score?: { fullTime?: { home: number | null; away: number | null } }
}

interface CompetitionGroup {
  name?: string
  emblem?: string
  fixtures?: Fixture[]
}

export function WeekendFixtureBoard({ data }: { data: Fixture[] | CompetitionGroup[] | unknown }) {
  let groups: CompetitionGroup[] = []

  if (Array.isArray(data)) {
    if (data.length && (data[0] as CompetitionGroup).fixtures) {
      groups = data as CompetitionGroup[]
    } else {
      // Raw fixtures — just show them flat
      groups = [{ name: "Fixtures", fixtures: data as Fixture[] }]
    }
  }

  if (!groups.length) return <div className="text-white/30 text-[13px]">No fixtures found.</div>

  return (
    <CardShell label="Weekend Fixtures">
      <div className="space-y-5">
        {groups.slice(0, 5).map((group, gIdx) => (
          <div key={gIdx}>
            {group.name && (
              <div className="flex items-center gap-2 mb-2">
                {group.emblem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={group.emblem} alt="" className="w-4 h-4 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
                )}
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{group.name}</p>
              </div>
            )}
            <div className="space-y-1.5">
              {(group.fixtures ?? []).slice(0, 6).map((f, idx) => {
                const date = f.utcDate ? new Date(f.utcDate) : null
                const timeStr = date?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? ""
                const isFinished = f.status === "FINISHED"
                const score = f.score?.fullTime

                return (
                  <div key={f.id ?? idx} className="flex items-center gap-2 py-2 px-3 rounded-xl text-[12px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[10px] text-[#C9A84C]/60 w-10 shrink-0">{timeStr}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="flex-1 text-right text-white/65 font-light truncate">{(f.homeTeam as { shortName?: string; name?: string })?.shortName ?? f.homeTeam?.name}</span>
                      <span className="w-12 text-center font-black text-white/80 shrink-0">
                        {isFinished && score?.home != null ? `${score.home}–${score.away}` : "vs"}
                      </span>
                      <span className="flex-1 text-white/65 font-light truncate">{(f.awayTeam as { shortName?: string; name?: string })?.shortName ?? f.awayTeam?.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function WeekendFixtureBoardSkeleton() {
  return <CardSkeleton rows={5} />
}
